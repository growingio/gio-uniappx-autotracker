import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUNDLE_NAME = 'gio-uniappx-autotracker';
const SHOWCASE_BUNDLE = path.join(
  PROJECT_ROOT,
  'demos/growingio-showcase/uni_modules',
  BUNDLE_NAME,
);

// Files/dirs linked straight at the live source so HBuilderX always compiles
// the latest code without a build step. uni_modules.json is derived from
// package.json, so it is generated as a real file instead of linked.
const LINK_FILES = ['index.uts', 'plugin.uts', 'package.json', 'README.md'];
const LINK_DIRS = ['utssdk'];

function log(message) {
  process.stdout.write(`[link-to-demo] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[link-to-demo] ${message}\n`);
  process.exit(1);
}

function removePath(target) {
  if (!fs.existsSync(target) && !fs.lstatSync(target, { throwIfNoEntry: false })) {
    return;
  }
  const stat = fs.lstatSync(target, { throwIfNoEntry: false });
  if (stat == null) {
    return;
  }
  if (stat.isSymbolicLink()) {
    fs.unlinkSync(target);
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function linkEntry(name, type) {
  const source = path.join(PROJECT_ROOT, name);
  if (!fs.existsSync(source)) {
    fail(`missing source: ${name}`);
  }
  const dest = path.join(SHOWCASE_BUNDLE, name);
  removePath(dest);
  // Relative target keeps the link valid if the repo is moved/cloned elsewhere.
  const relative = path.relative(path.dirname(dest), source);
  fs.symlinkSync(relative, dest, type);
  log(`linked ${name} -> ${relative}`);
}

function writeUniModulesJson() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'),
  );
  const meta = {
    id: pkg.id,
    displayName: pkg.displayName,
    version: pkg.version,
    description: pkg.description,
    engines: pkg.engines,
    dcloudext: pkg.dcloudext,
    uni_modules: pkg.uni_modules,
  };
  fs.writeFileSync(
    path.join(SHOWCASE_BUNDLE, 'uni_modules.json'),
    `${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  );
  log('generated uni_modules.json');
}

function unlink() {
  removePath(SHOWCASE_BUNDLE);
  log('removed showcase bundle; run `npm run build` to restore a copied bundle');
}

function link() {
  // Wipe whatever is there (copied bundle or stale links) and rebuild as links.
  removePath(SHOWCASE_BUNDLE);
  fs.mkdirSync(SHOWCASE_BUNDLE, { recursive: true });
  for (const dir of LINK_DIRS) {
    linkEntry(dir, 'dir');
  }
  for (const file of LINK_FILES) {
    linkEntry(file, 'file');
  }
  writeUniModulesJson();
  log(`linked showcase bundle: ${path.relative(PROJECT_ROOT, SHOWCASE_BUNDLE)}`);
  log('HBuilderX will now compile live source; no build/sync needed.');
}

function main() {
  if (process.argv.includes('--unlink')) {
    unlink();
    return;
  }
  link();
}

main();
