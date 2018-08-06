import * as fs from 'fs-extra';
import * as http from 'http';
import * as path from 'path';
import { safeDump, safeLoad } from 'js-yaml';

import BaseCommand from './base';
import { Step, Tuture } from '../types';
import { makeSteps, mergeSteps } from '../utils';
import { isGitAvailable } from '../utils/git';
import { tutureRoot, serverURL } from '../config';

export default class Reload extends BaseCommand {
  static description = 'Sync tuture files with current repo';

  // Notify server to reload.
  async notifyServer() {
    return new Promise((resolve, reject) => {
      http
        .get(serverURL + '/reload', (res) => {
          const { statusCode, statusMessage } = res;
          if (statusCode !== 200) {
            this.warn(`tuture-server ${statusCode}: ${statusMessage}`);
          } else {
            this.success('server is ready to reload.');
          }
          resolve();
        })
        .on('error', (err) => {
          this.warn(`tuture-server error (${err.message})`);
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

    if (!fs.existsSync(path.join(tutureRoot, 'diff.json'))) {
      if (!fs.existsSync(tutureRoot)) {
        fs.mkdirSync(tutureRoot);
      }
    }

    const tuture: Tuture = safeLoad(fs.readFileSync('tuture.yml').toString());
    const currentSteps: Step[] = await makeSteps();
    tuture.steps = mergeSteps(tuture.steps, currentSteps);

    fs.writeFileSync('tuture.yml', safeDump(tuture));
    await this.notifyServer();

    this.success('reload complete!');
  }
}
