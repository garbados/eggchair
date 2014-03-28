var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/eggchair',
  views: {
    images: {
      map: function (doc) {
        if (doc._id.indexOf('_design') === 0) {
          // ignore
        } else if (doc._attachments.file.content_type.indexOf('image') === 0) {
          emit(-doc.timestamp, null);
        }
      }
    }
  },
  lists: {
    groupchunk: function (head, req) {
      var chunkSize = req.query.chunkSize || 4;
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

      function format_row (row) {
        return {
          url: row.id,
          date: new Date(-row.key)
        };
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

      var row = getRow();
      var images = [];
      while (row) {
        images.push(format_row(row));
        row = getRow();
      }

      images.reverse();
      var groups = group_by_date(images);
      send(JSON.stringify(groups));
    }
  },
  shows: {},
  rewrites: require('./rewrites.json')
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;