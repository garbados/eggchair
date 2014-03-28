var couchapp = require('couchapp');
var app = require('../app');

try {
  var config = require('../config');
  var dest = config.db;
} catch (e) {
  console.log('Please run `npm run-script config` first');
}

if (dest) {
  couchapp.createApp(app, dest, function (app) {
    app.push();
  });
}