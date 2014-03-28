function eggchair (config) {
  var pathRoot = (location.pathname.indexOf('_rewrite') === -1) ? '' : '_rewrite';
  var apiRoot = pathRoot;
  var imgRoot = pathRoot ? pathRoot + '/img' : 'img';
  var header = config.header;

  function load_images (done) {
    var url = [apiRoot, '_list', 'groupchunk', 'images'].join('/');
    $.getJSON(url + location.search, done);
  }

  function render_templates (groups) {
    var header_template = Handlebars.templates.title(header);
    $('#title').html(header_template);

    var groups_template = Handlebars.templates.list({ 
      groups: groups,
      imgRoot: imgRoot
    });

    $('#images').html(groups_template);
  }

  load_images(render_templates);
}

$(eggchair.bind(null, {
  header: header || {}
}));