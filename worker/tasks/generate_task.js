var albums = require('./../lib/albums.js')
  , CONFIG = require('config')
  , async = require('async')
  , s3 = require('./../lib/s3.js')
  , mongoose = require('mongoose')
  , Swag = mongoose.model('Swag')
  , billclinton_native = require('./../../billclinton-native');

function swag_key(id) {
    return id + "/swag.png";
}
function photo_url(id) {
    return "https://s3.amazonaws.com/" + CONFIG.s3.bucket + "/" + swag_key(id);
}

/*
 * Public: Event handler for the generate swag task.
 */
module.exports.handle_task = function(job, done) {

  async.waterfall([
    // Verify Parameters
    function(cb) {
      if(!job.data.id
          || !(job.data.images.length === 4)
          || !(job.data.images.every(function(image) { return (typeof(image)) === "string" }))) {

        var err = new Error("Invalid parameters!");
        cb(err);
      } else {
        cb(null);
      }
    },

    // Download Images
    function(cb) {
      async.map(job.data.images, albums.downloadAlbumArt, cb);
    },

    // Generate Swag
    function(images, cb) {
      try {
        var img = billclinton_native.generate.apply(this, images);
        cb(null, img);
      } catch(err) {
        cb(err);
      }
    },

    // Upload Image
    function(swag_image, cb) {
      s3.upload(swag_image, swag_key(job.data.id), cb);
    },

    // Update db record
    function(resp, cb) {
      Swag.findOne({ "_id" : job.data.id }, function(err, swag) {
        if(err || !swag) {
          cb("Unable to update Swag Database record!", null);
        } else {
          swag.photo_url = photo_url(job.data.id);
          swag.save(cb);
        }
      });
    }

  ], function(err, result) {
    done();
  });

}
