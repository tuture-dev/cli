#!/usr/bin/env node

const program = require('commander');

const utils = require('./utils');

program
  .version('0.0.1')
  .description('Tuture makes writing interactive, step-by-step tutorials enjoyable.');

/**
 * tuture init
 */
program
  .command('init')
  .description('initialize a Tuture tutorial')
  .option('-y, --yes', 'do not ask for prompts and fill in default values')
  .action(async (options) => {
    utils.makeTutureDirs();

    const tuture = await utils.promptMetaData(!options.yes);
    tuture.steps = await utils.getSteps();
    utils.writeTutureYML(tuture);

    // Append gitignore rules about tuture.
    utils.appendGitignore();

    utils.createRenderer();
  });

/**
 * tuture up
 */
program
  .command('up')
  .description('fire up your tutorial in the browser')
  .action(() => {
    utils.startRenderer();
  });

/**
 * tuture destroy
 */
program
  .command('destroy')
  .description('delete all Tuture files')
  .option('-f, --force', 'destroy without confirmation')
  .action((options) => {
    utils.removeTutureFiles(options.force);
  });

// If no arguments or options provided, just print help page
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
