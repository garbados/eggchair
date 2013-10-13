var config = require('./config'),
    path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      couchapp: {
        db: config.db,
        app: "app.js",
        options: {
          okay_if_exists: true,
          okay_if_missing: true
        }
      }
    },
    jshint: {
      files: ['src/js/app.js', 'Gruntfile.js', 'app.js'],
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
      app: '<%= config.couchapp %>'
    },
    couchapp: {
      app: '<%= config.couchapp %>'
    },
    watch: {
      src: {
        files: ['src/js/*.js', 'src/css/*.css'],
        tasks: ['build', 'deploy']
      },
      html: {
        files: ['attachments/*.html'],
        tasks: ['deploy']
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Default task(s).
  grunt.registerTask('default', [
    'build',
    'deploy'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('deploy', [
    'mkcouchdb',
    'couchapp'
  ]);

};