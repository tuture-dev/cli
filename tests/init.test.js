const utils = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { EXPLAIN_PLACEHOLDER, shouldBeCollapsed } = require('../lib/common');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture init', () => {

  afterAll(() => {
    tmpDirs.forEach(dir => fs.removeSync(dir));
    process.chdir(path.join(__dirname, '..'));
  });

  describe('outside a git repo', () => {
    const nonGitRepo = utils.createEmptyDir();
    tmpDirs.push(nonGitRepo);

    it('should refuse to init', () => {
      process.chdir(nonGitRepo);
      const cp = utils.run(['init', '-y']);
      expect(cp.status).toBe(1);
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
          files: ['tuture.yml'],
        },
        {
          message: 'Do some other thing',
          files: ['index.html'],
        },
      ];
      testInit(testRepo);
    });

    describe('no commit at all', () => {
      const gitRepo = utils.createGitRepo([]);
      tmpDirs.push(gitRepo);

      it('should refuse to init', () => {
        process.chdir(gitRepo);
        const cp = utils.run(['init', '-y']);
        expect(cp.status).toBe(1);
      });
    });
  });
});

function testInit(testRepo = utils.exampleRepo, ignoreTuture = false) {
  const gitRepo = utils.createGitRepo(testRepo, ignoreTuture);

  // Remove commits with commit messages starting with `tuture:`
  const expectedRepo = testRepo.filter(commit => !commit.message.startsWith('tuture:'));

  tmpDirs.push(gitRepo);
  process.chdir(gitRepo);
  const cp = utils.run(['init', '-y']);

  // Make sure when running each test, it's on the correct path.
  beforeEach(() => {
    process.chdir(gitRepo);
  });

  it('should exit with status 0', () => {
    expect(cp.status).toBe(0);
  });

  it('should create .tuture/diff directory', () => {
    const diffPath = path.join('.tuture', 'diff');
    expect(fs.existsSync(diffPath)).toBe(true);
    expect(fs.readdirSync(diffPath).length).toBe(expectedRepo.length);
  });

  it('should create correct tuture.yml with default values', () => {
    expect(fs.existsSync('tuture.yml')).toBe(true);

    const tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
    testTutureObject(tuture, expectedRepo);
  });

  it('should have .gitignore properly configured', () => {
    expect(fs.existsSync('.gitignore')).toBe(true);

    const ignoreRules = fs.readFileSync('.gitignore').toString();

    // .tuture is ignored.
    expect(ignoreRules.indexOf('.tuture')).not.toBe(-1);

    // .tuture is ignored only once.
    expect(ignoreRules.indexOf('.tuture')).toBe(ignoreRules.lastIndexOf('.tuture'));
  });
}

function testTutureObject(tuture, expectedRepo) {
  // Expect metadata to be default values.
  expect(tuture.name).toBe('My Awesome Tutorial');
  expect(tuture.version).toBe('0.0.1');
  expect(tuture.language).toBe('en');

  expect(tuture.steps.length).toBe(expectedRepo.length);

  const steps = tuture.steps;

  // Check equivalence of each step.
  for (let i = 0; i < steps.length; i++) {
    expect(steps[i].name).toBe(expectedRepo[i].message);
    expect(steps[i].explain).toBe(EXPLAIN_PLACEHOLDER);
    expect(steps[i].diff.length).toBe(expectedRepo[i].files.length);

    for (let j = 0; j < expectedRepo[i].files.length; j++) {
      expect(steps[i].diff[j].file).toBe(expectedRepo[i].files[j]);
      expect(steps[i].diff[j].explain).toBe(EXPLAIN_PLACEHOLDER);

      if (shouldBeCollapsed(expectedRepo[i].files[j])) {
        expect(steps[i].diff[j].collapse).toBe(true);
      }
    }
  }
}
