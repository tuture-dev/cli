const fs = require('fs-extra');
const cp = require('child_process');
const path = require('path');
const tmp = require('tmp');

const { EXPLAIN_PLACEHOLDER } = require('../lib/common');

const exampleRepo = [
  {
    message: 'Commit 1',
    files: ['test1.js', 'test2.js'],
  },
  {
    message: 'Commit 2',
    files: ['package-lock.json'],
  },
];

/**
 * Factory of functions running tuture commands in a given directory.
 */
function tutureRunnerFactory(cwd) {
  return function(args) {
    const tuturePath = path.join(__dirname, '..', 'bin', 'tuture');
    return cp.spawnSync(tuturePath, args, { cwd: cwd });
  }
}

/**
 * Factory of functions running git commands in a given directory.
 */
function gitRunnerFactory(cwd) {
  return function(args) {
    return cp.spawnSync('git', args, { cwd: cwd });
  }
}

/**
 * Create an empty temporary directory.
 * @returns {String} Path to the created directory.
 */
function createEmptyDir() {
  return tmp.dirSync().name;
}

/**
 * Create a temporary Git repo.
 * @param {Array<Object>} repo Commit objects with `message` and `files`
 * @param {Boolean} ignoreTuture Whether .tuture should be ignored in .gitignore
 * @returns {String} Path to the created Git repo
 */
function createGitRepo(repo = exampleRepo, ignoreTuture = false) {
  const repoPath = tmp.dirSync().name;
  const gitRunner = gitRunnerFactory(repoPath);

  gitRunner(['init']);

  repo.forEach(commit => {
    commit.files.forEach(fileName => {
      const dir = path.parse(fileName).dir;
      if (dir) fs.mkdirpSync(path.join(repoPath, dir));
      if (fileName === '.gitignore' && ignoreTuture) {
        fs.writeFileSync(path.join(repoPath, fileName), '.tuture\n');
      } else {
        fs.createFileSync(path.join(repoPath, fileName));
      }
    });
    gitRunner(['add', ...commit.files]);
    gitRunner(['commit', '-m', commit.message]);
  });

  return repoPath;
}

exports.exampleRepo = exampleRepo;
exports.tutureRunnerFactory = tutureRunnerFactory;
exports.gitRunnerFactory = gitRunnerFactory;
exports.createEmptyDir = createEmptyDir;
exports.createGitRepo = createGitRepo;
