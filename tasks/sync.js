var quilter = require('quilter');

try {
  var config = require('../config');
} catch (e) {
  console.log('Please run `npm run config` first');
}

if (config) {
  quilter.push({
    local: config.src,
    remote: config.db
  }, function () {});
}