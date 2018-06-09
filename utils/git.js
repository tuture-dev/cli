const fs = require('fs-extra');
const git = require('simple-git/promise')('.');
const path = require('path');
const signale = require('signale');

const common = require('./common');

/**
 * Check cwd is a valid Git repo with at least one commit.
 */
async function checkGitEnv() {
  try {
    await git.log();
  } catch (e) {
    signale.error(e);
    process.exit(1);
  }
}

/**
 * Run arbitrary Git commands.
 * If exit status is not 0, log out stderr message and exit.
 * @param {Array} args arguments of command
 * @returns {String} stdout of running this git command
 */
async function runGitCommand(args) {
  let res = null;
  try {
    res = await git.raw(args);
  } catch (e) {
    signale.error(e);
    process.exit(1);
  }
  return res;
}

/**
 * Get an array of Git commit messages.
 * @returns {Array} Git commit messages
 */
async function getGitLogs() {
  const output = await runGitCommand(['log', '--oneline', '--no-merges']);
  return output.trim().split('\n');
}

/**
 * Get diff of a given commit.
 * @param {String} commit Commit ID
 * @returns {Array} Diff objects with attrs `file`, `explain`, and optional `collapse`
 */
async function getGitDiff(commit) {
  const output = await runGitCommand(['show', commit, '--name-only']);
  let changedFiles = output.split('\n\n').slice(-1)[0].split('\n');
  changedFiles = changedFiles.slice(0, changedFiles.length - 1);
  return changedFiles
    // don't track changes of tuture.yml
    .filter(file => file !== 'tuture.yml')
    .map((file) => {
      const diffFile = { file, explain: common.EXPLAIN_PLACEHOLDER };
      if (common.shouldBeCollapsed(file)) {
        diffFile.collapse = true;
      }
      return diffFile;
    });
}

/**
 * Store diff of a given commit to a file.
 * @param {String} commit Commit ID
 */
async function storeDiff(commit) {
  const output = await runGitCommand(['show', commit]);
  const diff = output.split('\n\n').slice(-1)[0];
  const diffPath = path.join(common.TUTURE_ROOT, 'diff', `${commit}.diff`);
  fs.writeFileSync(diffPath, diff);
}

exports.checkGitEnv = checkGitEnv;
exports.getGitLogs = getGitLogs;
exports.getGitDiff = getGitDiff;
exports.storeDiff = storeDiff;
