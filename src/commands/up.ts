import * as fs from 'fs-extra';
import * as which from 'which';
import * as spawn from 'cross-spawn';
import { safeLoad } from 'js-yaml';
import { prompt } from 'inquirer';

import BaseCommand from '../base';
import reload from './reload';

type ConfirmResponse = {
  answer: boolean;
};

export default class Up extends BaseCommand {
  static description = 'Render and edit tutorial in browser';

  spawnServerProcess(port: number) {
    return spawn.sync(
      'tuture-server',
      ['--port', port.toString()],
      // Inherit stdout only.
      { stdio: ['pipe', process.stdout, 'pipe'] },
    );
  }

  async fireTutureServer() {
    let port = 3000;
    let serverProc = this.spawnServerProcess(port);

    // Port 3000 is occupied.
    if (serverProc.status !== 0) {
      const response = await prompt([{
        type: 'confirm',
        name: 'answer',
        message: `Port ${port} has been used. Do you want to use a new port?`,
        default: true,
      }]);

      if (!(response as ConfirmResponse).answer) {
        this.exit(0);
      }
    }

    // Incrementing port number until it's available.
    while (serverProc.status !== 0) {
      port += 1;
      serverProc = this.spawnServerProcess(port);
    }
  }

  async run() {
    this.parse(Up);

    if (!fs.existsSync('tuture.yml')) {
      this.error('tuture.yml not found!');
      this.exit(1);
    }

    if (!which.sync('tuture-server', { nothrow: true })) {
      this.error('Please re-install tuture and retry!');
      this.exit(1);
    }

    // Check for tuture.yml syntax.
    try {
      safeLoad(fs.readFileSync('tuture.yml').toString());
    } catch (err) {
      this.error(err.message);
      this.exit(1);
    }

    await reload.run([]);

    this.fireTutureServer();
  }
}
