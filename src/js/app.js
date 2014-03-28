function eggchair () {
  var apiRoot = '_rewrite';
  var imgRoot = '_rewrite/img';

  function format_res (res) {
    return res.rows.map(function (row) {
      return {
        url: [imgRoot, row.id].join('/'),
        date: new Date(row.key)
      };
    });
  }

  function group_by_date (images) {
    var groups = {};

    images.forEach(function (image) {
      var date = [image.date.getFullYear(), image.date.getMonth()].join('/');

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(image);
    });

    var groups_sorted = [];

    Object.keys(groups).forEach(function (key) {
      var date_parts = key.split('/');
      var date = new Date(date_parts[0], date_parts[1]);
      
      groups_sorted.push({
        date: date,
        timestamp: date.getTime(),
        images: groups[key]
      });
    });

    groups_sorted.sort(function (a, b) {
      return b.timestamp - a.timestamp;
    });

    return groups_sorted;
  }

  function load_images (done) {
    var url = [apiRoot, '_view', 'images'].join('/');
    $.getJSON(url, {
      descending: true
    }, function (res) {
      var images = format_res(res);
      var groups = group_by_date(images);

      done(groups);
    });
  }

  function render_templates (header, groups) {
    load_images(function (groups) {
      var header_template = Handlebars.templates['title.hbs'](header);
      $('#title').html(header_template);

      var groups_template = Handlebars.templates['list.hbs']({ groups: groups });
      $('#images').html(groups_template);
    });
  }

  load_images(render_templates.bind(null, {
    title: 'eggchair'
  }));
}

$(eggchair);