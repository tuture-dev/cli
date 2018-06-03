const cp = require('child_process');

const fs = require('fs-extra');
const minimatch = require('minimatch');
const path = require('path');
const signale = require('signale');

const common = require('./common');

/**
 * Run arbitrary Git commands.
 * If exit status is not 0, log out stderr message and exit.
 * @param {Array} args arguments of command
 * @returns {String} stdout of running this git command
 */
function runGitCommand(args) {
  const subprocess = cp.spawnSync('git', args);
  if (subprocess.status !== 0) {
    signale.error(subprocess.stderr.toString());
    process.exit(1);
  }
  return subprocess.stdout.toString();
}

/**
 * Get an array of Git commit messages.
 * @returns {Array} Git commit messages
 */
function getGitLogs() {
  return runGitCommand(['log', '--oneline', '--no-merges']).trim().split('\n');
}

/**
 * Get diff of a given commit.
 * @param {String} commit Commit ID
 * @returns {Array} Diff objects with attrs `file`, `explain`, and optional `collapse`
 */
function getGitDiff(commit) {
  const output = runGitCommand(['show', commit, '--name-only']);
  let changedFiles = output.split('\n\n').slice(-1)[0].split('\n');
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

/**
 * Store diff of a given commit to a file.
 * @param {String} commit Commit ID
 */
function storeDiff(commit) {
  const output = runGitCommand(['show', commit]);
  const diff = output.split('\n\n').slice(-1)[0];
  const diffPath = path.join(common.TUTURE_ROOT, 'diff', `${commit}.diff`);
  fs.writeFileSync(diffPath, diff);
}

exports.getGitLogs = getGitLogs;
exports.getGitDiff = getGitDiff;
exports.storeDiff = storeDiff;
