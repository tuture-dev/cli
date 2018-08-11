import * as fs from 'fs-extra';
import * as path from 'path';

import { TutureConfig } from './types';

// Directory which houses tuture internal files.
export const tutureRoot = '.tuture';

// Path to runtime config file.
export const configPath = path.join(tutureRoot, 'config.json');

export function loadConfig(): TutureConfig {
  return JSON.parse(fs.readFileSync(configPath).toString());
}

// Default config of Tuture.
export default {
  // Files that should be commited but won't be tracked by Tuture.
  ignoredFiles: [
    // Git-related files
    '.gitignore',
    '.gitattributes',

    // Node.js
    'package-lock.json',
    'yarn.lock',

    // Tuture-related files
    'tuture.yml',
  ],

  // Port to use for tuture-server.
  port: 3000,
};
