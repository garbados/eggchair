var fs = require('fs'),
    path = require('path'),
    nano = require('nano'),
    async = require('async'),
    util = require('../util');

function Uploader (config) {
  var db = nano(config.db),
      src = util.resolvePath(config.src),
      min_src = util.resolvePath(config.min_src);

  function getLocalTimestamps (done) {
    fs.readdir(src, function (err, files) {
      if (err) {
        done(err);
      } else {
        var results = {},
            files = files.filter(function (file) {
              return file[0] !== '.';
            });

        async.map(files, function (file, cb) {
          fs.stat(path.join(src, file), function (err, stats) {
            if (err) {
              cb(err);
            } else {
              results[file] = stats.mtime.getTime();
              cb();
            }
          });
        }, function (err) {
          done(err, results);
        });
      }
    });
  }

  function getRemoteTimestamps (done) {
    db.view('eggchair', 'timestamp', {
      include_docs: true
    }, function (err, res) {
      if (err) {
        done(err);
      } else {
        var results = {};

        res.rows.forEach(function (row) {
          results[row.id] = row;
        });

        done(null, results);
      }
    });
  }

  function getChangedImages (local, remote, done) {
    var changed = [];

    for (var file in local) {
      var to_change = {
        _id: file,
        timestamp: local[file]
      };

      if (remote[file]) {
        if (remote[file].key !== local[file]) {
          to_change._rev = remote[file].doc._rev
          changed.push(to_change); 
        }
      } else {
        changed.push(to_change);  
      }
    }

    changed = changed.filter(function (file) { return util.contentType(file._id); });

    async.map(changed, function (to_change, cb) {
      fs.readFile(path.join(min_src, to_change._id), function (err, buffer) {
        if (err) {
          cb(err);
        } else {
          to_change._attachments = {
            img: {
              content_type: util.contentType(to_change._id),
              data: buffer.toString('base64')
            },
            // small: {
            //   content_type: util.contentType(file),
            //   data: '...'
            // }
          };

          cb(null, to_change);
        }
      });
    }, done);
  }  

  function uploadLocalImages (files, cb) {
    files.forEach(function (file) {
      console.log('uploaded', file._id);
    });
    db.bulk({docs: files}, cb);
  }

  return function (done) {
    async.parallel(
      [
        getLocalTimestamps, 
        getRemoteTimestamps
      ], 
      function (err, results) {
        if (err) {
          throw new Error(err);
        } else {
          var local = results[0],
              remote = results[1];

          getChangedImages(local, remote, function (err, files) {
            if (err) {
              throw new Error(err);
            } else {
              uploadLocalImages(files, function (err) {
                if (err) {
                  throw new Error(err);
                } else {
                  done();
                }
              });
            }
          })
        }
      }
    );
  };
}

module.exports = function(grunt){
  grunt.registerMultiTask('sync', 'Sync local images with remote.', function(){
    var upload = Uploader(this.data),
        done = this.async();

    upload(done);
  });
}