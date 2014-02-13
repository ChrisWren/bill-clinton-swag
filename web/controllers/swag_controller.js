var mongoose = require('mongoose')
  , Swag = mongoose.model('Swag')
  , generateTask = require('./../lib/generate_task.js');

/*
 * Public: Post action that creates a task for generating Bill Clinton
 *         Swag photo.
 *
 * JSON Params: {
 *    "images" : [<image_url>, <image_url>, <image_url>, <image_url>]
 * }
 *
 * Returns: JSON with the future id of the Bill Clinton Swag Object that
 *          user can then poll for results.
 */
module.exports.post = function(req, resp) {
  if(req.body.images
     && req.body.images.every(function(image) { return typeof(image) === "string" })
     && req.body.images.length == 4) {

    var swag = new Swag();

    swag.save(function(err) {
      if(err) {
        console.log(err);

        resp.status(500).send({
          success: false,
          error: "Database Error"
        });

      } else {
        generateTask.create(swag.id, req.body.images);

        resp.send({
          success: true,
          id: swag.id
        });
      }
    });

  } else {
    resp.status(400).send({
      success: false,
      error: "Invalid parameters"
    });
  }
}

/*
 * Public: Get action that either gets the swag, or returns a promise that it'll 
 *         soon be available.
 *
 * Request Params: {
 *    id: <Number>
 * }
 *
 * Returns: JSON Request    - Whether or not the resource is available.
 *          Regular Request - The page.
 */
module.exports.get = function(req, resp) {
  if(req.is("json")) {
    Swag.findOne({ "_id" : req.params.id }, function(err, swag) {
      if(err || !swag) {
        resp.status(400).send({
          success: false,
          error: "Resource doesn't exist!"
        });
      } else {
        resp.send({
          success: true,
          resource_available: (swag.photo_url !== ""),
        });
      }
    });
  } else {
    Swag.findOne({ "_id" : req.params.id }, function(err, swag) {
      if(err) {
        resp.render('404', {
          layout: 'application',
        });
      } else if(!swag || (swag && swag.photo_url == "")) {
        resp.render('404', {
          layout: 'application',
        });
      } else {
        resp.render('swag', {
          layout: 'application',
          swag: swag,
        });
      }
    });
  }

};
