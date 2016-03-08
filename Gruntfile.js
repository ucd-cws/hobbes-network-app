'use strict';


module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').join(grunt.option('srcRoot'), 'tasks')
    });

    // Register group tasks
    grunt.registerTask('build', [
      'clean:build',
      'copy:build',
      'vulcanize']
    );
};
