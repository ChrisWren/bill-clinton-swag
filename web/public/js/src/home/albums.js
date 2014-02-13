var Albums = Albums || {};

(function(Albums) {
  var album_template = " \
    <div class='decision'> \
      <img src='<%= src_large %>'></img> \
    </div> \
  ";

  var loader_template = " \
    <img id='spinner' src='/images/bin/ajax-loader.gif'></img> \
  ";

  var button_template = " \
    <button id='gswag'>Generate Swag</button> \
  ";

  var elem
    , data = []
    , remaining_albums = 4
    , zero_remaining_callbacks = [];

  function generateSwag() {
    var params = { 
      "images": [
        data[0].src_large,
        data[1].src_large,
        data[2].src_large,
        data[3].src_large,
      ]
    };

    $("#records").empty();
    $("#records").append(loader_template);

    var resource_available = false;

    $.ajax({
      type: "POST",
      url: '/swag',
      contentType: "application/json",
      data: JSON.stringify(params),
      dataType: "json",
      success: function(data) {
        poller(data.id);
      }
    });

    var poller = function(id) {
      $.ajax({
        type: "GET",
        url: "/swag/" + id, 
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
          resource_available = data.resource_available;

          if(!resource_available) {
            setTimeout(function() {
              poller(id);
            }, 500);
          } else {
            window.location.replace("/swag/" + id);
          }
        }
      });
    };

    // url = data.url;
    // $("#spinner").remove();
    // window.location.replace(data.share);

  }

  Albums.init = function(el) {
    elem = el;
  }

  Albums.addAlbum = function(album) {
    data.push(album);
    remaining_albums--;

    var template = _.template(album_template)(album);

    $(elem).find("#preview .no_records").remove();
    $(elem).find("#preview").append(template);

    if(remaining_albums == 0) {
      $(elem).find("#instructions #remaining").remove();
      $(elem).find("#instructions #remaining_message").remove();
      $(elem).find("#instructions").append(button_template)
                                   .click(generateSwag);

      zero_remaining_callbacks.forEach(function(cb) { cb() });
    } else {
      $(elem).find("#instructions #remaining").html(remaining_albums);
    }
  }

  Albums.onZeroRemaining = function(cb) {
    zero_remaining_callbacks.push(cb);
  }
})(Albums)
