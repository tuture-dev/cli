const path = require('path');

const { run } = require('./utils');
const { version } = require('../package.json');

describe('tuture', () => {

  test('output help message', () => {
    // no args given
    matchHelpMessage(run([]).stdout);

    // -h option given
    matchHelpMessage(run(['-h']).stdout);

    // --help option given
    matchHelpMessage(run(['--help']).stdout);
  });

  test('output version number', () => {
    // -V option given
    expect(run(['-V']).stdout.toString()).toMatch(version);

    // --version option given
    expect(run(['--version']).stdout.toString()).toMatch(version);
  });

  test('unknown args', () => {
    // unknown commands given
    expect(run(['foobar']).status).toBe(1);

    // unknown options (shorthand) given
    expect(run(['-f']).status).toBe(1);

    // unknown options given
    expect(run(['--foobar']).status).toBe(1);
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
