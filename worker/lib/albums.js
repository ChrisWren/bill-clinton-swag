var CONFIG = require('config').lastfm;
var request = require('request');

/* Private: Generate an authorized search url to
 * get an album's artwork
 *
 * album_name - Name of the album searching for
 *
 * Returns String url
 */
function authorized_search_url(album_name) {
  return "http://ws.audioscrobbler.com/2.0/?method=album.search&album="
          + encodeURIComponent(album_name)
          + "&api_key="
          + CONFIG.api_key
          + "&format=json&callback=";
}

/* Private: Gets link to photo of large album art
 *
 * album_name - String search query for album
 * cb - Callback
 *
 * Returns String url for large sized album art
 */
function get_large_photo_url(album_name, cb) {
  request({
    uri: authorized_search_url(album_name),
    json: true,
  }, function(err, resp, body) {
    if(err) {
      cb(err);
      return;
    }

    var large_image_url = body.results.albummatches.album[0].image.filter(function(image) {
      return image.size == "large";
    })[0]['#text'];

    cb(undefined, large_image_url);
  });
}

/* 
 * Public: Gets the album artwork for a specified album art url
 *
 * album_url - String url to the album artwork
 * cb - Callback
 *
 * Returns: Buffered Image of album art
 */
module.exports.downloadAlbumArt = function(album_url, cb) {
  request({
    uri: album_url,
    encoding: null,
  }, function(err, resp, body) {
    if(err) {
      cb(err);
      return;
    }

    // Return the buffered image
    cb(undefined, body);
  });
}

/* 
 * Public: Gets the album artwork for a specified album search query
 *
 * album_name - String url to the album artwork
 * cb - Callback
 *
 * Returns: Buffered Image of album art
 */
module.exports.downloadAlbumArtBySearch = function(album_name, cb) {
  get_large_photo_url(album_name, function(err, image_url) {
    module.exports.downloadAlbumArt(image_url, cb);
  });
};
