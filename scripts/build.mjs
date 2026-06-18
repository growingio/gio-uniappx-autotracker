import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_ROOT = path.join(PROJECT_ROOT, 'uni_modules/gio-uniappx-autotracker');
const BUNDLE_NAME = 'gio-uniappx-autotracker';
const DIST_BUNDLE = path.join(PROJECT_ROOT, 'dist/uni_modules', BUNDLE_NAME);

const ROOT_FILES = ['gdp.uts', 'index.uts', 'plugin.uts', 'package.json', 'README.md', 'readme.md'];
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
  const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));
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

function main() {
  for (const file of ROOT_FILES) {
    ensureExists(path.join(PACKAGE_ROOT, file));
  }
  for (const dir of ROOT_DIRS) {
    ensureExists(path.join(PACKAGE_ROOT, dir));
  }

  removeIfExists(DIST_BUNDLE);
  fs.mkdirSync(DIST_BUNDLE, { recursive: true });

  for (const file of ROOT_FILES) {
    copyRecursive(path.join(PACKAGE_ROOT, file), path.join(DIST_BUNDLE, file));
  }
  for (const dir of ROOT_DIRS) {
    copyRecursive(path.join(PACKAGE_ROOT, dir), path.join(DIST_BUNDLE, dir));
  }

  writeUniModulesJson();
  log(`bundle ready: ${path.relative(PROJECT_ROOT, DIST_BUNDLE)}`);
}

main();
