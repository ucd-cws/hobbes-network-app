'use strict';

var path = require('path');

module.exports = function(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-vulcanize');

	var src = path.join(grunt.option('srcRoot'), 'public');
	var dist = path.join(grunt.option('projectRoot'), 'dist');

	var files = {};
	files[path.join(dist, 'require.html')] = path.join(src,'require.html');
	files[path.join(dist, 'elements.html')] = [path.join(grunt.option('projectRoot'), 'public', 'elements.html')];

console.log(files);

	// Options
	return {
    default: {
      options: {
        inlineCss : true,
				inlineScripts : true
      },
      files: files
    }
  };
};
