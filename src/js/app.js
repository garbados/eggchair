function eggchair (config) {
  var pathRoot = (location.pathname.indexOf('_rewrite') === -1) ? '' : '_rewrite';
  var apiRoot = pathRoot;
  var imgRoot = pathRoot ? pathRoot + '/img' : 'img';
  var header = config.header;

  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  Handlebars.registerHelper('date', function (options) {
    var date;
    if (this.timestamp) {
      date = new Date(this.timestamp - 1);
    } else {
      date = new Date(this);  
    }
    
    return months[date.getMonth()] + ', ' + date.getFullYear();
  });

  function load_images (search, done) {
    var url = apiRoot + '/_list/groupchunk/images';
    search = search || location.search;
    $.getJSON(url + search, done);
  }

  function load_dates (done) {
    var url = apiRoot + '/_view/dates?group=true&descending=true';
    $.getJSON(url, function (json) {
      var results = json.rows.map(function (row) {
        return row.key;
      });
      done(results);
    });
  }

  function render_header () {
    var header_template = Handlebars.templates.title(header);
    $('#title').html(header_template);
  }

  function render_nav (dates) {
    var nav_template = Handlebars.templates.nav(dates);
    $('#nav').html(nav_template);
  }

  function render_images (groups) {
    var page = 0;
    var padding = 200;

    function next_page () {
      var group = groups[page];
      if (group) {
        group.imgRoot = imgRoot;
        var groups_template = Handlebars.templates.list(group);
        $('#images').append(groups_template);
        page += 1; 
      }
    }

    next_page();
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() >= $(document).height() - padding) {
        next_page();
      }
    });
  }

  return function () {
    render_header();
    load_images(null, render_images);
    load_dates(render_nav);
  };
}

var main = eggchair({
  header: header || {}
});
$(main);