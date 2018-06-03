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

/**
 * Construct tuture steps.
 * @returns {Array} steps of a tutorial.
 */
function makeSteps() {
  const logs = git.getGitLogs();
  return logs
    .reverse()
    // filter out commits whose commit message starts with 'tuture:'
    .filter(log => !log.startsWith('tuture:'))
    .map((log) => {
      const commit = log.slice(0, 7);
      const msg = log.slice(8, log.length);
      git.storeDiff(commit);
      return {
        name: msg,
        commit,
        explain: common.EXPLAIN_PLACEHOLDER,
        diff: git.getGitDiff(commit),
      };
    });
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
    signale.success('.gitignore is created!');
  } else if (!fs.readFileSync('.gitignore').toString().includes('.tuture')) {
    fs.appendFileSync('.gitignore', `\n${ignoreRules}`);
    signale.success('.gitignore rule is appended!');
  }
}

module.exports = async (options) => {
  try {
    const tuture = await promptMetaData(!options.yes);
    fs.mkdirpSync(path.join(common.TUTURE_ROOT, 'diff'));

    const spinner = ora('Extracting diff from git logs...').start();
    tuture.steps = makeSteps();
    spinner.stop();
    signale.success('Diff files are extracted!');

    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));
    signale.success('tuture.yml is created!');

    appendGitignore();
  } catch (e) {
    console.log(e);
    const spinner = ora('Cleaning...').start();
    await common.removeTutureSuite();
    spinner.stop();
    process.exit(1);
  }
};
