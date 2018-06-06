const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture destroy', () => {

  afterAll(() => {
    tmpDirs.forEach(dir => fs.removeSync(dir));
    process.chdir(path.join(__dirname, '..'));
  });

  describe('normal destroy', () => {
    const tuturePath = utils.createTutureSuite();
    tmpDirs.push(tuturePath);
    process.chdir(tuturePath);
    const cp = utils.run(['destroy', '-f']);

    it('should exit with status 0', () => {
      expect(cp.status).toBe(0);
    });

    it('should delete all tuture files', () => {
      process.chdir(tuturePath);
      expect(fs.existsSync(path.join('.tuture', 'diff'))).toBe(false);
      expect(fs.existsSync('tuture.yml')).toBe(false);
    });
  });

  describe('no tuture files present', () => {
    const nonTuturePath = utils.createEmptyDir();
    tmpDirs.push(nonTuturePath);
    process.chdir(nonTuturePath);
    const cp = utils.run(['destroy', '-f']);

    it('should refuse to destroy', () => {
      expect(cp.status).toBe(1);
    });
  });
});
