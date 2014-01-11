var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/app',
  rewrites: require('./rewrites.json'),
  views: {
    images: {
      map: function (doc) {
        if (doc._id.indexOf('_design') === 0) {
          // ignore
        } else if (doc._attachments.file.content_type.indexOf('image') === 0) {
          var date = new Date(doc.timestamp),
              year = date.getFullYear(),
              month = date.getMonth();
          emit(doc.timestamp, null);
        }
      }
    }
  },
  lists: {},
  shows: {}
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;