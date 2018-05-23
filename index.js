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
  .description('Initialize a Tuture tutorial')
  .action(async () => {
    // Ask for name, language, topics and email from user prompt
    const name = await promptly.prompt(
      'Tutorial Name: ',
      { default: 'My Awesome Tutorial' },
    );
    const languange = await promptly.prompt(
      'Languange Code: ',
      { default: 'zh-hans' },
    );
    const topics = await promptly.prompt('Topics: ');
    const email = await promptly.prompt('Maintainer Email: ');

    utils.makeTutureDirs();

    const spinner1 = ora('Extracting diffs from git log...').start();
    const tuture = {
      name,
      language: languange,
      topics: topics ? topics.split(/[ ,]+/) : '<YOUR TOPICS>',
      maintainer: email || '<YOUR EMAIL>',
      steps: await utils.getSteps(),
    };

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
  .description('Fire up your tutorial in the browser')
  .action(() => {
    utils.startRenderer();
  });

// If no arguments or options provided, just print help page
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
