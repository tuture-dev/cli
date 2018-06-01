const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture destroy', () => {

  afterAll(() => {
    tmpDirs.map(dir => fs.removeSync(dir));
    process.chdir(path.join(__dirname, '..'));
  });

  describe('(no args)', () => {
    const tuturePath = utils.createTutureSuite();
    tmpDirs.push(tuturePath);
    process.chdir(tuturePath);
    const cp = utils.run(['destroy']);

    it('should prompt message', () => {
      expect(cp.stdout.toString()).toMatch(/Are you sure?/);
    });

    // TODO: Untangle this prompt mess.
    it.skip('should not delete tuture files when choosing default', () => {
      expect(fs.existsSync(path.join('.tuture', 'diff'))).toBe(true);
      expect(fs.existsSync('tuture.yml')).toBe(true);
    });
  });

  describe('-f', () => {
    testDestroy(['destroy', '-f']);
  });

  describe('--force', () => {
    testDestroy(['destroy', '--force']);
  });
});

function testDestroy(args) {
  const nonTuturePath = utils.createEmptyDir();
  tmpDirs.push(nonTuturePath);
  process.chdir(nonTuturePath);
  const cp1 = utils.run(args);

  it('should refuse to destroy when no tuture files present', () => {
    expect(cp1.status).toBe(1);
  });

  const tuturePath = utils.createTutureSuite();
  tmpDirs.push(tuturePath);
  process.chdir(tuturePath);
  const cp2 = utils.run(args);

  it('should exit with status 0', () => {
    expect(cp2.status).toBe(0);
  });

  it('should delete all tuture files', () => {
    expect(fs.existsSync(path.join('.tuture', 'diff'))).toBe(false);
    expect(fs.existsSync('tuture.yml')).toBe(false);
  });
}
