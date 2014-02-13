require('./models/swag.js');

var worker_queue = require('./lib/worker_queue.js')
  , queue = worker_queue.getQueue()
  , generate_task = require('./tasks/generate_task.js');

queue.process('generate_swag', 3, generate_task.handle_task);

