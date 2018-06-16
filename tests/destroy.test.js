const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture destroy', () => {

  afterAll(() => tmpDirs.forEach(dir => fs.removeSync(dir)));

  describe('normal destroy', () => {
    const repoPath = utils.createGitRepo();
    const tutureRunner = utils.tutureRunnerFactory(repoPath);
    tmpDirs.push(repoPath);

    tutureRunner(['init', '-y']);

    const cp = tutureRunner(['destroy', '-f']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should delete all tuture files', () => {
      expect(fs.existsSync(path.join(repoPath, '.tuture', 'diff'))).toBe(false);
      expect(fs.existsSync(path.join(repoPath, 'tuture.yml'))).toBe(false);
    });

    it('should have no post-commit git hook', () => {
      const hookPath = path.join(repoPath, '.git', 'hooks', 'post-commit');
      if (fs.existsSync(hookPath)) {
        const hook = fs.readFileSync(hookPath).toString();
        expect(hook).toEqual(expect.not.stringContaining('tuture reload'));
      }
    });
  });

  describe('no tuture files present', () => {
    const nonTuturePath = utils.createEmptyDir();
    const tutureRunner = utils.tutureRunnerFactory(nonTuturePath);
    tmpDirs.push(nonTuturePath);

    const cp = tutureRunner(['destroy', '-f']);

    it('should refuse to destroy', () => {
      expect(cp.status).toBe(1);
    });
  });
});
