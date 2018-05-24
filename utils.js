/**
 * Utilities for implementing Tuture CLI.
 */

const cp = require('child_process');
const fs = require('fs-extra');
const git = require('simple-git/promise')('.');
const ora = require('ora');
const path = require('path');
const promptly = require('promptly');
const signale = require('signale');
const yaml = require('js-yaml');

const EXPLAIN_PLACEHOLDER = '<YOUR EXPLANATION HERE>';
const TUTURE_ROOT = '.tuture';

async function getGitLogs() {
  let result = null;
  try {
    result = await git.raw(['log', '--oneline', '--no-merges']);
  } catch (e) {
    console.log('No git executable detected!');
    process.exit(1);
  }
  let logs = result.split('\n');
  logs = logs.slice(0, logs.length - 1);
  return logs;
}

async function getGitDiff(commit) {
  let result = null;
  try {
    result = await git.raw(['show', commit, '--name-only']);
  } catch (e) {
    console.log('No git executable detected!');
    process.exit(1);
  }
  let changedFiles = result.split('\n\n').slice(-1)[0].split('\n');
  changedFiles = changedFiles.slice(0, changedFiles.length - 1);
  return changedFiles.map(file => ({ file, explain: EXPLAIN_PLACEHOLDER }));
}

async function storeDiff(commit) {
  let result = null;
  try {
    result = await git.raw(['show', commit]);
  } catch (e) {
    console.log('No git executable detected!');
    process.exit(1);
  }
  git.raw(['show', commit]);

  const diff = result.split('\n\n').slice(-1)[0];
  const diffPath = path.join(TUTURE_ROOT, 'diff', `${commit}.diff`);
  fs.writeFileSync(diffPath, diff);
}

async function makeSteps() {
  const logs = await getGitLogs();
  return logs.reverse().map(async (log) => {
    const commit = log.slice(0, 7);
    const msg = log.slice(8, log.length);
    await storeDiff(commit);
    return {
      name: msg,
      commit,
      explain: EXPLAIN_PLACEHOLDER,
      diff: await getGitDiff(commit),
    };
  });
}

function installRendererDeps() {
  process.chdir('.tuture/renderer');
  const spinner = ora('Installing renderer dependencies...').start();
  cp.exec('npm install', (err) => {
    spinner.stop();
    if (err) {
      signale.error('Renderer install failed. Please check if your npm is working.');
      process.exit(1);
    }
    signale.success('Renderer is successfully installed!');
  });
}

/**
 * Construct metadata object from user prompt
 * @param {boolean} shouldPrompt Whether `-y` option is provided
 * @returns {object} Metadata object to be dumped into tuture.yml
 */
exports.promptMetaData = async (shouldPrompt) => {
  const tuture = Object();
  if (!shouldPrompt) {
    tuture.name = 'My Awesome Tutorial';
    tuture.language = 'English';
  } else {
    // Ask for required fields.
    tuture.name = await promptly.prompt(
      'Tutorial Name: (My Awesome Tutorial) ',
      { default: 'My Awesome Tutorial' },
    );
    tuture.language = await promptly.prompt(
      'Tutorial Languange: (English) ',
      { default: 'English' },
    );

    // Ask for optional fields.
    const topics = await promptly.prompt('Topics: ', { default: '' });
    const email = await promptly.prompt('Maintainer Email: ', { default: '' });
    if (topics) tuture.topics = topics.split(/[ ,]+/);
    if (email) tuture.email = email;
  }

  return tuture;
};

// Make .tuture directoy and its subdirectories
// This operation is IDEMPOTENT.
exports.makeTutureDirs = () => {
  fs.mkdirpSync(path.join(TUTURE_ROOT, 'diff'));
  fs.mkdirpSync(path.join(TUTURE_ROOT, 'renderer'));
};

// Constructs "steps" section in tuture.yml and store diff files.
exports.getSteps = async () => {
  const spinner = ora('Extracting diffs from git log...').start();
  const steps = await makeSteps().then(async (resArr) => {
    const res = await Promise.all(resArr);
    spinner.stop();
    signale.success('Diff files are created!');
    return res;
  });

  return steps;
};

exports.writeTutureYML = (tuture) => {
  fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
};

// Copy renderer to user's tutorial root and install it.
exports.createRenderer = () => {
  try {
    const spinner = ora('Creating Tuture renderer...').start();
    fs.copy(
      path.join(__dirname, 'renderer'),
      path.join('.', TUTURE_ROOT, 'renderer'),
    ).then((() => {
      spinner.stop();
      installRendererDeps();
    }));
  } catch (e) {
    signale.error(e);
    process.exit(1);
  }
};

exports.startRenderer = () => {
  process.chdir('.tuture/renderer');
  cp.exec('npm start');
  signale.success('Tuture renderer is served on http://localhost:3000.');
};

exports.appendGitignore = () => {
  const ignoreRules = '# Tuture supporting files\n.tuture\n';
  if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', ignoreRules);
  } else {
    fs.appendFileSync('.gitignore', `\n${ignoreRules}`);
  }
};

exports.removeTutureFiles = async (force) => {
  const answer = force ? true : await promptly.confirm(
    'Are you sure? [y/N] ',
    { default: 'n' },
  );
  if (!answer) {
    console.log('Aborted!');
    process.exit(1);
  }

  fs.removeSync('tuture.yml');

  const spinner = ora('Deleting Tuture files...').start();
  fs.remove(TUTURE_ROOT).then(() => {
    spinner.stop();
    signale.success('Tuture suite has been destroyed!');
  });
};