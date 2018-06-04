const ora = require('ora');
const prompts = require('prompts');

const common = require('./common');

module.exports = async (options) => {
  if (!common.ifTutureSuiteExists()) {
    console.log('No Tuture tutorial to destroy!');
    process.exit(1);
  }

  const onCancel = () => {
    console.log('Aborted!');
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
  spinner.succeed('Tuture suite has been destroyed!');
};
