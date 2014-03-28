var fs = require('fs');

try {
  var config = require('../config');
} catch (e) {
  console.log('Please run `npm run-script config` first');
}

if (config) {
  delete config.db;
  delete config.src;

  fs.writeFile('attachments/js/title.js', 'var header = ' + JSON.stringify(config) + ';');
}