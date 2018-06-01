const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture up', () => {

  afterAll(() => {
    tmpDirs.map(dir => fs.removeSync(dir));
    process.chdir(path.join(__dirname, '..'));
  });

  describe('(no args)', () => {
    const nonTuturePath = utils.createEmptyDir();
    tmpDirs.push(nonTuturePath);
    process.chdir(nonTuturePath);
    const cp1 = utils.run(['up']);

    it('should refuse to up when tuture is not initialized', () => {
      expect(cp1.status).toBe(1);
    });

    // TODO: Figure out how to test whether tuture-renderer is invoked.
    it.skip('should exit with status 0 when everything is ok', () => {
      const tuturePath = utils.createTutureSuite();
      tmpDirs.push(tuturePath);
      process.chdir(tuturePath);
      const cp2 = utils.run(['up']);
      expect(cp2.status).toBe(0);
    });
  });
});
