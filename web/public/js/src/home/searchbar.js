var Searchbar = Searchbar || {};

(function(Searchbar) {
  var search_result_template = "";

  var on_select_callbacks = []
    , on_highlight_callbacks = [];

  var elem
    , current_selection = 0
    , num_items = 0
    , data
    , search_function;

  function navigate(direction) {
    if(direction == 'up')
      current_selection = (current_selection - 1) % num_items
    if(direction == 'down')
      current_selection = (current_selection + 1) % num_items
    
    refreshSelection();
  }

  function refreshSelection() {
    $(elem).find("#search_results li").removeClass("itemhover");
    $(elem).find("#search_results li").eq(current_selection).addClass("itemhover");
  }

  function searchResultClicked() {
    on_select_callbacks.forEach(function(cb) {
      cb(data[current_selection]);
    });

    $(elem).find("#search_results").hide();
    $(elem).find("#search").val("");
  }

  function onKeydown(e) {
    switch(e.keyCode) {
      case 38:
        navigate('up');
        break;
      case 40:
        navigate('down');
        break;
      case 13:
        searchResultClicked();
        break;
    }
  }

  var search = function(search_query) {
    $("#search_spinner").show();
    search_function(search_query, function(results) {
      $("#search_spinner").hide();

      data = results;
      var templates = results.map(function(result) {
        return _.template(search_result_template)(result);
      });

      num_items = templates.length;
      current_selection = -1;

      $(elem).find("#search_results").empty().append(templates.join(""));

      // Hover controller
      $(elem).find("#search_results li").mouseenter(function(e) {
        current_selection = $(this).index();
        refreshSelection();
      });

      // Click Controller
      $(elem).find("#search_results li").click(searchResultClicked);

      $(elem).find("#search_results").show();
    });
  };

  Searchbar.init = function(el, opts) {
    elem = el;
    search_function = opts.search_function;
    search_result_template = opts.search_result_template;

    // Navigation
    $(document).keydown(onKeydown);

    // Debounced Search
    $(elem).find("#search").keyup(_.debounce(function(e) {
      if(e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) {
        return false;
      }

      var search_query = $(elem).find("#search").val();
      if(search_query.length >= 3) {
        search(search_query);
      } else {
        $(elem).find("#search_results").hide();
      }

    }, 300));

    // Search lost focus
    $("#search").blur(_.debounce(function(e) {
      $(elem).find("#search_results").hide();
    }, 300));
  }

  Searchbar.hide = function() {
    $(elem).find("#search").hide();
  }

  Searchbar.onSelect = function(cb) {
    on_select_callbacks.push(cb);
  }

  Searchbar.onHighlight = function(cb) {
    on_highlight_callbacks.push(cb);
  }

})(Searchbar);
