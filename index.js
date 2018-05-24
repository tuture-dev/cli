#!/usr/bin/env node

const fs = require('fs-extra');
const ora = require('ora');
const program = require('commander');
const promptly = require('promptly');
const signale = require('signale');
const utils = require('./utils');
const yaml = require('js-yaml');

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
    const tuture = Object();

    if (options.yes) {
      tuture.name = 'My Awesome Tutorial';
      tuture.language = 'English';
    } else {
      // Ask for required fields.
      tuture.name = await promptly.prompt(
        'Tutorial Name: (My Awesome Tutorial) ',
        { default: 'My Awesome Tutorial' },
      );
      tuture.language = await promptly.prompt(
        'Tutorial Languange: (English) ',
        { default: 'English' },
      );

      // Ask for optional fields.
      const topics = await promptly.prompt('Topics: ', { default: '' });
      const email = await promptly.prompt('Maintainer Email: ', { default: '' });
      if (topics) tuture.topics = topics.split(/[ ,]+/);
      if (email) tuture.email = email;
    }

    utils.makeTutureDirs();

    // Append gitignore rules about tuture.
    utils.appendGitignore();

    const spinner1 = ora('Extracting diffs from git log...').start();
    tuture.steps = await utils.getSteps();

    fs.writeFile('tuture.yml', yaml.safeDump(tuture)).then(() => {
      spinner1.stop();
      signale.success('Diff files and tuture.yml is created!');
    });

    const spinner2 = ora('Creating tuture renderer...').start();
    utils.copyRenderer().then(() => {
      spinner2.stop();
      signale.success('Tuture renderer is created!');
      utils.installRendererDeps();
    });
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

// If no arguments or options provided, just print help page
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
