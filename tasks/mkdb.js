var nano = require('nano');

try {
  var db_url = require('../config').db;
} catch (e) {
  console.log('Please run `npm run-script config` first');
}

if (db_url) {
  var sep = db_url.lastIndexOf('/');
  var host_name = db_url.slice(0, sep);
  var db_name = db_url.slice(sep + 1);
  var db = nano(host_name);

  db.db.create(db_name, function (err) {
    if (err && err.status_code !== 412) {
      console.log(err)
    };
  });  
}
