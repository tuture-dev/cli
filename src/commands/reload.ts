import * as fs from 'fs-extra';
import * as path from 'path';
import { safeDump, safeLoad } from 'js-yaml';

import BaseCommand from './base';
import { Step, Tuture } from '../types';
import { makeSteps, mergeSteps } from '../utils';
import { isGitAvailable } from '../utils/git';
import { tutureRoot } from '../config';

export default class Reload extends BaseCommand {
  static description = 'Sync tuture files with current repo';

  async run() {
    this.parse(Reload);

    if (!fs.existsSync('tuture.yml')) {
      this.err('Tuture has not been initialized!');
      this.exit(1);
    }

    if (!isGitAvailable()) {
      this.err('Git is not installed on your machine!');
      this.exit(1);
    }

    if (!fs.existsSync(path.join(tutureRoot, 'diff.json'))) {
      if (!fs.existsSync(tutureRoot)) {
        fs.mkdirSync(tutureRoot);
      }
    }

    const tuture: Tuture = safeLoad(fs.readFileSync('tuture.yml').toString());
    const currentSteps: Step[] = await makeSteps();
    tuture.steps = mergeSteps(tuture.steps, currentSteps);

    fs.writeFileSync('tuture.yml', safeDump(tuture));
    this.success('reload complete!');
  }
}
