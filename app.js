var couchapp = require('couchapp'),
    path = require('path');

ddoc = {
  _id: '_design/eggchair',
  rewrites: require('./rewrites.json'),
  views: {
    timestamp: {
      map: function(doc) {
        if(doc.timestamp){
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