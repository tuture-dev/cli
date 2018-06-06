const fs = require('fs-extra');
const cp = require('child_process');
const path = require('path');
const tmp = require('tmp');

const { EXPLAIN_PLACEHOLDER } = require('../utils/common');

/**
 * Run any tuture command.
 * @param {Array} args array of arguments
 * @returns {ChildProcess} spawned ChildProcess
 */
function run(args) {
  return cp.spawnSync('tuture', args);
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
function createGitRepo(repo, ignoreTuture = false) {
  const repoPath = tmp.dirSync().name;

  process.chdir(repoPath);
  cp.execSync(`git init`);
  repo.forEach(commit => {
    commit.files.forEach(fileName => {
      const dir = path.parse(fileName).dir;
      if (dir) fs.mkdirpSync(dir);
      if (fileName === '.gitignore' && ignoreTuture) {
        fs.writeFileSync(fileName, '.tuture\n');
      } else {
        cp.execSync(`touch ${fileName}`);
      }
    });
    cp.execSync(`git add ${commit.files.join(' ')}`);
    cp.execSync(`git commit -m '${commit.message}'`);
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
exports.createEmptyDir = createEmptyDir;
exports.createGitRepo = createGitRepo;
exports.createTutureSuite = createTutureSuite;
