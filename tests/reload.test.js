const { execSync } = require('child_process');
const utils = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { EXPLAIN_PLACEHOLDER, shouldBeCollapsed } = require('../utils/common');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture reload', () => {

  afterAll(() => {
    tmpDirs.forEach(dir => fs.removeSync(dir));
    process.chdir(path.join(__dirname, '..'));
  });

  describe('tuture is not initialized', () => {
    const nonGitRepo = utils.createEmptyDir();
    tmpDirs.push(nonGitRepo);

    it('should refuse to reload', () => {
      process.chdir(nonGitRepo);
      const cp = utils.run(['reload']);
      expect(cp.status).toBe(1);
    });
  });

  describe('automatic reload', () => {
    const gitRepo = utils.createGitRepo();
    tmpDirs.push(gitRepo);
    process.chdir(gitRepo);
    const cp = utils.run(['init', '-y']);

    // Write some explanations.
    const tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
    tuture.steps[0].explain = 'Some Explanation';
    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));

    // Add one more commit.
    fs.createFileSync('test3.js');
    execSync(`git add test3.js && git commit -m "Commit 3"`);

    // Make sure when running each test, it's on the correct path.
    beforeEach(() => {
      process.chdir(gitRepo);
    });

    it('should have added new diff file', () => {
      const diffPath = path.join('.tuture', 'diff');
      expect(fs.readdirSync(diffPath).length).toBe(utils.exampleRepo.length + 1);
    });

    it('should have updated tuture.yml appropriately', () => {
      const newTuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
      expect(newTuture.steps.length).toBe(utils.exampleRepo.length + 1);
      expect(newTuture.steps[0].explain).toBe('Some Explanation');
      expect(newTuture.steps[2].name).toBe('Commit 3');
    });
  });

  describe('manual reload', () => {
    const gitRepo = utils.createGitRepo();
    tmpDirs.push(gitRepo);
    process.chdir(gitRepo);
    const cp = utils.run(['init', '-y']);

    // Add some explanation and remove the last step in tuture.yml.
    const tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
    tuture.steps[0].explain = 'Some Explanation';
    tuture.steps.pop();
    fs.writeFileSync('tuture.yml', yaml.safeDump(tuture));

    // Manually invoke `tuture reload`
    const cp2 = utils.run(['reload']);

    // Make sure when running each test, it's on the correct path.
    beforeEach(() => {
      process.chdir(gitRepo);
    });

    it('should exit with status 0', () => {
      expect(cp2.status).toBe(0);
    });

    it('should leave diff files unchanged', () => {
      const diffPath = path.join('.tuture', 'diff');
      expect(fs.readdirSync(diffPath).length).toBe(utils.exampleRepo.length);
    });

    it('should complete missing steps in tuture.yml', () => {
      const newTuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
      expect(newTuture.steps.length).toBe(utils.exampleRepo.length);
      expect(newTuture.steps[0].explain).toBe('Some Explanation');
    });
  });
});
