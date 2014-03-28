var fs = require('fs');
var prompt = require('prompt');

var schema = {
  properties: {
    db: {
      message: "URL for your CouchDB / Cloudant database",
      default: "http://localhost:5984/eggchair",
      required: true
    },
    src: {
      message: "Path to your image folder",
      default: "~/Pictures",
      required: true
    }
  }
};

prompt.start();

prompt.get(schema, function (err, result) {
  var config = JSON.stringify(result, undefined, 2);
  fs.writeFile('config.json', config, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Config written:');
      console.log(config.replace(/(?:\/\/).*?:.*?@/g, '*****'));
    }
  });
});