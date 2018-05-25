const cp = require('child_process');
const signale = require('signale');

const common = require('./common');

module.exports = () => {
  if (!common.ifTutureSuiteExists()) {
    signale.error('Tuture has not been initialized!');
    process.exit(1);
  }
  process.chdir(`${common.TUTURE_ROOT}/renderer`);
  cp.exec('npm start');
  signale.success('Tuture renderer is served on http://localhost:3000.');
};
