import { Command } from '@oclif/command';
import chalk from 'chalk';
import * as fs from 'fs-extra';

import defaultConfig, { tutureRoot, configPath } from './config';

export default abstract class BaseCommand extends Command {
  readonly tutureRoot = tutureRoot;

  userConfig = defaultConfig;

  success(msg: string) {
    this.log(` ${chalk.green('›') }   Success: ${msg}`);
  }

  async init() {
    if (!fs.existsSync(configPath)) {
      if (!fs.existsSync(tutureRoot)) {
        fs.mkdirSync(tutureRoot);
      }
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig));
      this.userConfig = defaultConfig;
    } else {
      this.userConfig = JSON.parse(fs.readFileSync(configPath).toString());
    }
  }

  async finally() {
    fs.removeSync(configPath);
  }
}
