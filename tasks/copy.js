

'use strict';

var path = require('path');

module.exports = function copyto(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-copy');

    var src = path.join(grunt.option('srcRoot'), 'public');
    var dist = path.join(grunt.option('projectRoot'), 'dist');

    // Options
    return {
        build: {
          files: [{
            expand: true,
            cwd: src,
            src: ['index.html','webcomponents.js'],
            dest: dist
          },{
            expand: true,
            cwd: path.join(src, 'bower_components','font-awesome'),
            src: ['fonts/**/*'],
            dest: dist
          }]
        }
    };
};
