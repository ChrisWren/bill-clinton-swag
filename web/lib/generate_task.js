var worker_queue = require('./worker_queue.js');

module.exports.create = function(id, images) {
  var queue = worker_queue.getQueue();

  queue.create('generate_swag', {
    id: id,
    images: images
  }).attempts(3).save();
}
