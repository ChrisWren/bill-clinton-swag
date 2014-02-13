$(function() {
  var search_result_template = "\
    <li class='result'> \
      <img src='<%= src %>'></img> \
      <div class='info'> \
        <span class='album'><%= album %></span><br/> \
        <span class='artist'><%= artist %></span> \
      </div> \
    </li> \
  ";

  var search_function = function(searchQuery, done) {
    var fmurl = "http://ws.audioscrobbler.com/2.0/?method=album.search&album=" 
                + encodeURIComponent(searchQuery) 
                + "&api_key=ca14ba934a1e3c12f36c30bdf81f4f43&format=json&callback=";

    $.getJSON(fmurl, function(data) {
      var albums = [];
      try {
        albums = data.results.albummatches.album.splice(0,5).map(function(album) {
          return { 
            src: album.image[1]["#text"],
            src_large: album.image[3]["#text"],
            artist: album.artist,
            album: album.name
          };
        });

      } catch(err){
      }
      done(albums);
    });
  };


  Albums.init($("#records"));

  Albums.onZeroRemaining(function() {
    Searchbar.hide();
  });

  Searchbar.init($('.search'), {
    search_function: search_function, 
    search_result_template: search_result_template
  });

  Searchbar.onSelect(function(album) {
    Albums.addAlbum(album);
  });
});
