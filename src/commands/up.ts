import * as cp from 'child_process';
import * as fs from 'fs-extra';
import * as which from 'which';
import { safeLoad } from 'js-yaml';

import BaseCommand from './base';
import Reload from './reload';

export default class Up extends BaseCommand {
  static description = 'Render and edit tutorial in browser';

  async run() {
    this.parse(Up);

    if (!fs.existsSync('tuture.yml')) {
      this.err('tuture.yml not found!');
      this.exit(1);
    }

    if (!which.sync('tuture-server', { nothrow: true })) {
      this.err('Please re-install tuture and retry!');
      this.exit(1);
    }

    // Check for tuture.yml syntax.
    try {
      safeLoad(fs.readFileSync('tuture.yml').toString());
    } catch (err) {
      this.err(err.message);
      this.exit(1);
    }

    await Reload.run([]);

    this.success('Your tutorial is now served on http://localhost:3000.');
    cp.spawnSync('tuture-server');
  }
}
