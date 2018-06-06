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

  describe('tuture is not initialized', () => {
    const nonTuturePath = utils.createEmptyDir();
    tmpDirs.push(nonTuturePath);

    it('should refuse to up', () => {
      process.chdir(nonTuturePath);
      const cp = utils.run(['up']);
      expect(cp.status).toBe(1);
    });
  });
});
