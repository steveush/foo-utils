"use strict";

module.exports = function (grunt) {

	grunt.registerTask("foo-utils", "Creates a namespaced version of FooUtils for embedding into other packages.", function(){

		var path = require('path');
		var src = process.cwd().split(path.sep).pop() === "foo-utils" ? "./dist/foo-utils.js" : "./node_modules/foo-utils/dist/foo-utils.js";

		var options = this.options({
			namespace: null,
			src: src,
			dest: null
		});

		if (options.namespace === null){
			grunt.fail.warn('Required config property "namespace" missing.');
		}

		if (options.dest === null){
			grunt.fail.warn('Required config property "dest" missing.');
		}

		grunt.config.set(['clean','foo-utils'], options.dest);

		grunt.config.set(['copy','foo-utils'], {
			src: options.src,
			dest: options.dest,
			options: {
				process: function (content, srcpath) {
					return content.replace(/FooUtils/g, options.namespace);
				}
			}
		});

		grunt.task.run(['clean:foo-utils', 'copy:foo-utils']);

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

};