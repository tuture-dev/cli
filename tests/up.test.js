const fs = require('fs-extra');
const utils = require('./utils');

// Tmp directories used in tests.
let tmpDirs = Array();

describe('tuture up', () => {

  afterAll(() => tmpDirs.forEach(dir => fs.removeSync(dir)));

  describe('tuture is not initialized', () => {
    const nonTuturePath = utils.createEmptyDir();
    const tutureRunner = utils.tutureRunnerFactory(nonTuturePath);
    tmpDirs.push(nonTuturePath);

    it('should refuse to up', () => {
      const cp = tutureRunner(['up']);
      expect(cp.status).toBe(1);
    });
  });
});
