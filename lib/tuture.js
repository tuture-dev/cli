const program = require('commander');

const utils = require('./utils');

const { version } = require('../package.json');

program
  .version(version)
  .description('Tuture magically turns your repositories into juicy tutorials.');

/**
 * tuture init
 */
program
  .command('init')
  .description('initialize a Tuture tutorial')
  .option('-y, --yes', 'do not ask for prompts and fill in default values')
  .action(async (options) => {
    utils.initTuture(options);
  });

/**
 * tuture reload
 */
program
  .command('reload')
  .description('update Tuture files to the latest repo')
  .action(async () => {
    utils.reloadTuture();
  });

/**
 * tuture up
 */
program
  .command('up')
  .description('render your tutorial in the browser')
  .action(() => {
    utils.startTuture();
  });

/**
 * tuture destroy
 */
program
  .command('destroy')
  .description('delete all Tuture files')
  .option('-f, --force', 'destroy without confirmation')
  .action((options) => {
    utils.destroyTuture(options);
  });

program
  .action((cmd) => {
    utils.handleUnknownCmd(cmd);
  });

// If no arguments or options provided, just print help page
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
