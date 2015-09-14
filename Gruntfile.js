var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
      },
      dev: [ 'Gruntfile.js', './server/*.js', './server/**/*.js', './test/**/*.js' ],
      production: [ 'Gruntfile.js', './server/*.js', 'server/**/*.js', './public/**/*.js' ],
    },

    bower: {
      dev: {
        options: {
          targetDir: './test/',
          production: false,
          verbose: true,
          layout: function(type, component, source) {
            if (fs.lstatSync(source).isDirectory()) { return source; }

            return path.parse(source).dir;
          }
        },
      },
      production: {
        options: {
          targetDir: './public/',
          production: true,
          layout: function(type, component, source) {
            if (fs.lstatSync(source).isDirectory()) { return source; }

            return path.parse(source).dir;
          }
        },
      },
    },

    injector: {
      options: {
        //addRootSlash: false,
        bowerPrefix: 'bower:',
      },
      dev: {
        options: {
          destFile : 'test/index.html',
          ignorePath : [ 'test' ],
        },
        files: [ {
          expand: true,
          cwd: 'test/',
          dest: 'test/',
          src: [ '../bower.json', 'app/*.js', 'app/**/*.js', '**/*.css',
          '!app/fiddioRecorder/recorderWorkerMP3.js',
          '!app/fiddioRecorder/Mp3LameEncoder.js' ],
        }, ],
      },
      production: {
        options: {
          destFile : 'public/index.html',
          ignorePath : [ 'public/' ],
        },
        files: [ {
          expand: true,
          cwd: 'public/',
          dest: 'public/',
          src: [ '../bower.json', 'app/*.js', 'app/**/*.js', '**/*.css',
          '!app/fiddioRecorder/recorderWorkerMP3.js',
          '!app/fiddioRecorder/Mp3LameEncoder.js' ],
        }, ],
      },
    },

    watch: {
      options: {
        reload: true
      },
      dev: {
        options: { livereload: true },
        files:  [ 'server/*.js', 'server/**/*.js', 'client/**' ],
        tasks:  [ 'dev_build', 'forever:fiddio:restart' ]
      },
      production: {
        files:  [ '*.js', 'server/*.js', 'server/**/*.js', 'client/**' ],
        tasks:  [ 'prod_build', 'forever:fiddio:restart' ]
      }
    },

    clean: {
      dev: [ "test" ],
      production: [ "public" ]
    },

    copy: {
      dev: {
        files: [
          { expand: true,
            cwd: 'client/',
            src: ['**', '!**/*.scss'],
            dest: 'test/',
            filter: 'isFile'
          }
        ],
      },
      production: {
        files: [
          { expand: true,
            cwd: 'client/',
            src: ['**', '!**/*.scss'],
            dest: 'public/',
            filter: 'isFile'
          }
        ],
      },
    },

  sass: {
    dev: {
      files: [{
        expand: true,
        cwd: 'lib/',
        src: ['*.scss'],
        dest: 'test/',
        ext: '.css'
      }, {
        expand: true,
        cwd: 'client/',
        src: ['**/*.scss'],
        dest: 'test/',
        ext: '.css'
      }],
    },
    production: {
      files: [{
        expand: true,
        cwd: 'lib/',
        src: ['*.scss'],
        dest: 'public/',
        ext: '.css'
      }, {
        expand: true,
        cwd: 'client/',
        src: ['**/*.scss'],
        dest: 'public/',
        ext: '.css'
      }],
    },
  },

  forever: {
    fiddio: {
      options: {
        index: 'server/server.js',
        logDir: 'logs',
        logFile: 'logs.log'
      }
    }
  }

  });

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-forever');

  grunt.registerTask('default', [ 'dev' ]);
  grunt.registerTask('restart', [ 'restart:dev' ]);
  grunt.registerTask('start', [ 'forever:fiddio:start' ]);
  grunt.registerTask('stop', [ 'forever:fiddio:stop' ]);

  grunt.registerTask('dev_build', [ 'clean:dev', 'copy:dev', 'jshint:dev', 'bower:dev', 'sass:dev', 'injector:dev' ]);
  grunt.registerTask('dev', [ 'dev_build', 'forever:fiddio:start', 'watch:dev' ]);
  grunt.registerTask('restart:dev', [ 'dev_build', 'forever:fiddio:restart', 'watch:dev' ]);

  grunt.registerTask('prod_build', [ 'clean:production', 'copy:production', 'jshint:production', 'bower:production', 'sass:production', 'injector:production' ]);
  grunt.registerTask('prod', [ 'prod_build', 'forever:fiddio:start' ]);
  grunt.registerTask('restart:prod', [ 'prod_build', 'forever:fiddio:restart' ]);
};
