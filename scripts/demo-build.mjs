import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEMO_DIR = path.join(PROJECT_ROOT, 'demos/growingio-showcase');
// HBuilderX resolves `--project <abs-path>` to the *enclosing* imported project.
// Because the demo is nested inside the repo (also imported, as a plain "Web"
// project), an absolute path matches the repo root and HBuilderX rejects the
// launch with "项目类型为Web，暂不支持". Passing the project *name* matches the
// demo's own entry (UniApp_VUE) unambiguously.
const DEMO_PROJECT = path.basename(DEMO_DIR);
const DIST_BUNDLE = path.join(
  PROJECT_ROOT,
  'dist/uni_modules/gio-uniappx-autotracker/index.uts',
);
const HBX_CLI = process.env.HBX_CLI ?? '/Applications/HBuilderX.app/Contents/MacOS/cli';
const SUPPORTED = ['web', 'mp-weixin', 'app-android', 'app-ios', 'app-harmony'];

function log(message) {
  process.stdout.write(`[demo-build] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[demo-build] ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const platform = argv[0] ?? '';
  return {
    platform,
    dev: argv.includes('--dev'),
    prepareOnly: argv.includes('--prepare-only'),
    keepUnpackage: argv.includes('--keep-unpackage'),
  };
}

function assertPlatform(platform) {
  if (!SUPPORTED.includes(platform)) {
    fail(
      `usage: node ./scripts/demo-build.mjs <platform> [--dev] [--prepare-only] [--keep-unpackage]\n` +
        `supported: ${SUPPORTED.join(', ')}\n` +
        `got: ${platform || '(none)'}`,
    );
  }
}

function assertBundleBuilt() {
  if (!fs.existsSync(DIST_BUNDLE)) {
    fail('SDK bundle not found; run `npm run build` first');
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

function readCommandText(command, args) {
  try {
    return execFileSync(command, args, {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    const stderr = typeof error?.stderr === 'string'
      ? error.stderr.trim()
      : Buffer.isBuffer(error?.stderr)
        ? String(error.stderr).trim()
        : '';
    return stderr.length > 0 ? stderr : null;
  }
}

function assertIosSimulatorRuntime() {
  const developerDir = readCommandText('xcode-select', ['-p']);
  if (developerDir == null || developerDir.length == 0) {
    fail(
      'iOS demo requires a working Xcode toolchain, but `xcode-select -p` is unavailable.\n' +
        'Install Xcode and switch the active developer directory before running `npm run dev:demo-ios`.',
    );
  }

  if (developerDir.includes('CommandLineTools')) {
    fail(
      'iOS demo requires the iOS Simulator from full Xcode, but the active developer directory is only CommandLineTools:\n' +
        `${developerDir}\n` +
        'Install Xcode and run:\n' +
        'sudo xcode-select -s /Applications/Xcode.app/Contents/Developer',
    );
  }

  const simctlResult = readCommandText('xcrun', ['simctl', 'list', 'devices', 'available']);
  if (simctlResult == null || simctlResult.length == 0 || simctlResult.includes('unable to find utility "simctl"')) {
    fail(
      'iOS demo could not find an available Simulator runtime.\n' +
        'Make sure full Xcode is installed, open Xcode once to finish setup, and verify `xcrun simctl list devices available` works.',
    );
  }
}

function clearUnpackage() {
  const target = path.join(DEMO_DIR, 'unpackage');
  if (!fs.existsSync(target)) {
    return;
  }
  // A previous HBuilderX launch (e.g. the iOS simulator build) may still be
  // writing into unpackage when we switch platforms. `force` only ignores
  // ENOENT, so a concurrent writer surfaces as ENOTEMPTY/EBUSY — retry briefly.
  fs.rmSync(target, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  log(`cleared ${path.relative(PROJECT_ROOT, target)}`);
}

function buildArgs(platform, dev) {
  if (dev) {
    return [
      'launch',
      platform,
      '--project',
      DEMO_PROJECT,
      '--compile',
      'true',
      '--continue-on-error',
      'true',
    ];
  }
  return ['publish', platform, '--project', DEMO_PROJECT];
}

function runHBuilderX(platform, dev) {
  return new Promise((resolve, reject) => {
    const child = spawn(HBX_CLI, buildArgs(platform, dev), {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: false,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`HBuilderX cli exited with code ${code}`));
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  assertPlatform(options.platform);
  assertBundleBuilt();

  if (!options.keepUnpackage) {
    clearUnpackage();
  }

  if (options.prepareOnly) {
    log(`demo build environment is ready for ${options.platform}`);
    return;
  }

  assertHBuilderX();
  if (options.platform === 'app-ios' && options.dev) {
    assertIosSimulatorRuntime();
  }
  log(`launching ${options.platform} demo (${options.dev ? 'dev' : 'publish'})`);
  await runHBuilderX(options.platform, options.dev);
}

main().catch((error) => fail(String(error)));
