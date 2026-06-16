import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_BUNDLE = path.join(
  PROJECT_ROOT,
  'dist/uni_modules/gio-uniappx-autotracker',
);

const REQUIRED_FILES = [
  'index.uts',
  'plugin.uts',
  'package.json',
  'uni_modules.json',
  'README.md',
  'readme.md',
  'utssdk/index.uts',
  'utssdk/interface.uts',
  'utssdk/common/config.uts',
  'utssdk/common/utils.uts',
  'utssdk/common/core/tracker.uts',
  'utssdk/common/core/uploader.uts',
  'utssdk/common/userStore/index.uts',
  'utssdk/common/dataStore/index.uts',
  'utssdk/common/dataStore/context/system-context.uts',
  'utssdk/common/dataStore/eventBuilder/index.uts',
  'utssdk/common/dataStore/page/page-store.uts',
  'utssdk/common/runtime/index.uts',
  'utssdk/web/index.uts',
  'utssdk/web/runtime.uts',
  'utssdk/web/package.json',
  'utssdk/mp-weixin/index.uts',
  'utssdk/app-js/index.uts',
  'utssdk/app-android/index.uts',
  'utssdk/app-android/config.json',
  'utssdk/app-ios/index.uts',
  'utssdk/app-ios/config.json',
  'utssdk/app-harmony/index.uts',
  'utssdk/app-harmony/config.json',
  'utssdk/common/miniprogram.uts',
  'utssdk/common/route.uts',
];

function fail(message) {
  process.stderr.write(`[verify-bundle] ${message}\n`);
  process.exit(1);
}

function log(message) {
  process.stdout.write(`[verify-bundle] ${message}\n`);
}

function ensureBundleExists() {
  if (!fs.existsSync(DIST_BUNDLE)) {
    fail('missing dist bundle, run `npm run build` first');
  }
}

function ensureRequiredFiles() {
  const missing = REQUIRED_FILES.filter((relativePath) => {
    return !fs.existsSync(path.join(DIST_BUNDLE, relativePath));
  });
  if (missing.length > 0) {
    fail(`missing required files:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  }
}

function ensurePlatformsMeta() {
  const metaPath = path.join(DIST_BUNDLE, 'uni_modules.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const uniAppX = meta?.uni_modules?.platforms?.client?.['uni-app-x'];
  if (uniAppX == null) {
    fail('uni_modules.json is missing uni-app-x platform metadata');
  }

  const hasWeb = uniAppX.web != null;
  const hasAndroid = uniAppX.app?.android != null;
  const hasIos = uniAppX.app?.ios != null;
  const hasHarmony = uniAppX.app?.harmony != null;
  const hasMpWeixin = uniAppX.mp?.weixin != null;

  if (!hasWeb || !hasAndroid || !hasIos || !hasHarmony || !hasMpWeixin) {
    fail('uni_modules.json does not declare the expected five target platforms');
  }
}

function main() {
  ensureBundleExists();
  ensureRequiredFiles();
  ensurePlatformsMeta();
  log('bundle structure and platform metadata look valid');
}

main();
