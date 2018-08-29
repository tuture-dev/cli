import fs from 'fs-extra';
import which from 'which';
import yaml from 'js-yaml';
import spawn from 'cross-spawn';
import { prompt } from 'inquirer';
import { flags } from '@oclif/command';

import BaseCommand from '../base';
import reload from './reload';

type ConfirmResponse = {
  answer: boolean;
};

export default class Up extends BaseCommand {
  static description = 'Render and edit tutorial in browser';

  static flags = {
    help: flags.help({ char: 'h' }),
    port: flags.integer({
      char: 'p',
      description: 'which port to use for tutorial server',
    }),
  };

  spawnServerProcess(port: number) {
    return spawn.sync(
      'tuture-server',
      ['--port', port.toString()],
      // Inherit stdout only.
      { stdio: ['pipe', process.stdout, 'pipe'] },
    );
  }

  async fireTutureServer(port?: number) {
    let portToUse = port || 3000;
    let serverProc = this.spawnServerProcess(portToUse);

    // Port 3000 is occupied.
    if (serverProc.status !== 0) {
      const response = await prompt([
        {
          type: 'confirm',
          name: 'answer',
          message: `Port ${portToUse} has been used. Do you want to use a new port?`,
          default: true,
        },
      ]);

      if (!(response as ConfirmResponse).answer) {
        this.exit(0);
      }
    }

    // Incrementing port number until it's available.
    while (serverProc.status !== 0) {
      portToUse += 1;
      serverProc = this.spawnServerProcess(portToUse);
    }
  }

  async run() {
    const { flags } = this.parse(Up);

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
      yaml.safeLoad(fs.readFileSync('tuture.yml').toString());
    } catch (err) {
      this.error(err.message);
      this.exit(1);
    }

    await reload.run([]);

    this.fireTutureServer(flags.port);
  }
}
