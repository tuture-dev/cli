#!/usr/bin/env node

const cp = require('child_process');
const fs = require('fs');
const program = require('commander');
const promptly = require('promptly');
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
      { default: 'My Awesome Tutorial'}
    );
    const languange = await promptly.prompt(
      'Languange Code: ',
      { default: 'zh-hans' }
    );
    const topics = await promptly.prompt('Topics: ');
    const email = await promptly.prompt('Maintainer Email: ');

    let tuture = {
      name: name,
      language: languange,
      topics: topics ? topics.split(/[ ,]+/) : '<YOUR TOPICS>',
      maintainer: email ? email : '<YOUR EMAIL>',
      steps: await utils.getSteps()
    }

    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));

    console.log('Successfully initialized a tuture project!');
  });

/**
 * tuture up
 */
program
  .command('up')
  .description('Fire up your tutorial in the browser')
  .action(() => {
    console.log('Building your tutorial...');
    cp.exec(
      'cd renderer && npm install && npm start',
      (err, stdout, stderr) => {
        if (err) {
          console.log('Something went wrong with npm!');
          process.abort(1);
        }
        console.log('Your tutorial is now served on http://localhost:3000');
    });
  })

program.parse(process.argv);
