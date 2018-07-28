const fs = require('fs-extra');
const path = require('path');

const utils = require('./utils');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture up', () => {

  afterAll(() => tmpDirs.forEach(dir => fs.removeSync(dir)));

  describe('tuture is not initialized', () => {
    const nonTuturePath = utils.createEmptyDir();
    const tutureRunner = utils.tutureRunnerFactory(nonTuturePath);
    tmpDirs.push(nonTuturePath);

    it('should refuse to up', () => {
      const cp = tutureRunner(['up']);
      expect(cp.status).toBe(1);
    });
  });

  describe('tuture.yml syntax error', () => {
    const repoPath = utils.createGitRepo();
    const tutureRunner = utils.tutureRunnerFactory(repoPath);
    tmpDirs.push(repoPath);
    tutureRunner(['init', '-y']);

    const flawedTuture = 'foo: bar:';
    fs.writeFileSync(path.join(repoPath, 'tuture.yml'), flawedTuture);

    it('should report syntax error', () => {
      const cp = tutureRunner(['up']);
      expect(cp.status).toBe(1);
      expect(cp.stdout.toString()).toMatch(/syntax error/);
    });
  })
});
