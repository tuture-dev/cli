const utils = require('./utils');
const fs = require('fs-extra');
const minimatch = require('minimatch');
const path = require('path');
const yaml = require('js-yaml');

const { ignoreFiles, tutureRoot } = require('../lib/config');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture init -y', () => {

  afterAll(() => tmpDirs.forEach(dir => fs.removeSync(dir)));

  describe('outside a git repo', () => {
    const nonRepoPath = utils.createEmptyDir();
    const tutureRunner = utils.tutureRunnerFactory(nonRepoPath);
    tmpDirs.push(nonRepoPath);

    const cp = tutureRunner(['init', '-y']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should have all needed files created', () => {
      expect(fs.existsSync(path.join(nonRepoPath, 'tuture.yml'))).toBe(true);
      expect(fs.existsSync(path.join(nonRepoPath, tutureRoot, 'diff.json'))).toBe(true);
    });
  });

  describe('inside a Git repo', () => {

    describe('no .gitignore', () => {
      testInit();
    });

    describe('.gitignore without ignoring .tuture', () => {
      // NOTE: When contriving testRepo, put `files` in alphabetic order.
      const testRepo = [
        {
          message: 'Test',
          files: ['.gitignore', 'app.js'],
        },
        {
          message: 'Another Test',
          files: ['dir/test1.js', 'dir/yarn.lock'],
        },
        {
          message: 'Still Another Test',
          files: ['dir/test2.js'],
        },
      ];
      testInit(testRepo);
    });

    describe('.gitignore already having .tuture ignored', () => {
      const testRepo = [
        {
          message: 'First Commit',
          files: ['.gitignore', 'test1.js'],
        },
        {
          message: 'Second Commit',
          files: ['test2.js'],
        },
      ];
      testInit(testRepo, true);
    });

    describe('have commits with messages starting with "tuture:"', () => {
      const testRepo = [
        {
          message: 'Do something',
          files: ['bar.js', 'foo.js'],
        },
        {
          message: 'tuture: Ignore this commit',
          files: ['foobar.js'],
        },
        {
          message: 'Do some other thing',
          files: ['index.html'],
        },
      ];
      testInit(testRepo);
    });
  });
});

function testInit(testRepo = utils.exampleRepo, ignoreTuture = false) {
  const repoPath = utils.createGitRepo(testRepo, ignoreTuture);
  const tutureRunner = utils.tutureRunnerFactory(repoPath);
  tmpDirs.push(repoPath);

  // Remove commits with commit messages starting with `tuture:`
  // and files that should be ignored in each commit.
  const expectedRepo = testRepo
    .filter(commit => !commit.message.startsWith('tuture:'))
    .map(commit => {
      const { message, files } = commit;
      return {
        message,
        files: files.filter(
          file => !ignoreFiles.some(pattern => minimatch(path.basename(file), pattern))
        )
      };
    });

  const cp = tutureRunner(['init', '-y']);

  it('should exit with status 0', () => {
    expect(cp.status).toBe(0);
  });

  it('should create valid diff.json', () => {
    const diffContent = utils.parseInternalFile(repoPath, 'diff.json');
    expect(diffContent).toHaveLength(expectedRepo.length);
    expect(diffContent[0]).toHaveProperty('commit');
    expect(diffContent[0]).toHaveProperty('diff');
  });

  it('should create correct tuture.yml with default values', () => {
    const tutureYmlPath = path.join(repoPath, 'tuture.yml');
    expect(fs.existsSync(tutureYmlPath)).toBe(true);

    const tuture = yaml.safeLoad(fs.readFileSync(tutureYmlPath));
    testTutureObject(tuture, expectedRepo);
  });

  it('should have .gitignore properly configured', () => {
    const gitignorePath = path.join(repoPath, '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const ignoreRules = fs.readFileSync(gitignorePath).toString();

    // .tuture is ignored.
    expect(ignoreRules).toContain(tutureRoot);

    // .tuture is ignored only once.
    expect(ignoreRules.indexOf(tutureRoot)).toBe(ignoreRules.lastIndexOf(tutureRoot));
  });
}

function testTutureObject(tuture, expectedRepo) {
  // Expect metadata to be default values.
  expect(tuture.name).toBe('My Awesome Tutorial');
  expect(tuture.version).toBe('0.0.1');
  expect(tuture.language).toBe('en');

  expect(tuture.steps).toHaveLength(expectedRepo.length);

  const steps = tuture.steps;

  // Check equivalence of each step.
  for (let i = 0; i < steps.length; i++) {
    expect(steps[i].name).toBe(expectedRepo[i].message);
    expect(steps[i].diff).toHaveLength(expectedRepo[i].files.length);

    for (let j = 0; j < expectedRepo[i].files.length; j++) {
      expect(steps[i].diff[j].file).toBe(expectedRepo[i].files[j]);
    }
  }
}
