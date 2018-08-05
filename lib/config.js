"use strict";
/**
 * Default config of Tuture.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Directory which houses Tuture internal files.
exports.tutureRoot = '.tuture';
// Files that should be commited but won't be tracked by Tuture.
exports.ignoreFiles = [
    // Git-related files
    '.gitignore',
    '.gitattributes',
    // Node.js
    'package-lock.json',
    'yarn.lock',
    // Tuture-related files
    'tuture.yml',
];
