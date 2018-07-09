/**
 * Default config of Tuture.
 */

module.exports = {
  // Directory which houses Tuture internal files.
  tutureRoot: '.tuture',

  // Files that should be commited but won't be tracked by Tuture.
  ignoreFiles: [
    // Git-related files
    '.gitignore',
    '.gitattributes',

    // Node.js
    'package-lock.json',
    'yarn.lock',

    // Tuture-related files
    'tuture.yml',
  ],
};
