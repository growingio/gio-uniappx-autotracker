import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEMO_DIR = path.join(PROJECT_ROOT, 'demos/growingio-showcase');
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

function clearUnpackage() {
  const target = path.join(DEMO_DIR, 'unpackage');
  if (!fs.existsSync(target)) {
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
  log(`cleared ${path.relative(PROJECT_ROOT, target)}`);
}

function buildArgs(platform, dev) {
  if (dev) {
    return [
      'launch',
      platform,
      '--project',
      DEMO_DIR,
      '--compile',
      'true',
      '--continue-on-error',
      'true',
    ];
  }
  return ['publish', platform, '--project', DEMO_DIR];
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
  log(`launching ${options.platform} demo (${options.dev ? 'dev' : 'publish'})`);
  await runHBuilderX(options.platform, options.dev);
}

main().catch((error) => fail(String(error)));
