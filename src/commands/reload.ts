import * as fs from 'fs-extra';
import * as http from 'http';
import * as path from 'path';
import { safeDump, safeLoad } from 'js-yaml';

import BaseCommand from '../base';
import { Step, Tuture } from '../types';
import { makeSteps, mergeSteps } from '../utils';
import { isGitAvailable } from '../utils/git';

export default class Reload extends BaseCommand {
  static description = 'Sync tuture files with current repo';

  // Notify server to reload.
  async notifyServer() {
    const url = `http://localhost:${this.userConfig.port}/reload`;
    return new Promise((resolve, reject) => {
      http
        .get(url, (res) => {
          const { statusCode } = res;
          if (statusCode === 200) {
            this.success('server is ready to reload.');
          }
          resolve();
        })
        .on('error', () => {
          resolve();
        });
    });
  }

  async run() {
    this.parse(Reload);

    if (!fs.existsSync('tuture.yml')) {
      this.error('tuture has not been initialized!');
      this.exit(1);
    }

    if (!isGitAvailable()) {
      this.error('git is not installed on your machine!');
      this.exit(1);
    }

    const tuture: Tuture = safeLoad(fs.readFileSync('tuture.yml').toString());
    const currentSteps: Step[] = await makeSteps();
    tuture.steps = mergeSteps(tuture.steps, currentSteps);

    fs.writeFileSync('tuture.yml', safeDump(tuture));
    await this.notifyServer();

    this.success('reload complete!');
  }
}
