/**
 * Utilities for implementing Tuture CLI.
 */

const cp = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const ora = require('ora');
const prompts = require('prompts');
const signale = require('signale');
const which = require('which');
const yaml = require('js-yaml');

const { tutureRoot } = require('./config');
const git = require('./git');

function ifTutureYmlExists() {
  return fs.existsSync('tuture.yml');
}

/**
 * Remove all Tuture-related files.
 */
async function removeTutureSuite() {
  await fs.remove('tuture.yml');
  await fs.remove(tutureRoot);
}

/**
 * Output error message and exit with status 1.
 * @param {String} message Error message
 */
function errAndExit(message) {
  signale.fatal(message.trim().replace('fatal: ', ''));
  process.exit(1);
}

/**
 * Load tuture object from tuture.yml.
 * If there is syntax error, log it and exit with status 1.
 * @returns {Object} The tuture object.
 */
function loadTuture() {
  let tuture = null;
  try {
    tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'), 'utf8');
  } catch (err) {
    errAndExit(`tuture.yml syntax error\n\n${err.message}`);
  }
  return tuture;
}

/**
 * Construct metadata object from user prompt
 * @param {boolean} shouldPrompt Whether `-y` option is provided
 * @returns {object} Metadata object to be dumped into tuture.yml
 */
async function promptMetaData(shouldPrompt) {
  const defaultValues = {
    name: 'My Awesome Tutorial',
    version: '0.0.1',
    language: 'en',
  };
  const questions = [
    {
      type: 'text',
      name: 'name',
      message: 'Tutorial Name',
      initial: defaultValues.name,
    },
    {
      type: 'text',
      name: 'version',
      message: 'Version',
      initial: defaultValues.version,
    },
    {
      type: 'select',
      name: 'language',
      message: 'Tutorial Language',
      choices: [
        { title: 'English', value: 'en' },
        { title: '简体中文', value: 'zh-CN' },
      ],
      initial: 0,
    },
    {
      type: 'list',
      name: 'topics',
      message: 'Topics',
      initial: 'javascript, git, cli',
    },
    {
      type: 'text',
      name: 'email',
      message: 'Maintainer Email',
      initial: 'me@example.com',
    },
  ];

  const onCancel = () => errAndExit('Aborted!');

  return shouldPrompt ? prompts(questions, { onCancel }) : defaultValues;
}

async function makeSteps() {
  let logs = await git.getGitLogs();
  logs = logs
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter(log => !log.slice(8, log.length).startsWith('tuture:'));

  // Store all diff into .tuture/diff.json
  const commits = logs.map(log => log.slice(0, 7));
  await git.storeDiff(commits);

  return logs
    .map(async (log, idx) => {
      const msg = log.slice(8, log.length);
      return {
        name: msg,
        commit: commits[idx],
        diff: await git.getGitDiff(commits[idx]),
      };
    });
}

/**
 * Constructs "steps" section in tuture.yml and store diff files.
 */
async function getSteps() {
  const spinner = ora('Extracting diffs from git log...').start();
  const steps = await makeSteps().then(async (resArr) => {
    const res = await Promise.all(resArr);
    spinner.stop();
    signale.success('Diff files are created!');
    return res;
  });

  return steps;
}

/**
 * Merge previous and current steps. All previous explain will be kept.
 * If any step is rebased out, it will be marked outdated.
 */
function mergeSteps(prevSteps, currentSteps) {
  // Mark steps not included in latest steps as outdated.
  prevSteps.forEach((prevStep) => {
    if (!currentSteps.find(step => step.commit === prevStep.commit)) {
      prevStep.outdated = true; /* eslint no-param-reassign: "off"  */
    }
  });

  let [i, j] = [0, 0];
  const mergedSteps = [];

  while (i < prevSteps.length || j < currentSteps.length) {
    if (i >= prevSteps.length) {
      mergedSteps.push(currentSteps[j]);
      j += 1;
    } else if (j >= currentSteps.length || prevSteps[i].outdated) {
      mergedSteps.push(prevSteps[i]);
      i += 1;
    } else if (prevSteps[i].commit === currentSteps[j].commit) {
      mergedSteps.push(prevSteps[i]);
      i += 1;
      j += 1;
    } else {
      mergedSteps.push(currentSteps[j]);
      j += 1;
    }
  }

  return mergedSteps;
}

