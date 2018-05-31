const cp = require('child_process');
const signale = require('signale');

const common = require('./common');

module.exports = () => {
  if (!common.ifTutureSuiteExists()) {
    signale.error('Tuture has not been initialized!');
    process.exit(1);
  }
  try {
    cp.execSync('tuture-renderer');
    signale.success('Tuture renderer is served on http://localhost:3000.');
  } catch (e) {
    signale.error('tuture-renderer is not available!');
  }
};
