var config = require('./config'),
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
    config: {
      couchapp: {
        db: config.db,
        app: "app.js",
        options: {
          okay_if_exists: true,
          okay_if_missing: true
        }
      },
      img: {
        src: resolvePath(config.img.src),
        dest: resolvePath(config.img.dest)
      }
    },
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
      app: '<%= config.couchapp %>'
    },
    copy: {
      app: {
        files: [{
          expand: true,
          cwd: '<%= config.img.src %>',
          src: ['*'],
          dest: '<%= config.img.dest %>'
        }]
      }
    },
    img: {
      app: {
        src: '<%= config.img.dest %>',
      }
    },
    sync: {
      app: {
        min_src: '<%= config.img.dest %>',
        src: '<%= config.img.src %>',
        db: '<%= config.couchapp.db %>'
      }
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
      },
      img: {
        files: '<%= config.img.src %>/*.{png|gif|jpg|jpeg}',
        tasks: ['images']
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // sync images from config.img_dir
  grunt.loadTasks('./tasks');

  // Default task(s).
  grunt.registerTask('default', [
    'build',
    'images',
    'deploy'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('images', [
    'mkcouchdb',
    'copy',
    'img',
    'sync'
  ]);

  grunt.registerTask('deploy', [
    'mkcouchdb',
    'couchapp'
  ]);

};