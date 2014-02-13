var CONFIG = require('config')
  , express = require('express')
  , app = express()
  , hbs = require('express-hbs')
  , mongoose = require('mongoose')
  , autoIncrement = require('mongoose-auto-increment');

// Connect to Database
var connection = mongoose.connect(CONFIG.database.connection_string);
autoIncrement.initialize(connection);

// Load Models
var swag = require('./models/swag.js');

// Load Worker Queue
var queue = require('./lib/worker_queue.js');

// Setup Public Folder
app.use(express.static(__dirname + '/public'));

// View Engine Setup
app.engine('hbs', hbs.express3({
  partialsDir: __dirname + "/views/partials",
  layoutsDir: __dirname + "/views/layouts",
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");

// Middleware
app.use(express.bodyParser());

// Load Controllers
var home_controller = require('./controllers/home_controller.js')
  , swag_controller = require('./controllers/swag_controller.js');

// Routes
app.get('/', home_controller.index);
app.post('/swag', swag_controller.post);
app.get('/swag/:id', swag_controller.get);

// Startup
app.listen(3000);
console.log("Listening on port 3000");

