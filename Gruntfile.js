module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,
		foo: {
			banner: '/*!\n' +
			'* <%= pkg.title %> - <%= pkg.description %>\n' +
			'* @version <%= pkg.version %>\n' +
			'* @link <%= pkg.homepage %>\n' +
			'* @copyright <%= pkg.author.name %> <%= grunt.template.today("yyyy") %>\n' +
			'* @license Released under the <%= pkg.license %> license.\n' +
			'*/\n'
		},
		clean: {
			dist: ['./dist'],
			docs: ['./docs'],
			"foo-utils": ['./tests/my-api-utils.js']
		},
		concat: {
			dist: {
				options: {
					banner: "<%= foo.banner %>",
					process: function(content){
						return content.replace(/@@version/g, pkg.version);
					}
				},
				src: [
					"./src/__utils.js",
					"./src/is.js",
					"./src/fn.js",
					"./src/url.js",
					"./src/str.js",
					"./src/obj.js",
					"./src/_utils.js",
					"./src/transition.js",
					"./src/Class.js",
					"./src/Bounds.js",
					"./src/Factory.js",
					"./src/Debugger.js",
					"./src/Throttle.js"
				],
				dest: "./dist/foo-utils.js"
			}
		},
		uglify: {
			dist: {
				options: {
					preserveComments: false,
					banner: "<%= foo.banner %>"
				},
				src: "./dist/foo-utils.js",
				dest: "./dist/foo-utils.min.js"
			}
		},
		"foo-utils": {
			options: {
				namespace: "MyApi.utils",
				dest: "./tests/my-api-utils.js"
			}
		},
		jsdoc: {
			"src": ["./readme.md","./src/*.js"],
			"options": {
				"destination": "./docs",
				"recurse": true,
				"configure": "jsdoc.json",
				"template": "./node_modules/foodoc/template"
			}
		},
		qunit: {
			options : {
				'--web-security': false,
				'--local-to-remote-url-access': true
			},
			all: ['tests/*.html']
		}
	});
	// Actually load this packages task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', ['clean:dist','concat','uglify']);
	grunt.registerTask('test', ['clean:foo-utils','foo-utils','qunit','clean:foo-utils']);
	grunt.registerTask('document', ['clean:docs','jsdoc']);

};