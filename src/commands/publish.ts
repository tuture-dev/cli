import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import request from 'request';
import { Readable } from 'stream';
import { flags } from '@oclif/command';
import yaml from 'js-yaml';

import BaseCommand from '../base';
import { Tuture } from '../types';
import { apiEndpoint, apiTokenPath, staticServer } from '../config';

export default class Publish extends BaseCommand {
  static description = 'Publish tutorial to tuture.co';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  collectTutureAssets(tutureYml: string): [string, string[]] {
    const assets: string[] = [];

    // Replace all paths to local assets with ones on tuture static server.
    // For instance, "./tuture-assets/foo.png" => "http://static.tuture.co/foo.png".
    const updatedTuture = tutureYml.replace(
      /!\[.*\]\((.*)\)/g,
      (match, imagePath) => {
        assets.push(imagePath);
        return match.replace(imagePath, staticServer + imagePath);
      },
    );

    return [updatedTuture, assets];
  }

  saveTutureToTmp(tuture: string) {
    const tmpDir = tmp.dirSync();
    const tmpPath = path.join(tmpDir.name, 'tuture.yml');
    fs.writeFileSync(tmpPath, tuture);
    return tmpPath;
  }

  async run() {
    this.parse(Publish);

    if (!fs.existsSync(apiTokenPath)) {
      this.error(
        `You have not logged in yet. Please login with ${chalk.bold(
          'tuture login',
        )}.`,
      );
    }

    const tutureYml = fs.readFileSync('tuture.yml').toString();
    const [updatedTutureYml, assets] = this.collectTutureAssets(tutureYml);

    // This streaming method comes from here:
    // https://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js
    const tutureYmlStream = new Readable();
    tutureYmlStream._read = () => {};
    tutureYmlStream.push(updatedTutureYml);
    tutureYmlStream.push(null);

    const tuture: Tuture = yaml.safeLoad(updatedTutureYml);

    const formData: any = {
      name: tuture.name,
      tutureYml: fs.createReadStream(this.saveTutureToTmp(updatedTutureYml)),
      diffJson: fs.createReadStream(path.join('.tuture', 'diff.json')),
      assets: assets.map((asset) => fs.createReadStream(asset)),
    };

    if (tuture.topics) {
      formData.topics = tuture.topics.join(',');
    }

    if (tuture.description) {
      formData.description = tuture.description;
    }

    const token = fs.readFileSync(apiTokenPath).toString();

    request.post(
      `${apiEndpoint}/publish`,
      { formData, headers: { Authorization: `JWT ${token}` } },
      (err, res, body) => {
        if (err) {
          console.log(err);
          this.log(
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
