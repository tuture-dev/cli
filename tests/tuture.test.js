const path = require('path');

const { run } = require('./utils');
const { version } = require('../package.json');

describe('tuture', () => {

  describe('(no args)', () => {
    it('should output help message', () => {
      matchHelpMessage(run([]).stdout);
    });
  });

  describe('-h', () => {
    it('should output help message', () => {
      matchHelpMessage(run(['-h']).stdout);
    });
  });

  describe('--help', () => {
    it('should output help message', () => {
      matchHelpMessage(run(['--help']).stdout);
    });
  });

  describe('-V', () => {
    it('should output version number', () => {
      expect(run(['-V']).stdout.toString()).toMatch(version);
    });
  });

  describe('--version', () => {
    it('should output version number', () => {
      expect(run(['--version']).stdout.toString()).toMatch(version);
    });
  });

  describe('unknown args', () => {
    it('should exit(1) when unknown commands are given', () => {
      expect(run(['foobar']).status).toBe(1);
    });

    it('should exit(1) when unknown options are given', () => {
      expect(run(['--foobar']).status).toBe(1);
    });
  });
});

/**
 * Utility function to check whether stdout is a valid help message.
 */
function matchHelpMessage(stdout) {
  const msg = stdout.toString();
  expect(msg).toMatch(/Usage:/);
  expect(msg).toMatch(/Options:/);
  expect(msg).toMatch(/Commands:/);
}
