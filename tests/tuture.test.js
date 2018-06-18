const utils = require('./utils');

const { version } = require('../package.json');

describe('tuture', () => {

  const tutureRunner = utils.tutureRunnerFactory('.');

  test('output help message', () => {
    // no args given
    matchHelpMessage(tutureRunner([]).stdout);

    // -h option given
    matchHelpMessage(tutureRunner(['-h']).stdout);

    // --help option given
    matchHelpMessage(tutureRunner(['--help']).stdout);
  });

  test('output version number', () => {
    // -V option given
    expect(tutureRunner(['-V']).stdout.toString()).toMatch(version);

    // --version option given
    expect(tutureRunner(['--version']).stdout.toString()).toMatch(version);
  });

  test('unknown args', () => {
    // unknown commands given
    expect(tutureRunner(['foobar']).status).toBe(1);

    // unknown options (shorthand) given
    expect(tutureRunner(['-f']).status).toBe(1);

    // unknown options given
    expect(tutureRunner(['--foobar']).status).toBe(1);
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
