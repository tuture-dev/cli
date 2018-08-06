import Command from '@oclif/command';
import chalk from 'chalk';

export default abstract class BaseCommand extends Command {
  success(msg: string) {
    this.log(` ${chalk.green('›') }   Success: ${msg}`);
  }
}
