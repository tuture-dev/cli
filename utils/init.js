const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');
const promptly = require('promptly');
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
  await git.checkGitEnv();

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

// Constructs "steps" section in tuture.yml and store diff files.
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
  } else if (fs.readFileSync('.gitignore').toString().indexOf('.tuture') === -1) {
    fs.appendFileSync('.gitignore', `\n${ignoreRules}`);
  }
}

module.exports = async (options) => {
  try {
    const tuture = await promptMetaData(!options.yes);
    fs.mkdirpSync(path.join(common.TUTURE_ROOT, 'diff'));
    tuture.steps = await getSteps();
    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
    appendGitignore();
  } catch (e) {
    console.log('\nAborted!');
    const spinner = ora('Cleaning...').start();
    await common.removeTutureSuite();
    spinner.stop();
    process.exit(1);
  }
};
