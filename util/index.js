var path = require('path');

// parse image content type from file extension
exports.contentType = function contentType (filename){
  var match = filename.match(/\.(jpg|jpeg|png|gif)$/i);
  if (match) {
    var ext = match[1];
    switch(ext){
      case 'jpg':
        ext = 'jpeg';
        break;
    }
    return 'image/' + ext;
  } else {
    // console.log('Skipped processing', filename);
  }
}

// '~' -> HOME
exports.resolvePath = function resolvePath (string) {
  if (string.substr(0,1) === '~') {
    string = process.env.HOME + string.substr(1);
  }
  return path.resolve(string);
}