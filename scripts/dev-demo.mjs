import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEMO_DIR = path.join(PROJECT_ROOT, 'demos/growingio-showcase');
const HBX_CLI = process.env.HBX_CLI ?? '/Applications/HBuilderX.app/Contents/MacOS/cli';
const WATCH_ROOT = PROJECT_ROOT;
const IGNORED_SEGMENTS = [
  `${path.sep}.git${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}dist${path.sep}`,
  `${path.sep}unpackage${path.sep}`,
  `${path.sep}.hbuilderx${path.sep}`,
];
const SUPPORTED = ['web', 'mp-weixin', 'app-android', 'app-ios', 'app-harmony'];

let activePlatform = 'web';
let webChild = null;
let debounceTimer = null;
let rebuilding = false;
let pendingKind = null;

function log(prefix, message) {
  process.stdout.write(`[dev-demo:${prefix}] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[dev-demo:error] ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const platform = argv[0] ?? '';
  return {
    platform,
    noWatch: argv.includes('--no-watch'),
    prepareOnly: argv.includes('--prepare-only'),
    keepUnpackage: argv.includes('--keep-unpackage'),
    openBrowser: argv.includes('--open-browser'),
  };
}

function assertPlatform(platform) {
  if (!SUPPORTED.includes(platform)) {
    fail(
      `usage: node ./scripts/dev-demo.mjs <platform> [--no-watch] [--prepare-only] [--keep-unpackage] [--open-browser]\n` +
        `supported: ${SUPPORTED.join(', ')}\n` +
        `got: ${platform || '(none)'}`,
    );
  }
}

function openBrowser(url) {
  try {
    execFileSync('open', [url], {
      cwd: PROJECT_ROOT,
      stdio: 'ignore',
    });
    log('info', `opened browser: ${url}`);
  } catch (_error) {
    log('warn', `could not open browser automatically: ${url}`);
  }
}

function assertHBuilderX() {
  if (!fs.existsSync(HBX_CLI)) {
    fail(
      `HBuilderX cli not found at ${HBX_CLI}\n` +
        'install HBuilderX or set HBX_CLI=/path/to/cli',
    );
  }
}

function runNodeScript(scriptName, extraArgs = []) {
  const scriptPath = path.join(PROJECT_ROOT, 'scripts', scriptName);
  execFileSync(process.execPath, [scriptPath, ...extraArgs], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
  });
}

function prepareBundle() {
  runNodeScript('build.mjs');
  runNodeScript('verify-bundle.mjs');
}

function isIgnored(filePath) {
  return IGNORED_SEGMENTS.some((segment) => filePath.includes(segment));
}

function isDemoPath(filePath) {
  return filePath.startsWith(DEMO_DIR);
}

function shouldWatch(filePath) {
  if (isIgnored(filePath)) {
    return false;
  }
  const ext = path.extname(filePath).toLowerCase();
  return [
    '.uts',
    '.uvue',
    '.ts',
    '.js',
    '.mjs',
    '.json',
    '.html',
    '.css',
    '.md',
  ].includes(ext);
}

function scheduleRebuild(kind, changedPath) {
  if (!shouldWatch(changedPath)) {
    return;
  }
  pendingKind = kind === 'sdk+demo' || pendingKind === 'sdk+demo' ? 'sdk+demo' : kind;
  if (debounceTimer != null) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void flushRebuildQueue();
  }, 300);
}

async function flushRebuildQueue() {
  if (rebuilding || pendingKind == null) {
    return;
  }
  rebuilding = true;
  const kind = pendingKind;
  pendingKind = null;

  try {
    if (activePlatform === 'web') {
      if (kind === 'sdk+demo') {
        prepareBundle();
        log('ok', 'rebuilt SDK bundle for web demo');
      }
    } else {
      if (kind === 'sdk+demo') {
        prepareBundle();
      }
      const args = [activePlatform, '--dev', '--keep-unpackage'];
      runNodeScript('demo-build.mjs', args);
      log('ok', `rebuilt ${activePlatform} demo`);
    }
  } catch (error) {
    log('warn', `rebuild failed: ${String(error)}`);
  } finally {
    rebuilding = false;
    if (pendingKind != null) {
      void flushRebuildQueue();
    }
  }
}

function startWatching() {
  fs.watch(WATCH_ROOT, { recursive: true }, (_eventType, filename) => {
    if (!filename) {
      return;
    }
    const absolutePath = path.join(WATCH_ROOT, String(filename));
    if (!shouldWatch(absolutePath)) {
      return;
    }
    const kind = isDemoPath(absolutePath) ? 'demo' : 'sdk+demo';
    if (activePlatform === 'web' && kind === 'demo') {
      return;
    }
    scheduleRebuild(kind, absolutePath);
  });
  log('info', `watching ${activePlatform} source changes`);
  if (activePlatform === 'web') {
    log('info', 'web demo page hot updates are handled by HBuilderX Vite; this watcher only rebuilds the SDK bundle');
  }
}

function launchWebDemo(options) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let resolvedUrl = '';
    let outputBuffer = '';

    const resolveIfReady = (text) => {
      const match = text.match(/-\s+Local:\s+(http:\/\/\S+)/);
      if (match == null) {
        return;
      }
      resolvedUrl = match[1];
      if (settled) {
        return;
      }
      settled = true;
      log('ok', `web demo ready: ${resolvedUrl}`);
      if (options.openBrowser) {
        openBrowser(resolvedUrl);
      }
      resolve();
    };

    webChild = spawn(
      HBX_CLI,
      ['launch', 'web', '--project', DEMO_DIR, '--continue-on-error', 'true'],
      {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
      },
    );
    webChild.stdout.on('data', (chunk) => {
      const text = String(chunk);
      outputBuffer += text;
      process.stdout.write(text);
      resolveIfReady(text);
    });
    webChild.stderr.on('data', (chunk) => {
      const text = String(chunk);
      outputBuffer += text;
      process.stderr.write(text);
      resolveIfReady(text);
    });
    webChild.on('error', (error) => {
      if (settled) {
        return;
      }
      settled = true;
      reject(error);
    });
    webChild.on('exit', (code) => {
      webChild = null;
      if (!settled) {
        settled = true;
        if (/Please\s*Login/i.test(outputBuffer)) {
          reject(new Error('HBuilderX is not logged in'));
          return;
        }
        reject(new Error(`HBuilderX web launcher exited with code ${code}`));
        return;
      }
      if (code !== 0 && code !== null) {
        log('warn', `web demo process exited with code ${code}`);
      }
    });
  });
}

function installShutdownHooks() {
  const shutdown = () => {
    if (webChild != null && webChild.exitCode === null) {
      webChild.kill('SIGTERM');
    }
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  process.once('exit', shutdown);
}

async function initialRun(options) {
  prepareBundle();

  if (options.prepareOnly) {
    log('ok', `demo environment is ready for ${activePlatform}`);
    return;
  }

  assertHBuilderX();

  if (activePlatform === 'web') {
    await launchWebDemo(options);
    return;
  }

  const args = [activePlatform, '--dev'];
  if (options.keepUnpackage) {
    args.push('--keep-unpackage');
  }
  runNodeScript('demo-build.mjs', args);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  assertPlatform(options.platform);
  activePlatform = options.platform;
  installShutdownHooks();
  await initialRun(options);

  if (options.prepareOnly || options.noWatch) {
    if (activePlatform === 'web' && webChild != null) {
      await new Promise((resolve) => {
        webChild.on('exit', () => resolve(null));
      });
    }
    return;
  }

  startWatching();
}

main().catch((error) => fail(String(error)));
