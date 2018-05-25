const fs = require('fs-extra');

exports.EXPLAIN_PLACEHOLDER = '<YOUR EXPLANATION HERE>';
exports.TUTURE_ROOT = '.tuture';

// Filename patterns that shoule be collapsed in renderer.
exports.collapsedFiles = [
  '.gitignore',
  'package-lock.json',
  'yarn.lock',
];

/**
 * Check if .tuture directory and tuture.yml both exists.
 */
exports.ifTutureSuiteExists =
  () => fs.existsSync(this.TUTURE_ROOT) && fs.existsSync('tuture.yml');

/**
 * Remove all Tuture-related files.
 */
exports.removeTutureSuite = async () => {
  await fs.remove('tuture.yml');
  await fs.remove(this.TUTURE_ROOT);
};
