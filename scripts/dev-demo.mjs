import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEMO_DIR = PROJECT_ROOT;
const HBX_CLI = process.env.HBX_CLI ?? '/Applications/HBuilderX.app/Contents/MacOS/cli';
const SUPPORTED = ['web', 'mp-weixin', 'app-android', 'app-ios', 'app-harmony'];

function log(prefix, message) {
  process.stdout.write(`[dev-demo:${prefix}] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[dev-demo:error] ${message}\n`);
  process.exit(1);
}

function summarizeLauncherText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const summaries = [];
  for (const line of lines) {
    if (/Please\s*Login/i.test(line)) {
      summaries.push('HBuilderX is not logged in');
      continue;
    }
    if (/Incompatible processor/i.test(line)) {
      summaries.push('HBuilderX web launcher is incompatible with the current processor');
      continue;
    }
    if (/error/i.test(line) || /failed/i.test(line)) {
      summaries.push(line);
    }
  }
  return summaries;
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

function prepareDemo(options) {
  if (options.keepUnpackage) {
    return;
  }
  const target = path.join(DEMO_DIR, 'unpackage');
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    log('info', `cleared ${path.relative(PROJECT_ROOT, target)}`);
  }
}

function launchWebDemo(options) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let resolvedUrl = '';
    let outputBuffer = '';

    const rejectWithKnownLauncherError = () => {
      if (/Incompatible processor/i.test(outputBuffer)) {
        reject(
          new Error(
            'HBuilderX web launcher is incompatible with the current processor; the web demo did not start. ' +
              'Check the installed HBuilderX build or run the demo from a compatible host.',
          ),
        );
        return true;
      }
      if (/Please\s*Login/i.test(outputBuffer)) {
        reject(new Error('HBuilderX is not logged in'));
        return true;
      }
      return false;
    };

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

    const child = spawn(
      HBX_CLI,
      ['launch', 'web', '--project', DEMO_DIR, '--continue-on-error', 'true'],
      {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
      },
    );

    const onData = (chunk) => {
      const text = chunk.toString();
      outputBuffer += text;
      process.stdout.write(text);
      resolveIfReady(text);
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('error', reject);
    child.on('close', (code) => {
      if (settled) {
        return;
      }
      if (!rejectWithKnownLauncherError()) {
        reject(
          new Error(
            `HBuilderX cli exited with code ${code}. ` +
              (resolvedUrl.length > 0 ? `Last known local url: ${resolvedUrl}. ` : '') +
              summarizeLauncherText(outputBuffer).join(' | '),
          ),
        );
      }
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  assertPlatform(options.platform);

  if (options.prepareOnly) {
    prepareDemo(options);
    log('info', `demo environment is ready for ${options.platform}`);
    return;
  }

  assertHBuilderX();
  prepareDemo(options);

  if (options.platform === 'web') {
    if (options.noWatch) {
      log('info', 'web launch will rely on HBuilderX built-in live reload');
    }
    await launchWebDemo(options);
    return;
  }

  const extraArgs = ['--dev'];
  if (options.keepUnpackage) {
    extraArgs.push('--keep-unpackage');
  }
  runNodeScript('demo-build.mjs', [options.platform, ...extraArgs]);
}

main().catch((error) => fail(String(error)));
