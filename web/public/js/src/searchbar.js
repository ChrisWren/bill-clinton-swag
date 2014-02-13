
var current_selection = -1;
var records = [];

$(document).ready(function() {
  //loadPreview();
  $(document).keydown(function(e) {
    switch(e.keyCode) {
      case 38:
        navigate('up');
        break;
      case 40:
        navigate('down');
        break;
      case 13:
        if ($("#search_results").is(":visible")) {
          addRecord($("#search_results li").eq(current_selection));
          setTimeout(function() {$("#search_results").hide();}, 50);
          current_selection = -1;
        }
        break;
    }
  });

  var timer;
  $("#search").keyup(function(e) {
    if(e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) {
      return false;
    }
    if ($(this).val().length > 3) {
      if(timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(search, 300);
    }
    else {
      $("#search_results").empty();
      $("#serach_results").hide();
      current_selection = -1;
    }
  });

  $("#search").blur(function(e) {
    setTimeout(function() { $("#search_results").empty(); $("#search_results").hide();}, 300);
    current_selection = -1;
  });
});

function addRecord(item) {
  if(records.length == 0) {
    $(".no_records").remove();
  }

  if(records.length < 4 ) {
    var record = $(item).data('item');

    var frame = $(_.template($("#album-view-template").html(), {src : record.image[3]["#text"], artist : record.artist, album : record.name }));

    $("#preview").append(frame);

    $("#search").val('');
    records.push(record);

    if(4-records.length != 0) {
      $("#remaining").html(4 - records.length);
    }
    else {
      $("#remaining").remove();
      $("#remaining_message").remove();
      $("#instructions").append($("<button>").attr('id', 'gswag').html("Generate Swag").click(function(e) {
        loadPreview();
      }));
    }
  }
}

function loadPreview() {

  $("#search").hide();

  var img = new Image();
  var url = 'photo';

  var params = { image_one : records[0].image[2]['#text'],
    image_two : records[1].image[2]['#text'],
    image_three : records[2].image[2]['#text'],
    image_four : records[3].image[2]['#text']}

  $("#records").empty();
  $("#records").append($("<img>").attr('id', 'spinner').attr('src', '/assets/ajax-loader.gif'));

  setTimeout(function() {
    var resp = $.getJSON(url, params, function(data) {
      url = data.url;
      $("#spinner").remove();
      window.location.replace(data.share);

    });
  }, 300);




}

function navigate(direction) {

  if($("#search_results li .itemhover").size() == 0) {
    //current_selection = -1;
  }

  if(direction == 'up' && current_selection != -1) {
    if(current_selection != 0) {
      current_selection--;
    }
  }
  else if (direction == 'down') {

    if(current_selection != $("#search_results li").size() -1) {
      current_selection++;
    }
  }
  setSelected(current_selection);
}

function setSelected(menuitem) {
  $("#search_results li").removeClass("itemhover");
  $("#search_results li").eq(menuitem).addClass("itemhover");
}

function search() {
  current_selection = -1;
  var searchQuery = $("#search").val();
  var fmurl = "http://ws.audioscrobbler.com/2.0/?method=album.search&album=" + encodeURIComponent(searchQuery) + "&api_key=ca14ba934a1e3c12f36c30bdf81f4f43&format=json&callback="

  $("#search_spinner").show();

  $.getJSON(fmurl, function(data) {
    $("#search_spinner").hide();
    $("#search_results").empty();
    $("#search_results").show();
    $.each(data.results.albummatches.album, function(i, item) {
      if (i < 5) {

        var frame = $(_.template($("#search-view-template").html(), {src : item.image[1]["#text"], artist : item.artist, album : item.name }));
        $(frame).data('item', item);
        $("#search_results").append(frame);
        $(frame).click(function(e) {
          addRecord($(this));
          setTimeout(function() {$("#search_results").hide();}, 50);
          current_selection = -1;
        });
        $(frame).mouseenter(function(e) {
          current_selection = $(this).index();
          setSelected($(this).index());
        });

      }
    });
  });
}
