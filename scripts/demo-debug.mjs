import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_DEMO = path.join(PROJECT_ROOT, 'demos/growingio-showcase');
const DEFAULT_UNPACKAGE = path.join(DEFAULT_DEMO, 'unpackage');

function log(message) {
  process.stdout.write(`[demo-debug] ${message}\n`);
}

function fail(message) {
  process.stderr.write(`[demo-debug] ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  let demoPath = DEFAULT_DEMO;
  let openEditor = true;
  let clearUnpackage = true;

  for (const arg of argv) {
    if (arg.startsWith('--demo=')) {
      demoPath = path.resolve(arg.slice('--demo='.length));
      continue;
    }
    if (arg === '--no-open') {
      openEditor = false;
      continue;
    }
    if (arg === '--keep-unpackage') {
      clearUnpackage = false;
      continue;
    }
    fail(`unknown argument: ${arg}`);
  }

  return {
    demoPath,
    openEditor,
    clearUnpackage,
  };
}

function runNodeScript(scriptName, extraArgs = []) {
  const scriptPath = path.join(PROJECT_ROOT, 'scripts', scriptName);
  execFileSync(process.execPath, [scriptPath, ...extraArgs], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
  });
}

function ensureDemoExists(demoPath) {
  if (!fs.existsSync(demoPath)) {
    fail(`demo path does not exist: ${demoPath}`);
  }
}

function clearDemoUnpackage(demoPath) {
  const target = demoPath === DEFAULT_DEMO
    ? DEFAULT_UNPACKAGE
    : path.join(demoPath, 'unpackage');

  if (!fs.existsSync(target)) {
    return;
  }

  fs.rmSync(target, { recursive: true, force: true });
  log(`cleared ${path.relative(PROJECT_ROOT, target)}`);
}

function ensureDemoBundle(demoPath) {
  if (demoPath === DEFAULT_DEMO) {
    log('default showcase demo uses the copied dist bundle from build output');
    return;
  }

  runNodeScript('install-to-demo.mjs', [`--demo=${demoPath}`]);
}

function openInHBuilderX(demoPath) {
  try {
    execFileSync('open', ['-a', 'HBuilderX', demoPath], {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });
    log(`opened demo in HBuilderX: ${path.relative(PROJECT_ROOT, demoPath)}`);
  } catch (error) {
    log('could not auto-open HBuilderX; please open the demo project manually');
  }
}

function printNextSteps(demoPath, openedEditor) {
  log(`demo is ready: ${demoPath}`);
  if (openedEditor) {
    log('next step: in HBuilderX choose a target and click Run or Debug for the showcase project');
    return;
  }
  log('next step: open the demo project in HBuilderX and click Run or Debug');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  ensureDemoExists(options.demoPath);

  runNodeScript('build.mjs');
  runNodeScript('verify-bundle.mjs');

  if (options.clearUnpackage) {
    clearDemoUnpackage(options.demoPath);
  }

  ensureDemoBundle(options.demoPath);

  if (options.openEditor) {
    openInHBuilderX(options.demoPath);
  }

  printNextSteps(options.demoPath, options.openEditor);
}

main();