/**
 * Append .tuture rule to gitignore.
 * If it's already ignored, do nothing.
 * If .gitignore doesn't exist, create one and add the rule.
 */
function appendGitignore() {
  const ignoreRules = '# Tuture supporting files\n\n.tuture\n';

  if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', ignoreRules);
  } else if (!fs.readFileSync('.gitignore').toString().includes('.tuture')) {
    fs.appendFileSync('.gitignore', `\n${ignoreRules}`);
  }
}

/**
 * Initialize Tuture tutorial.
 * @param {Object} options Command-line options
 */
async function initTuture(options) {
  if (ifTutureYmlExists()) {
    signale.success('Tuture has already been initialized!');
    process.exit(0);
  }

  if (!git.isGitAvailable()) {
    errAndExit('Git is not installed on your machine!');
  }

  if (!fs.existsSync('.git')) {
    const onCancel = () => errAndExit('Aborted!');

    const response = options.yes ? { answer: true } : await prompts({
      type: 'confirm',
      name: 'answer',
      message: 'You are not in a Git repository, do you want to initialize one?',
      initial: false,
    }, { onCancel });

    if (!response.answer) {
      errAndExit('Aborted!');
    } else {
      await git.initGit();
      signale.success('Git repo is initialized!');
    }
  }

  const tuture = await promptMetaData(!options.yes);
  fs.mkdirSync(tutureRoot);

  try {
    tuture.steps = await getSteps();

    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
    signale.success('tuture.yml is created!');

    appendGitignore();
    git.appendGitHook();
  } catch (err) {
    await removeTutureSuite();
    errAndExit(err.message);
  }
}

/**
 * Update Tuture files (diff files and tuture.yml).
 */
async function reloadTuture() {
  if (!ifTutureYmlExists()) {
    errAndExit('Tuture has not been initialized!');
  }

  if (!git.isGitAvailable()) {
    errAndExit('Git is not installed on your machine!');
  }

  if (!fs.existsSync(path.join(tutureRoot, 'diff.json'))) {
    if (!fs.existsSync(tutureRoot)) {
      fs.mkdirSync(tutureRoot);
    }
  }

  const tuture = loadTuture();
  const currentSteps = await getSteps();
  tuture.steps = mergeSteps(tuture.steps, currentSteps);

  fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
  signale.success('Reload complete!');
}

/**
 * Fire tuture server.
 */
async function startTuture() {
  if (!ifTutureYmlExists()) {
    errAndExit('tuture.yml not found!');
  }

  if (!which.sync('tuture-server', { nothrow: true })) {
    errAndExit('Please re-install tuture and retry!');
  }

  // Check for tuture.yml syntax.
  loadTuture();

  await reloadTuture();

  signale.success('Your tutorial is now served on http://localhost:3000.');
  cp.spawnSync('tuture-server');
}

/**
 * Delete all Tuture files.
 * @param {Object} options Command-line options
 */
async function destroyTuture(options) {
  if (!ifTutureYmlExists()) {
    errAndExit('No Tuture tutorial to destroy!');
  }

  const onCancel = () => errAndExit('Aborted!');

  const response = options.force ? { answer: true } : await prompts({
    type: 'confirm',
    name: 'answer',
    message: 'Are you sure?',
    initial: false,
  }, { onCancel });
  if (!response.answer) {
    errAndExit('Aborted!');
  }

  git.removeGitHook();

  const spinner = ora('Deleting Tuture files...').start();
  await removeTutureSuite();
  spinner.stop();
  signale.success('Tuture suite has been destroyed!');
}

exports.initTuture = initTuture;
exports.reloadTuture = reloadTuture;
exports.startTuture = startTuture;
exports.destroyTuture = destroyTuture;

exports.handleUnknownCmd = (cmd) => {
  errAndExit(`Unknown command: ${cmd}`);
};
