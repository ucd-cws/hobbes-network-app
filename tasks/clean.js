'use strict';

var path = require('path');

module.exports = function clean(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Options
    return {
        build: path.join(grunt.option('projectRoot'), 'dist')
    };
};
