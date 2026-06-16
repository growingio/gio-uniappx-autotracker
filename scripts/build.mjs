import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUNDLE_NAME = 'gio-uniappx-autotracker';
const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');
const DIST_UNI_MODULES = path.join(DIST_ROOT, 'uni_modules');
const DIST_BUNDLE = path.join(DIST_UNI_MODULES, BUNDLE_NAME);
const SHOWCASE_BUNDLE = path.join(
  PROJECT_ROOT,
  'demos/growingio-showcase/uni_modules',
  BUNDLE_NAME,
);

const ROOT_FILES = ['index.uts', 'plugin.uts', 'package.json', 'README.md', 'readme.md'];
const ROOT_DIRS = ['utssdk'];

function log(message) {
  process.stdout.write(`[build] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[build] ${message}\n`);
  process.exit(1);
}

function ensureExists(target) {
  if (!fs.existsSync(target)) {
    fail(`missing required source: ${path.relative(PROJECT_ROOT, target)}`);
  }
}

function removeIfExists(target) {
  if (!fs.existsSync(target)) {
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function removePath(target) {
  if (!fs.existsSync(target)) {
    return;
  }
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(target);
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
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

function buildUniModulesMeta() {
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return {
    id: pkg.id,
    displayName: pkg.displayName,
    version: pkg.version,
    description: pkg.description,
    engines: pkg.engines,
    dcloudext: pkg.dcloudext,
    uni_modules: pkg.uni_modules,
  };
}

function writeUniModulesJson() {
  const meta = buildUniModulesMeta();
  const target = path.join(DIST_BUNDLE, 'uni_modules.json');
  fs.writeFileSync(target, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
}

function syncShowcaseBundle() {
  fs.mkdirSync(path.dirname(SHOWCASE_BUNDLE), { recursive: true });
  removePath(SHOWCASE_BUNDLE);
  copyRecursive(DIST_BUNDLE, SHOWCASE_BUNDLE);
  log(`synced showcase bundle: ${path.relative(PROJECT_ROOT, SHOWCASE_BUNDLE)}`);
}

function main() {
  for (const file of ROOT_FILES) {
    ensureExists(path.join(PROJECT_ROOT, file));
  }
  for (const dir of ROOT_DIRS) {
    ensureExists(path.join(PROJECT_ROOT, dir));
  }

  removeIfExists(DIST_BUNDLE);
  fs.mkdirSync(DIST_BUNDLE, { recursive: true });

  for (const file of ROOT_FILES) {
    copyRecursive(path.join(PROJECT_ROOT, file), path.join(DIST_BUNDLE, file));
  }
  for (const dir of ROOT_DIRS) {
    copyRecursive(path.join(PROJECT_ROOT, dir), path.join(DIST_BUNDLE, dir));
  }

  writeUniModulesJson();
  syncShowcaseBundle();

  log(`bundle ready: ${path.relative(PROJECT_ROOT, DIST_BUNDLE)}`);
}

main();
