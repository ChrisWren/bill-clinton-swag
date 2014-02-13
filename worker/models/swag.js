var CONFIG = require('config')
  , mongoose = require('mongoose')
  , autoIncrement = require('mongoose-auto-increment')
  , Schema = mongoose.Schema;

// Connect to Database
var connection = mongoose.connect(CONFIG.database.connection_string);
autoIncrement.initialize(connection);

var SwagSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  photo_url : {
    type: String,
    default: '',
    trim: true,
  }
});

SwagSchema.plugin(autoIncrement.plugin, 'Swag');
var Swag = mongoose.model('Swag', SwagSchema);

