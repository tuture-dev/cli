const cp = require('child_process');

const signale = require('signale');

const common = require('./common');

module.exports = () => {
  if (!common.ifTutureSuiteExists()) {
    signale.error('Tuture has not been initialized!');
    process.exit(1);
  }
  try {
    signale.success('Tuture renderer is served on http://localhost:3000.');
    cp.execSync('tuture-renderer');
  } catch (e) {
    signale.error('tuture-renderer is not available!');
  }
};
