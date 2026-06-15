import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUNDLE_NAME = 'gio-uniappx-autotracker';
const DIST_BUNDLE = path.join(PROJECT_ROOT, 'dist/uni_modules', BUNDLE_NAME);

function parseArgs(argv) {
  const prefix = '--demo=';
  const hit = argv.find((item) => item.startsWith(prefix));
  return {
    demoPath: path.resolve(hit ? hit.slice(prefix.length) : path.join(PROJECT_ROOT, 'demos/growingio-showcase')),
  };
}

function fail(message) {
  process.stderr.write(`[install-to-demo] ${message}\n`);
  process.exit(1);
}

function log(message) {
  process.stdout.write(`[install-to-demo] ${message}\n`);
}

function ensureBundle() {
  if (!fs.existsSync(DIST_BUNDLE)) {
    fail(`dist bundle not found: ${path.relative(PROJECT_ROOT, DIST_BUNDLE)}; run npm run build first`);
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  ensureBundle();

  if (!fs.existsSync(options.demoPath)) {
    fail(`demo path does not exist: ${options.demoPath}`);
  }

  const target = path.join(options.demoPath, 'uni_modules', BUNDLE_NAME);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }

  copyRecursive(DIST_BUNDLE, target);
  log(`installed bundle into ${path.relative(PROJECT_ROOT, target)}`);
}

main();
