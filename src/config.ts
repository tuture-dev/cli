/**
 * Default config of Tuture.
 */

// Directory which houses Tuture internal files.
export const tutureRoot = '.tuture';

// Files that should be commited but won't be tracked by Tuture.
export const ignoreFiles: string[] = [
  // Git-related files
  '.gitignore',
  '.gitattributes',

  // Node.js
  'package-lock.json',
  'yarn.lock',

  // Tuture-related files
  'tuture.yml',
];
