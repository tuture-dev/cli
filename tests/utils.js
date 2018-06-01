const fs = require('fs-extra');
const cp = require('child_process');
const path = require('path');
const tmp = require('tmp');

/**
 * Run any tuture command.
 * @param {Array} args array of arguments
 * @param {String} dir working directory path
 * @returns {ChildProcess} spawned ChildProcess
 */
function run(args, dir) {
  return cp.spawnSync('tuture', args, { cwd: dir });
}

// Temporary Git repo.
const testRepo = [
  {
    message: 'Commit 1',
    files: ['test1.js', 'test2.js'],
  },
  {
    message: 'Commit 2',
    files: ['package-lock.json'],
  },
];

function createEmptyDir() {
  return tmp.dirSync().name;
}

/**
 * Create a temporary Git repo according to `testRepo`.
 */
function createGitRepo() {
  const repoPath = tmp.dirSync().name;

  // cp.execSync(`git init`, { cwd: repoPath });
  // testRepo.map(step => {
  //   step.files.map(file => cp.execSync(`touch ${file}`, { cwd: repoPath }));
  //   cp.execSync(`git add ${step.files.join(' ')}`, { cwd: repoPath });
  //   cp.execSync(`git commit -m '${step.message}'`, { cwd: repoPath });
  // });

  process.chdir(repoPath);
  cp.execSync(`git init`);
  testRepo.map(step => {
    step.files.map(file => cp.execSync(`touch ${file}`));
    cp.execSync(`git add ${step.files.join(' ')}`);
    cp.execSync(`git commit -m '${step.message}'`);
  });

  return repoPath;
}

function createTutureSuite() {
  const tuturePath = tmp.dirSync().name;
  process.chdir(tuturePath);
  fs.mkdirpSync(path.join('.tuture', 'diff'));
  fs.createFileSync('tuture.yml');

  return tuturePath;
}

exports.run = run;
exports.testRepo = testRepo;
exports.createEmptyDir = createEmptyDir;
exports.createGitRepo = createGitRepo;
exports.createTutureSuite = createTutureSuite;
