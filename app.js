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
    },
    dates: {
      map: function (doc) {
        if (doc.timestamp) {
          var date = new Date(doc.timestamp);

          // give a timestamp for the dawn of the next month
          var group_date;
          if (date.getMonth() !== 11) {
            group_date = new Date(date.getFullYear(), date.getMonth() + 1);
          } else {
            group_date = new Date(date.getFullYear() + 1, 0);
          }

          emit(group_date.getTime() - 1, null);
        }
      },
      reduce: '_count'
    }
  },
  lists: {
    groupchunk: function (head, req) {
      var chunkSize = req.query.chunkSize || 5;

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
          
          var date;
          var year = parseInt(date_parts[0]);
          var month = parseInt(date_parts[1]);
          if (date_parts[1] !== 11) {
            date = new Date(year, month + 1);
          } else {
            date = new Date(year + 1, 0);
          }
          
          var images = groups[key].map(function (image) {
            return image.url;
          });
          
          groups_sorted.push({
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

      var groups = group_by_date(images);
      send(JSON.stringify(groups));
    }
  },
  shows: {},
  rewrites: require('./rewrites.json')
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;