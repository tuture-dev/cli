const utils = require('./utils');
const testRepo = require('./utils').testRepo;
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const { EXPLAIN_PLACEHOLDER } = require('../utils/common');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture init', () => {

  afterAll(() => {
    tmpDirs.map(dir => fs.removeSync(dir));
    process.chdir(path.join(__dirname, '..'));
  });

  // TODO: Test prompts when no args given.

  describe('-y', () => {
    testInit('-y');
  });

  describe('--yes', () => {
    testInit('--yes');
  });
});

function testInit(option) {
  const nonGitRepo = utils.createEmptyDir();
  tmpDirs.push(nonGitRepo);
  process.chdir(nonGitRepo);
  const cp1 = utils.run(['init', option]);

  it('should refuse to init outside a git repo', () => {
    expect(cp1.status).toBe(1);
  });

  const gitRepo = utils.createGitRepo();
  tmpDirs.push(gitRepo);
  process.chdir(gitRepo);
  const cp2 = utils.run(['init', option]);

  it('should exit with status 0', () => {
    expect(cp2.status).toBe(0);
  });

  it('should create .tuture/diff directory', () => {
    const diffPath = path.join('.tuture', 'diff');
    expect(fs.existsSync(diffPath)).toBe(true);
    expect(fs.readdirSync(diffPath).length).toBe(testRepo.length);
  });

  it('should create correct tuture.yml with default values', () => {
    expect(fs.existsSync('tuture.yml')).toBe(true);

    const tuture = yaml.safeLoad(fs.readFileSync('tuture.yml'));
    testTutureObject(tuture);
  });
}

function testTutureObject(tuture) {
  expect(tuture.name).toBe('My Awesome Tutorial');
  expect(tuture.language).toBe('en');
  expect(tuture.steps.length).toBe(testRepo.length);
  expect(tuture.steps[0].name).toBe(testRepo[0].message);
  expect(tuture.steps[0].explain).toBe(EXPLAIN_PLACEHOLDER);
  expect(tuture.steps[0].diff[0].file).toBe(testRepo[0].files[0]);
  expect(tuture.steps[0].diff[0].explain).toBe(EXPLAIN_PLACEHOLDER);
  expect(tuture.steps[0].diff[1].file).toBe(testRepo[0].files[1]);
  expect(tuture.steps[0].diff[1].explain).toBe(EXPLAIN_PLACEHOLDER);
  expect(tuture.steps[1].name).toBe(testRepo[1].message);
  expect(tuture.steps[1].diff[0].file).toBe(testRepo[1].files[0]);
  expect(tuture.steps[1].diff[0].explain).toBe(EXPLAIN_PLACEHOLDER);
  expect(tuture.steps[1].diff[0].collapse).toBe(true);
}
