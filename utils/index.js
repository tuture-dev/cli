/**
 * Utilities for implementing Tuture CLI.
 */

exports.initTuture = require('./init');
exports.startRenderer = require('./up');
exports.destroyTuture = require('./destroy');

exports.handleUnknownCmd = (cmd) => {
  console.log(`Unknown command: ${cmd}`);
  process.exit(1);
};
