/**
 * Utilities for implementing Tuture CLI.
 */

const cp = require('child_process');
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');
const prompts = require('prompts');
const signale = require('signale');
const yaml = require('js-yaml');

const common = require('./common');
const git = require('./git');

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

  const onCancel = () => {
    signale.fatal('Aborted!');
    process.exit(1);
  };

  return shouldPrompt ? prompts(questions, { onCancel }) : defaultValues;
}

async function makeSteps() {
  const logs = await git.getGitLogs();
  return logs
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter(log => !log.startsWith('tuture:'))
    .map(async (log) => {
      const commit = log.slice(0, 7);
      const msg = log.slice(8, log.length);
      await git.storeDiff(commit);
      return {
        name: msg,
        commit,
        explain: common.EXPLAIN_PLACEHOLDER,
        diff: await git.getGitDiff(commit),
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
  await git.checkGitEnv();

  const tuture = await promptMetaData(!options.yes);
  fs.mkdirpSync(path.join(common.TUTURE_ROOT, 'diff'));

  try {
    tuture.steps = await getSteps();

    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
    signale.success('tuture.yml is created!');

    appendGitignore();
    git.appendGitHook();
  } catch (e) {
    signale.error(e.message);
    const spinner = ora('Cleaning...').start();
    await common.removeTutureSuite();
    spinner.stop();
    process.exit(1);
  }
}

/**
 * Update Tuture files (diff files and tuture.yml).
 */
async function reloadTuture() {
  if (!common.ifTutureSuiteExists()) {
    signale.error('Tuture has not been initialized!');
    process.exit(1);
  }

  let tuture = null;
  try {
    tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'), 'utf8');
  } catch (e) {
    signale.error(e);
    process.exit(1);
  }

  const currentSteps = await getSteps();
  currentSteps.forEach((currentStep, index) => {
    tuture.steps.forEach((step) => {
      if (currentStep.commit === step.commit) {
        currentSteps[index] = step;
      }
    });
  });

  tuture.steps = currentSteps;
  fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
  signale.success('tuture.yml is reloaded!');
}

/**
 * Start up tuture-renderer.
 */
function startRenderer() {
  if (!common.ifTutureSuiteExists()) {
    signale.error('Tuture has not been initialized!');
    process.exit(1);
  }
  try {
    signale.success('Tuture renderer is served on http://localhost:3000.');
    cp.execSync('tuture-renderer');
  } catch (e) {
    signale.error('tuture-renderer is not available!');
    process.exit(1);
  }
}

/**
 * Delete all Tuture files.
 * @param {Object} options Command-line options
 */
async function destroyTuture(options) {
  if (!common.ifTutureSuiteExists()) {
    signale.error('No Tuture tutorial to destroy!');
    process.exit(1);
  }

  const onCancel = () => {
    signale.fatal('Aborted!');
    process.exit(1);
  };

  const answer = options.force ? true : await prompts({
    type: 'confirm',
    name: 'answer',
    message: 'Are you sure?',
    initial: false,
  }, { onCancel });
  if (!answer) {
    console.log('Aborted!');
    process.exit(1);
  }

  git.removeGitHook();

  const spinner = ora('Deleting Tuture files...').start();
  await common.removeTutureSuite();
  spinner.stop();
  signale.success('Tuture suite has been destroyed!');
}

exports.initTuture = initTuture;
exports.reloadTuture = reloadTuture;
exports.startRenderer = startRenderer;
exports.destroyTuture = destroyTuture;

exports.handleUnknownCmd = (cmd) => {
  console.log(`Unknown command: ${cmd}`);
  process.exit(1);
};