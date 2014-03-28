function eggchair (config) {
  var pathRoot = (location.pathname.indexOf('_rewrite') === -1) ? '' : '_rewrite';
  var apiRoot = pathRoot;
  var imgRoot = pathRoot ? pathRoot + '/img' : 'img';
  var chunkSize = 4;
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

  function format_res (res) {
    return res.rows.map(function (row) {
      return {
        url: [imgRoot, row.id].join('/'),
        date: new Date(row.key)
      };
    });
  }

  function chunk (items){
    var R = [],
        rem;
    for (var i = 0; i < items.length; i++) {
      rem = i % chunkSize;
      if (R[rem]) {
        R[rem].push(items[i]);
      } else {
        R[rem] = [items[i]];
      }
    }
    return R;
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
      var images = groups[key].map(function (image) {
        return image.url;
      });
      
      groups_sorted.push({
        date: [months[date_parts[1]], date_parts[0]].join(', '),
        timestamp: date.getTime(),
        chunks: chunk(images).map(function (image_chunk) {
          return {
            images: image_chunk
          };
        })
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

  function render_templates (groups) {
    load_images(function (groups) {
      var header_template = Handlebars.templates.title(header);
      $('#title').html(header_template);

      var groups_template = Handlebars.templates.list({ groups: groups });
      $('#images').html(groups_template);
    });
  }

  load_images(render_templates);
}

$(eggchair.bind(null, {
  header: header
}));