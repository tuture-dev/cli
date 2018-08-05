import { Command } from '@oclif/command';
import chalk from 'chalk';
import * as figures from 'figures';

export default abstract class extends Command {

  info(msg: string) {
    console.log(chalk.blueBright(figures.info + ' info ') + msg);
  }

  success(msg: string) {
    console.log(chalk.green(figures.tick + ' success ') + msg);
  }

  err(msg: string) {
    console.log(chalk.redBright(figures.cross + ' error ') + msg);
  }

  warning(msg: string) {
    console.log(chalk.redBright(figures.warning + ' warning ') + msg);
  }
}
