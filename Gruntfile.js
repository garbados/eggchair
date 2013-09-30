var config = require('./config.json'),
    path = require('path');

// '~' -> HOME
function resolvePath (string) {
  if (string.substr(0,1) === '~') {
    string = process.env.HOME + string.substr(1);
  }
  return path.resolve(string);
}

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/js/app.js', 'get_imgs.js', 'Gruntfile.js', 'app.js'],
      options: {}
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate, in order
        src: [
          'src/js/components/angular/angular.min.js',
          'src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: 'attachments/js/app.js'
      }
    },
    uglify: {
      options: {},
      build: {
        files: {
          'attachments/js/app.min.js': ['attachments/js/app.js']
        }
      }
    },
    cssmin: {
      minify: {
        files: {
          'attachments/css/style.css': ['src/css/*.css']
        }
      }
    },
    mkcouchdb: {
      app: config.couchapp
    },
    copy: {
      app: {
        files: [{
          expand: true,
          cwd: resolvePath('~/Pictures'),
          src: ['*'],
          dest: process.cwd() + '/img/'
        }]
      }
    },
    img: {
      app: {
        src: 'img',
      }
    },
    sync: {
      app: {
        min_src: 'img',
        src: resolvePath('~/Pictures'),
        db: config.couchapp.db
      }
    },
    couchapp: {
      app: config.couchapp
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // sync images from config.img_dir
  grunt.loadTasks('./tasks');

  // Default task(s).
  grunt.registerTask('default', [
    'build',
    'deploy'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin',
    'copy',
    'img'
  ]);

  grunt.registerTask('deploy', [
    'mkcouchdb',
    'couchapp',
    'sync'
  ]);

};