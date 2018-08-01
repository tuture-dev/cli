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

    describe('add commits plainly', () => {
      const repoPath = utils.createGitRepo();
      const tutureRunner = utils.tutureRunnerFactory(repoPath);
      const gitRunner = utils.gitRunnerFactory(repoPath);
      const tutureYmlPath = path.join(repoPath, 'tuture.yml');
      tmpDirs.push(repoPath);

      tutureRunner(['init', '-y']);

      // Write some explanations.
      const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
      tuture.steps[0].explain = 'Some Explanation';
      fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

      // Add one more commit.
      fs.createFileSync(path.join(repoPath, 'test4.js'));
      gitRunner(['add', 'test4.js']);
      gitRunner(['commit', '-m', 'Commit 3']);

      it('should have updated diff.json', () => {
        const diffContent = utils.parseInternalFile(repoPath, 'diff.json');
        expect(diffContent).toHaveLength(utils.exampleRepo.length + 1);
      });

      it('should have updated tuture.[yml|json] appropriately', () => {
        const newTuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
        expect(newTuture.steps).toHaveLength(utils.exampleRepo.length + 1);
        expect(newTuture.steps[0].explain).toBe('Some Explanation');
        expect(newTuture.steps[2].name).toBe('Commit 3');
      });
    });

    describe('amend last commit', () => {
      const repoPath = utils.createGitRepo();
      const tutureRunner = utils.tutureRunnerFactory(repoPath);
      const gitRunner = utils.gitRunnerFactory(repoPath);
      const tutureYmlPath = path.join(repoPath, 'tuture.yml');
      tmpDirs.push(repoPath);

      tutureRunner(['init', '-y']);

      // Write some explanations.
      const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
      tuture.steps[0].explain = 'Some Explanation';
      fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

      // Amend last commit (revise commit log only).
      gitRunner(['commit', '--amend', '-m', 'Amended commit 2']);

      it('should not have updated diff.json', () => {
        const diffContent = utils.parseInternalFile(repoPath, 'diff.json');
        expect(diffContent).toHaveLength(utils.exampleRepo.length);
      });

      it('should have updated tuture.[yml|json] appropriately', () => {
        const newTuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
        expect(newTuture.steps).toHaveLength(utils.exampleRepo.length + 1);
        expect(newTuture.steps[0].explain).toBe('Some Explanation');

        // Outdated commit still there.
        expect(newTuture.steps[1].name).toBe('Commit 2');
        expect(newTuture.steps[1].outdated).toBe(true);

        expect(newTuture.steps[2].name).toBe('Amended commit 2');
      });
    });
  });

  describe('manual reload', () => {
    const repoPath = utils.createGitRepo();
    const tutureRunner = utils.tutureRunnerFactory(repoPath);
    const tutureYmlPath = path.join(repoPath, 'tuture.yml');
    tmpDirs.push(repoPath);

    tutureRunner(['init', '-y']);

    const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
    tuture.steps[0].explain = 'Some Explanation';

    const tutureBeforeReload = JSON.parse(JSON.stringify(tuture)); // deep copy
    const diffBeforeReload = utils.parseInternalFile(repoPath, 'diff.json');

    // Remove the last step to see if it can be recovered after reload.
    tuture.steps.pop();
    fs.writeFileSync(tutureYmlPath, yaml.safeDump(tuture));

    // Manually invoke `tuture reload`
    const cp = tutureRunner(['reload']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should leave internal files unchanged', () => {
      const diffAfterReload = utils.parseInternalFile(repoPath, 'diff.json');
      expect(diffAfterReload).toStrictEqual(diffBeforeReload);
    });

    it('should complete missing steps in tuture.yml', () => {
      const tutureAfterReload = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
      expect(tutureAfterReload).toStrictEqual(tutureBeforeReload);
    });
  });
});
