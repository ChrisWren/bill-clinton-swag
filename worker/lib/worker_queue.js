var CONFIG = require('config').worker_queue
  , kue = require('kue');

var queue = kue.createQueue({
  port: CONFIG.port,
  host: CONFIG.host
});

/*
 * Public: Gets a connection to the worker queue
 *
 * Returns kue object representing the worker queue
 */
module.exports.getQueue = function() {
  return queue;
}
