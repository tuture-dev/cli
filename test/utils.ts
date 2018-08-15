import cp from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp';

export interface Commit {
  message: string;
  files: string[];
}

export const exampleRepo: Commit[] = [
  {
    message: 'Commit 1',
    files: ['test1.js', 'test2.js'],
  },
  {
    message: 'Commit 2',
    files: ['test3.js'],
  },
];

/**
 * Factory of functions running tuture commands in a given directory.
 */
export function tutureRunnerFactory(cwd: string) {
  return function (args: string[]) {
    const tuturePath = path.join(__dirname, '..', 'bin', 'run');
    return cp.spawnSync('node', [tuturePath, ...args], { cwd });
  };
}

/**
 * Factory of functions running git commands in a given directory.
 */
export function gitRunnerFactory(cwd: string) {
  return function (args: string[]) {
    return cp.spawnSync('git', args, { cwd });
  };
}

/**
 * Create an empty temporary directory.
 */
export function createEmptyDir() {
  return tmp.dirSync().name;
}

/**
 * Create a temporary Git repo.
 */
export function createGitRepo(repo = exampleRepo, ignoreTuture = false) {
  const repoPath = tmp.dirSync().name;
  const gitRunner = gitRunnerFactory(repoPath);

  gitRunner(['init']);

  repo.forEach((commit) => {
    commit.files.forEach((fileName) => {
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

/**
 * Parse internal json files.
 */
export function parseInternalFile(repoPath: string, fileName: string) {
  return JSON.parse(
    fs.readFileSync(path.join(repoPath, '.tuture', fileName)).toString(),
  );
}
