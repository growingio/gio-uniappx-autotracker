import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_ROOT = path.join(PROJECT_ROOT, 'uni_modules/gio-uniappx-autotracker');
const BUNDLE_NAME = 'gio-uniappx-autotracker';
const DIST_BUNDLE = path.join(PROJECT_ROOT, 'dist/uni_modules', BUNDLE_NAME);
const RELEASE_DIR = path.join(PROJECT_ROOT, 'dist/release');

function fail(message) {
  process.stderr.write(`[release-pack] ${message}\n`);
  process.exit(1);
}

function log(message) {
  process.stdout.write(`[release-pack] ${message}\n`);
}

function ensureBundle() {
  if (!fs.existsSync(DIST_BUNDLE)) {
    fail(`dist bundle not found: ${path.relative(PROJECT_ROOT, DIST_BUNDLE)}; run npm run build first`);
  }

  const required = [
    'gdp.uts',
    'index.uts',
    'plugin.uts',
    'package.json',
    'uni_modules.json',
    'utssdk/index.uts',
  ];
  for (const rel of required) {
    const abs = path.join(DIST_BUNDLE, rel);
    if (!fs.existsSync(abs)) {
      fail(`bundle incomplete: missing ${rel}`);
    }
  }
}

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
  if (typeof pkg.version !== 'string' || pkg.version.length === 0) {
    fail('package.json version is missing');
  }
  return pkg.version;
}

function main() {
  ensureBundle();
  const version = readVersion();
  fs.mkdirSync(RELEASE_DIR, { recursive: true });
  const archive = path.join(RELEASE_DIR, `${BUNDLE_NAME}-${version}.tgz`);
  if (fs.existsSync(archive)) {
    fs.rmSync(archive);
  }

  execFileSync('tar', ['-czf', archive, '-C', path.dirname(DIST_BUNDLE), path.basename(DIST_BUNDLE)], {
    stdio: 'inherit',
  });

  const size = fs.statSync(archive).size;
  log(`packed ${path.relative(PROJECT_ROOT, archive)} (${size} bytes)`);
}

main();
