/**
 * Utilities for implementing Tuture CLI.
 */

const fs = require('fs');
const git = require('simple-git/promise')('.');
const path = require('path');

const EXPLAIN_PLACEHOLDER = '<YOUR EXPLANATION HERE>';
const TUTURE_ROOT = '.tuture'

async function getGitLogs() {
  let result = null;
  try {
    result = await git.raw(['log', '--oneline', '--no-merges']);
  }
  catch (e) {
    console.log("No git executable detected!");
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
  }
  catch (e) {
    console.log("No git executable detected!");
    process.exit(1);
  }
  let changedFiles = result.split('\n\n').slice(-1)[0].split('\n');
  changedFiles = changedFiles.slice(0, changedFiles.length - 1);
  return changedFiles.map(file => {
    return {
      file: file,
      explain: EXPLAIN_PLACEHOLDER
    };
  });
}

async function storeDiff(commit) {
  let result = null;
  try {
    result = await git.raw(['show', commit]);
  }
  catch (e) {
    console.log("No git executable detected!");
    process.exit(1);
  }
  git.raw(['show', commit]);

  const diff = result.split('\n\n').slice(-1)[0];
  const diffPath = path.join(TUTURE_ROOT, 'diff', commit + '.diff');
  fs.writeFileSync(diffPath, diff);
}

async function makeSteps() {
  const logs = await getGitLogs();
  return logs.reverse().map(async (log) => {
    const commit = log.slice(0, 7);
    const msg = log.slice(8, log.length);
    await storeDiff(commit);
    return {
      name: msg,
      commit: commit,
      explain: EXPLAIN_PLACEHOLDER,
      diff: await getGitDiff(commit)
    };
  });
}

// Make .tuture directoy and its subdirectories
// This operation is IDEMPOTENT.
exports.makeTutureDirs = () => {
  if (!fs.existsSync(TUTURE_ROOT)) {
    fs.mkdirSync(TUTURE_ROOT);
  }

  const diffDirPath = path.join(TUTURE_ROOT, 'diff');
  if (!fs.existsSync(diffDirPath)) {
    fs.mkdirSync(diffDirPath);
  }
}

// Constructs "steps" section in tuture.yml and store diff files.
exports.getSteps = async () =>{
  const steps = await makeSteps().then(async resArr => {
    const res = await Promise.all(resArr);
    return res;
  });

  return steps;
}
