import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import request from 'request';
import { flags } from '@oclif/command';
import yaml from 'js-yaml';

import BaseCommand from '../base';
import { Tuture } from '../types';
import { apiEndpoint, apiTokenPath } from '../config';

export default class Publish extends BaseCommand {
  static description = 'Publish tutorial to tuture.co';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Publish);

    if (!fs.existsSync(apiTokenPath)) {
      this.error(
        `You have not logged in yet. Please login with ${chalk.bold(
          'tuture login',
        )}.`,
      );
    }

    const token = fs.readFileSync(apiTokenPath).toString();
    const tuture: Tuture = yaml.safeLoad(
      fs.readFileSync('tuture.yml').toString(),
    );

    const formData: any = {
      name: tuture.name,
      tutureYml: fs.createReadStream('tuture.yml'),
      diffJson: fs.createReadStream(path.join('.tuture', 'diff.json')),
    };

    if (tuture.topics) {
      formData.topics = tuture.topics.join(',');
    }

    if (tuture.description) {
      formData.description = tuture.description;
    }

    request.post(
      `${apiEndpoint}/publish`,
      { formData, headers: { Authorization: `JWT ${token}` } },
      (err, res, body) => {
        if (err) {
          this.error(
            `Verification failed. Please relogin with ${chalk.bold(
              'tuture login',
            )}.`,
          );
          this.exit(1);
        }

        if (res.statusCode === 201) {
          this.success('Your tutorial has been successfully published!');
        } else {
          this.error('Publish failed. Please retry.');
          this.exit(1);
        }
      },
    );
  }
}
