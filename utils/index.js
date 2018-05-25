/**
 * Utilities for implementing Tuture CLI.
 */

module.exports.initTuture = require('./init');
module.exports.startRenderer = require('./up');
module.exports.destroyTuture = require('./destroy');

module.exports.handleUnknownCmd = (cmd) => {
  console.log(`Unknown command: ${cmd}`);
  process.exit(1);
};
