const ora = require('ora');
const prompts = require('prompts');
const signale = require('signale');

const common = require('./common');

module.exports = async (options) => {
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
  const spinner = ora('Deleting Tuture files...').start();
  await common.removeTutureSuite();
  spinner.stop();
  signale.success('Tuture suite has been destroyed!');
};
