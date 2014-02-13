var CONFIG = require("config").s3
  , AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: CONFIG.access_key,
    secretAccessKey: CONFIG.secret_access_key
});

var s3 = new AWS.S3();

/*
 * Public: Upload a file to the configured s3 bucket
 *
 * body - String | Buffer of the content of the uploaded content
 * key - String the filename
 * cb - Callback(err, resp)
 *
 * Returns error or response via callback
 */
module.exports.upload = function(body, key, cb) {
  console.log(body);
  console.log(key);
  var params = {
    Bucket: CONFIG.bucket,
    Key: key,
    Body: body
  };

  s3.putObject(params, cb);
}

