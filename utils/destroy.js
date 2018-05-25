const ora = require('ora');
const promptly = require('promptly');
const signale = require('signale');

const common = require('./common');

module.exports = async (options) => {
  if (!common.ifTutureSuiteExists()) {
    signale.error('No Tuture tutorial to destroy!');
    process.exit(1);
  }
  try {
    const answer = options.force ? true : await promptly.confirm(
      'Are you sure? [y/N] ',
      { default: 'n' },
    );
    if (!answer) {
      console.log('Aborted!');
      process.exit(1);
    }
    const spinner = ora('Deleting Tuture files...').start();
    await common.removeTutureSuite();
    spinner.stop();
    signale.success('Tuture suite has been destroyed!');
  } catch (e) {
    console.log('\nAborted!');
    process.exit(1);
  }
};
