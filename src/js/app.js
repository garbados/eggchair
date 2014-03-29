function eggchair (config) {
  var pathRoot = (location.pathname.indexOf('_rewrite') === -1) ? '' : '_rewrite';
  var apiRoot = pathRoot;
  var imgRoot = pathRoot ? pathRoot + '/img' : 'img';
  var header = config.header;

  function load_images (search, done) {
    var url = apiRoot + '/_list/groupchunk/images';
    search = search || location.search;
    $.getJSON(url + search, done);
  }

  function render_templates (groups) {
    // render header
    var header_template = Handlebars.templates.title(header);
    $('#title').html(header_template);

    // render images
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

  load_images(null, render_templates);
}

$(eggchair.bind(null, {
  header: header || {}
}));