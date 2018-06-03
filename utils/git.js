const fs = require('fs-extra');
const git = require('simple-git/promise')('.').silent(true);
const minimatch = require('minimatch');
const path = require('path');
const signale = require('signale');

const common = require('./common');

async function checkGitEnv() {
  try {
    await git.raw(['status']);
  } catch (e) {
    if (fs.existsSync('.git')) {
      signale.error('Git is not working on your machine!');
    } else {
      signale.error('You are not working on a git repo!');
    }
    process.exit(1);
  }
}

async function getGitLogs() {
  let result = null;
  try {
    result = await git.raw(['log', '--oneline', '--no-merges']);
  } catch (e) {
    console.log('No git executable detected!');
    process.exit(1);
  }
  let logs = result.split('\n');
  logs = logs.slice(0, logs.length - 1);
  return logs;
}

async function getGitDiff(commit) {
  let result = null;
  try {
    result = await git.raw(['show', commit, '--name-only']);
  } catch (e) {
    console.log('No git executable detected!');
    process.exit(1);
  }
  let changedFiles = result.split('\n\n').slice(-1)[0].split('\n');
  changedFiles = changedFiles.slice(0, changedFiles.length - 1);
  return changedFiles
    // don't track changes of tuture.yml
    .filter(file => file !== 'tuture.yml')
    .map((file) => {
      const diffFile = { file, explain: common.EXPLAIN_PLACEHOLDER };
      if (common.collapsedFiles.some(pattern => minimatch(path.basename(file), pattern))) {
        diffFile.collapse = true;
      }
      return diffFile;
    });
}

async function storeDiff(commit) {
  let result = null;
  try {
    result = await git.raw(['show', commit]);
  } catch (e) {
    console.log('No git executable detected!');
    process.exit(1);
  }
  git.raw(['show', commit]);

  const diff = result.split('\n\n').slice(-1)[0];
  const diffPath = path.join(common.TUTURE_ROOT, 'diff', `${commit}.diff`);
  fs.writeFileSync(diffPath, diff);
}

exports.checkGitEnv = checkGitEnv;
exports.getGitLogs = getGitLogs;
exports.getGitDiff = getGitDiff;
exports.storeDiff = storeDiff;
