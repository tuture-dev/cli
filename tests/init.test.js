const utils = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { EXPLAIN_PLACEHOLDER, shouldBeCollapsed } = require('../utils/common');

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
      // NOTE: When contriving testRepo, put `files` in alphabetic order.
      const testRepo = [
        {
          message: 'Commit 1',
          files: ['test1.js', 'test2.js'],
        },
        {
          message: 'Commit 2',
          files: ['package-lock.json'],
        },
      ];
      testInit(testRepo);
    });

    describe('.gitignore without ignoring .tuture', () => {
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

function testInit(testRepo, ignoreTuture = false) {
  const gitRepo = utils.createGitRepo(testRepo, ignoreTuture);
  tmpDirs.push(gitRepo);
  process.chdir(gitRepo);
  const cp = utils.run(['init', '-y']);

  // Make sure when running each test, it's on the correct path.
  beforeEach(() => {
    process.chdir(gitRepo);
  })

  it('should exit with status 0', () => {
    expect(cp.status).toBe(0);
  });

  it('should create .tuture/diff directory', () => {
    const diffPath = path.join('.tuture', 'diff');
    expect(fs.existsSync(diffPath)).toBe(true);
    expect(fs.readdirSync(diffPath).length).toBe(testRepo.length);
  });

  it('should create correct tuture.yml with default values', () => {
    expect(fs.existsSync('tuture.yml')).toBe(true);

    const tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
    testTutureObject(testRepo, tuture);
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

function testTutureObject(testRepo, tuture) {
  // Expect metadata to be default values.
  expect(tuture.name).toBe('My Awesome Tutorial');
  expect(tuture.version).toBe('0.0.1');
  expect(tuture.language).toBe('en');

  expect(tuture.steps.length).toBe(testRepo.length);

  // Check equivalence of each step.
  for (let i = 0; i < testRepo.length; i++) {
    expect(tuture.steps[i].name).toBe(testRepo[i].message);
    expect(tuture.steps[i].explain).toBe(EXPLAIN_PLACEHOLDER);
    expect(tuture.steps[i].diff.length).toBe(testRepo[i].files.length);

    for (let j = 0; j < testRepo[i].files.length; j++) {
      expect(tuture.steps[i].diff[j].file).toBe(testRepo[i].files[j]);
      expect(tuture.steps[i].diff[j].explain).toBe(EXPLAIN_PLACEHOLDER);

      if (shouldBeCollapsed(testRepo[i].files[j])) {
        expect(tuture.steps[i].diff[j].collapse).toBe(true);
      }
    }
  }
}
