const utils = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture reload', () => {

  afterAll(() => tmpDirs.forEach(dir => fs.removeSync(dir)));

  describe('tuture is not initialized', () => {
    const nonRepoPath = utils.createEmptyDir();
    const tutureRunner = utils.tutureRunnerFactory(nonRepoPath);
    tmpDirs.push(nonRepoPath);

    it('should refuse to reload', () => {
      const cp = tutureRunner(['reload']);
      expect(cp.status).toBe(1);
    });
  });

  describe('automatic reload', () => {
    const repoPath = utils.createGitRepo();
    const tutureRunner = utils.tutureRunnerFactory(repoPath);
    const gitRunner = utils.gitRunnerFactory(repoPath);
    const tutureYmlPath = path.join(repoPath, 'tuture.yml');
    tmpDirs.push(repoPath);

    const cp = tutureRunner(['init', '-y']);

    // Write some explanations.
    const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
    tuture.steps[0].explain = 'Some Explanation';
    fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

    // Add one more commit.
    fs.createFileSync(path.join(repoPath, 'test3.js'));
    gitRunner(['add', 'test3.js']);
    gitRunner(['commit', '-m', 'Commit 3']);

    it('should have added new diff file', () => {
      const diffPath = path.join(repoPath, '.tuture', 'diff');
      expect(fs.readdirSync(diffPath).length).toBe(utils.exampleRepo.length + 1);
    });

    it('should have updated tuture.yml appropriately', () => {
      const newTuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
      expect(newTuture.steps.length).toBe(utils.exampleRepo.length + 1);
      expect(newTuture.steps[0].explain).toBe('Some Explanation');
      expect(newTuture.steps[2].name).toBe('Commit 3');
    });
  });

  describe('manual reload', () => {
    const repoPath = utils.createGitRepo();
    const tutureRunner = utils.tutureRunnerFactory(repoPath);
    const tutureYmlPath = path.join(repoPath, 'tuture.yml');
    tmpDirs.push(repoPath);

    tutureRunner(['init', '-y']);

    // Add some explanation and remove the last step in tuture.yml.
    const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
    tuture.steps[0].explain = 'Some Explanation';
    tuture.steps.pop();
    fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

    // Manually invoke `tuture reload`
    const cp = tutureRunner(['reload']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should leave diff files unchanged', () => {
      const diffPath = path.join(repoPath, '.tuture', 'diff');
      expect(fs.readdirSync(diffPath).length).toBe(utils.exampleRepo.length);
    });

    it('should complete missing steps in tuture.yml', () => {
      const newTuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
      expect(newTuture.steps.length).toBe(utils.exampleRepo.length);
      expect(newTuture.steps[0].explain).toBe('Some Explanation');
    });
  });
});
