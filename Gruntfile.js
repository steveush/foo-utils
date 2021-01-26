module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json'),
		// Browsers you care about for autoprefixing. Browserlist https://github.com/ai/browserslist
		// The following list is set as per WordPress requirements. Though, Feel free to change.
		BROWSERS_LIST = [
			'last 2 version',
			'> 1%',
			'ie >= 11',
			'last 1 Android versions',
			'last 1 ChromeAndroid versions',
			'last 2 Chrome versions',
			'last 2 Firefox versions',
			'last 2 Safari versions',
			'last 2 iOS versions',
			'last 2 Edge versions',
			'last 2 Opera versions'
		];

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
				files: {
					"./dist/foo-utils.pre-babel.js": [
						"./src/__utils.js",
						"./src/is.js",
						"./src/fn.js",
						"./src/url.js",
						"./src/str.js",
						"./src/obj.js",
						"./src/_utils.js",
						"./src/Class.js",
						"./src/ClassRegistry.js",
						"./src/EventClass.js",
						"./src/Timer.js",
						"./src/fullscreen.js",
						"./src/transition.js"
					],
					"./dist/foo-utils.core.pre-babel.js": [
						"./src/__utils.js",
						"./src/is.js",
						"./src/fn.js",
						"./src/url.js",
						"./src/str.js",
						"./src/obj.js",
						"./src/_utils.js"
					],
					"./dist/foo-utils.classes.pre-babel.js": [
						"./src/Class.js",
						"./src/ClassRegistry.js",
						"./src/EventClass.js"
					],
					"./dist/foo-utils.timer.pre-babel.js": [
						"./src/Timer.js"
					],
					"./dist/foo-utils.fullscreen.pre-babel.js": [
						"./src/fullscreen.js"
					],
					"./dist/foo-utils.transition.pre-babel.js": [
						"./src/transition.js"
					]
				}
			}
		},
		babel: {
			options: {
				presets: [
					[
						'@babel/preset-env', // Preset to compile your modern JS to ES5.
						{
							targets: {browsers: BROWSERS_LIST} // Target browser list to support.
						}
					]
				],
				ignore: ["./src/polyfills"]
			},
			dist: {
				files: {
					"./dist/foo-utils.js": "./dist/foo-utils.pre-babel.js",
					"./dist/foo-utils.core.js": "./dist/foo-utils.core.pre-babel.js",
					"./dist/foo-utils.classes.js": "./dist/foo-utils.classes.pre-babel.js",
					"./dist/foo-utils.timer.js": "./dist/foo-utils.timer.pre-babel.js",
					"./dist/foo-utils.fullscreen.js": "./dist/foo-utils.fullscreen.pre-babel.js",
					"./dist/foo-utils.transition.js": "./dist/foo-utils.transition.pre-babel.js"
				}
			}
		},
		uglify: {
			dist: {
				options: {
					preserveComments: false,
					banner: "<%= foo.banner %>"
				},
				files: {
					"./dist/foo-utils.min.js": "./dist/foo-utils.js",
					"./dist/foo-utils.core.min.js": "./dist/foo-utils.core.js",
					"./dist/foo-utils.classes.min.js": "./dist/foo-utils.classes.js",
					"./dist/foo-utils.timer.min.js": "./dist/foo-utils.timer.js",
					"./dist/foo-utils.fullscreen.min.js": "./dist/foo-utils.fullscreen.js",
					"./dist/foo-utils.transition.min.js": "./dist/foo-utils.transition.js"
				}
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
				puppeteer: {
					headless: true,
					args: [
						"--disable-web-security",
						"--allow-file-access-from-files"
					]
				},
				timeout: 30000
			},
			all: ['tests/*.html']
		}
	});
	// Actually load this packages task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', ['clean:dist','concat','babel','uglify']);
	grunt.registerTask('test', ['clean:foo-utils','foo-utils','qunit','clean:foo-utils']);
	grunt.registerTask('document', ['clean:docs','jsdoc']);

};