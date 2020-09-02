/*!
* FooUtils - Contains common utility methods and classes used in our plugins.
* @version 0.2.0
* @link https://github.com/steveush/foo-utils#readme
* @copyright Steve Usher 2020
* @license Released under the GPL-3.0 license.
*/
/**
 * @file This creates the global FooUtils namespace
 */
(function ($) {

	if (!$){
		console.warn('jQuery must be included in the page prior to the FooUtils library.');
		return;
	}

	function __exists(){
		try {
			return !!window.FooUtils; // does the namespace already exist?
		} catch(err) {
			return false;
		}
	}

	if (!__exists()){
		/**
		 * @summary This namespace contains common utility methods and code shared between our plugins.
		 * @global
		 * @namespace FooUtils
		 * @description This namespace relies on jQuery being included in the page prior to it being loaded.
		 */
		window.FooUtils = {
			/**
			 * @summary A reference to the jQuery object the library is registered with.
			 * @memberof FooUtils.
			 * @name $
			 * @type {jQuery}
			 * @description This is used internally for all jQuery operations to help work around issues where multiple jQuery libraries have been included in a single page.
			 * @example {@caption The following shows the issue when multiple jQuery's are included in a single page.}{@lang html}
			 * <script src="jquery-1.12.4.js"></script>
			 * <script src="my-plugin.js"></script>
			 * <script src="jquery-2.2.4.js"></script>
			 * <script>
			 * 	jQuery(function($){
			 * 		$(".selector").myPlugin(); // => This would throw a TypeError: $(...).myPlugin is not a function
			 * 	});
			 * </script>
			 * @example {@caption The reason the above throws an error is that the `$.fn.myPlugin` function is registered to the first instance of jQuery in the page however the instance used to create the ready callback and actually try to execute `$(...).myPlugin()` is the second. To resolve this issue ideally you would remove the second instance of jQuery however you can use the `FooUtils.$` member to ensure you are always working with the instance of jQuery the library was registered with.}{@lang html}
			 * <script src="jquery-1.12.4.js"></script>
			 * <script src="my-plugin.js"></script>
			 * <script src="jquery-2.2.4.js"></script>
			 * <script>
			 * 	FooUtils.$(function($){
			 * 		$(".selector").myPlugin(); // => It works!
			 * 	});
			 * </script>
			 */
			$: $,
			/**
			 * @summary The version of this library.
			 * @memberof FooUtils.
			 * @name version
			 * @type {string}
			 */
			version: '0.2.0'
		};
	}

	// at this point there will always be a FooUtils namespace registered to the global scope.

})(jQuery);
(function ($, _){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary Contains common type checking utility methods.
	 * @memberof FooUtils.
	 * @namespace is
	 */
	_.is = {};

	/**
	 * @summary Checks if the `value` is an array.
	 * @memberof FooUtils.is.
	 * @function array
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is an array.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.array( [] ) ); // => true
	 * console.log( _is.array( null ) ); // => false
	 * console.log( _is.array( 123 ) ); // => false
	 * console.log( _is.array( "" ) ); // => false
	 */
	_.is.array = function (value) {
		return '[object Array]' === Object.prototype.toString.call(value);
	};

	/**
	 * @summary Checks if the `value` is a boolean.
	 * @memberof FooUtils.is.
	 * @function boolean
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is a boolean.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.boolean( true ) ); // => true
	 * console.log( _is.boolean( false ) ); // => true
	 * console.log( _is.boolean( "true" ) ); // => false
	 * console.log( _is.boolean( "false" ) ); // => false
	 * console.log( _is.boolean( 1 ) ); // => false
	 * console.log( _is.boolean( 0 ) ); // => false
	 */
	_.is.boolean = function (value) {
		return '[object Boolean]' === Object.prototype.toString.call(value);
	};

	/**
	 * @summary Checks if the `value` is an element.
	 * @memberof FooUtils.is.
	 * @function element
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is an element.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is,
	 * 	// create an element to test
	 * 	el = document.createElement("span");
	 *
	 * console.log( _is.element( el ) ); // => true
	 * console.log( _is.element( $(el) ) ); // => false
	 * console.log( _is.element( null ) ); // => false
	 * console.log( _is.element( {} ) ); // => false
	 */
	_.is.element = function (value) {
		return typeof HTMLElement === 'object'
			? value instanceof HTMLElement
			: !!value && typeof value === 'object' && value.nodeType === 1 && typeof value.nodeName === 'string';
	};

	/**
	 * @summary Checks if the `value` is empty.
	 * @memberof FooUtils.is.
	 * @function empty
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is empty.
	 * @description The following values are considered to be empty by this method:
	 *
	 * <ul><!--
	 * --><li>`""`			- An empty string</li><!--
	 * --><li>`0`			- 0 as an integer</li><!--
	 * --><li>`0.0`		- 0 as a float</li><!--
	 * --><li>`[]`			- An empty array</li><!--
	 * --><li>`{}`			- An empty object</li><!--
	 * --><li>`$()`		- An empty jQuery object</li><!--
	 * --><li>`false`</li><!--
	 * --><li>`null`</li><!--
	 * --><li>`undefined`</li><!--
	 * --></ul>
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.empty( undefined ) ); // => true
	 * console.log( _is.empty( null ) ); // => true
	 * console.log( _is.empty( 0 ) ); // => true
	 * console.log( _is.empty( 0.0 ) ); // => true
	 * console.log( _is.empty( "" ) ); // => true
	 * console.log( _is.empty( [] ) ); // => true
	 * console.log( _is.empty( {} ) ); // => true
	 * console.log( _is.empty( 1 ) ); // => false
	 * console.log( _is.empty( 0.1 ) ); // => false
	 * console.log( _is.empty( "one" ) ); // => false
	 * console.log( _is.empty( ["one"] ) ); // => false
	 * console.log( _is.empty( { "name": "My Object" } ) ); // => false
	 */
	_.is.empty = function(value){
		if (_.is.undef(value) || value === null) return true;
		if (_.is.number(value) && value === 0) return true;
		if (_.is.boolean(value) && value === false) return true;
		if (_.is.string(value) && value.length === 0) return true;
		if (_.is.array(value) && value.length === 0) return true;
		if (_.is.jq(value) && value.length === 0) return true;
		if (_.is.hash(value)){
			for(var prop in value) {
				if(value.hasOwnProperty(prop))
					return false;
			}
			return true;
		}
		return false;
	};

	/**
	 * @summary Checks if the `value` is an error.
	 * @memberof FooUtils.is.
	 * @function error
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is an error.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is,
	 * 	// create some errors to test
	 * 	err1 = new Error("err1"),
	 * 	err2 = new SyntaxError("err2");
	 *
	 * console.log( _is.error( err1 ) ); // => true
	 * console.log( _is.error( err2 ) ); // => true
	 * console.log( _is.error( null ) ); // => false
	 * console.log( _is.error( 123 ) ); // => false
	 * console.log( _is.error( "" ) ); // => false
	 * console.log( _is.error( {} ) ); // => false
	 * console.log( _is.error( [] ) ); // => false
	 */
	_.is.error = function (value) {
		return '[object Error]' === Object.prototype.toString.call(value);
	};

	/**
	 * @summary Checks if the `value` is a function.
	 * @memberof FooUtils.is.
	 * @function fn
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is a function.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is,
	 * 	// create a function to test
	 * 	func = function(){};
	 *
	 * console.log( _is.fn( func ) ); // => true
	 * console.log( _is.fn( null ) ); // => false
	 * console.log( _is.fn( 123 ) ); // => false
	 * console.log( _is.fn( "" ) ); // => false
	 */
	_.is.fn = function (value) {
		return value === window.alert || '[object Function]' === Object.prototype.toString.call(value);
	};

	/**
	 * @summary Checks if the `value` is a hash.
	 * @memberof FooUtils.is.
	 * @function hash
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is a hash.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.hash( {"some": "prop"} ) ); // => true
	 * console.log( _is.hash( {} ) ); // => true
	 * console.log( _is.hash( window ) ); // => false
	 * console.log( _is.hash( document ) ); // => false
	 * console.log( _is.hash( "" ) ); // => false
	 * console.log( _is.hash( 123 ) ); // => false
	 */
	_.is.hash = function (value) {
		return _.is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
	};

	/**
	 * @summary Checks if the `value` is a jQuery object.
	 * @memberof FooUtils.is.
	 * @function jq
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is a jQuery object.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is,
	 * 	// create an element to test
	 * 	el = document.createElement("span");
	 *
	 * console.log( _is.jq( $(el) ) ); // => true
	 * console.log( _is.jq( $() ) ); // => true
	 * console.log( _is.jq( el ) ); // => false
	 * console.log( _is.jq( {} ) ); // => false
	 * console.log( _is.jq( null ) ); // => false
	 * console.log( _is.jq( 123 ) ); // => false
	 * console.log( _is.jq( "" ) ); // => false
	 */
	_.is.jq = function(value){
		return !_.is.undef($) && value instanceof $;
	};

	/**
	 * @summary Checks if the `value` is a number.
	 * @memberof FooUtils.is.
	 * @function number
	 * @param {*} value - The value to check.
	 * @returns {boolean}
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.number( 123 ) ); // => true
	 * console.log( _is.number( undefined ) ); // => false
	 * console.log( _is.number( null ) ); // => false
	 * console.log( _is.number( "" ) ); // => false
	 */
	_.is.number = function (value) {
		return '[object Number]' === Object.prototype.toString.call(value) && !isNaN(value);
	};

	/**
	 * @summary Checks if the `value` is an object.
	 * @memberof FooUtils.is.
	 * @function object
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the supplied `value` is an object.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.object( {"some": "prop"} ) ); // => true
	 * console.log( _is.object( {} ) ); // => true
	 * console.log( _is.object( window ) ); // => true
	 * console.log( _is.object( document ) ); // => true
	 * console.log( _is.object( undefined ) ); // => false
	 * console.log( _is.object( null ) ); // => false
	 * console.log( _is.object( "" ) ); // => false
	 * console.log( _is.object( 123 ) ); // => false
	 */
	_.is.object = function (value) {
		return '[object Object]' === Object.prototype.toString.call(value) && !_.is.undef(value) && value !== null;
	};

	/**
	 * @summary Checks if the `value` is a promise.
	 * @memberof FooUtils.is.
	 * @function promise
	 * @param {*} value - The object to check.
	 * @returns {boolean} `true` if the supplied `value` is an object.
	 * @description This is a simple check to determine if an object is a jQuery promise object. It simply checks the object has a `then` and `promise` function defined.
	 *
	 * The promise object is created as an object literal inside of `jQuery.Deferred`, it has no prototype, nor any other truly unique properties that could be used to distinguish it.
	 *
	 * This method should be a little more accurate than the internal jQuery one that simply checks for a `promise` function.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.promise( $.Deferred() ) ); // => true
	 * console.log( _is.promise( {} ) ); // => false
	 * console.log( _is.promise( undefined ) ); // => false
	 * console.log( _is.promise( null ) ); // => false
	 * console.log( _is.promise( "" ) ); // => false
	 * console.log( _is.promise( 123 ) ); // => false
	 */
	_.is.promise = function(value){
		return _.is.object(value) && _.is.fn(value.then) && _.is.fn(value.promise);
	};

	/**
	 * @summary Checks if the `value` is a valid CSS length.
	 * @memberof FooUtils.is.
	 * @function size
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the `value` is a number or CSS length.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.size( 80 ) ); // => true
	 * console.log( _is.size( "80px" ) ); // => true
	 * console.log( _is.size( "80em" ) ); // => true
	 * console.log( _is.size( "80%" ) ); // => true
	 * console.log( _is.size( {} ) ); // => false
	 * console.log( _is.size( undefined ) ); // => false
	 * console.log( _is.size( null ) ); // => false
	 * console.log( _is.size( "" ) ); // => false
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/length|&lt;length&gt; - CSS | MDN} for more information on CSS length values.
	 */
	_.is.size = function(value){
		if (!(_.is.string(value) && !_.is.empty(value)) && !_.is.number(value)) return false;
		return /^(auto|none|(?:[\d.]*)+?(?:%|px|mm|q|cm|in|pt|pc|em|ex|ch|rem|vh|vw|vmin|vmax)?)$/.test(value);
	};

	/**
	 * @summary Checks if the `value` is a string.
	 * @memberof FooUtils.is.
	 * @function string
	 * @param {*} value - The value to check.
	 * @returns {boolean} `true` if the `value` is a string.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.string( "" ) ); // => true
	 * console.log( _is.string( undefined ) ); // => false
	 * console.log( _is.string( null ) ); // => false
	 * console.log( _is.string( 123 ) ); // => false
	 */
	_.is.string = function (value) {
		return '[object String]' === Object.prototype.toString.call(value);
	};

	/**
	 * @summary Checks if the `value` is `undefined`.
	 * @memberof FooUtils.is.
	 * @function undef
	 * @param {*} value - The value to check is undefined.
	 * @returns {boolean} `true` if the supplied `value` is `undefined`.
	 * @example {@run true}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * console.log( _is.undef( undefined ) ); // => true
	 * console.log( _is.undef( null ) ); // => false
	 * console.log( _is.undef( 123 ) ); // => false
	 * console.log( _is.undef( "" ) ); // => false
	 */
	_.is.undef = function (value) {
		return typeof value === 'undefined';
	};

})(
	// dependencies
	FooUtils.$,
	FooUtils
);
(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @memberof FooUtils.
	 * @namespace fn
	 * @summary Contains common function utility methods.
	 */
	_.fn = {};

	var fnStr = Function.prototype.toString;

	/**
	 * @summary The regular expression to test if a function uses the `this._super` method applied by the {@link FooUtils.fn.add} method.
	 * @memberof FooUtils.fn.
	 * @name CONTAINS_SUPER
	 * @type {RegExp}
	 * @default /\b_super\b/
	 * @readonly
	 * @description When the script is first loaded into the page this performs a quick check to see if the browser supports function decompilation. If it does the regular expression is set to match the expected `_super`, however if  function decompilation is not supported, the regular expression is set to match anything effectively making the test always return `true`.
	 * @example {@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * // create some functions to test
	 * function testFn1(){}
	 * function testFn2(){
	 * 	this._super();
	 * }
	 *
	 * console.log( _fn.CONTAINS_SUPER.test( testFn1 ) ); // => false
	 * console.log( _fn.CONTAINS_SUPER.test( testFn2 ) ); // => true
	 *
	 * // NOTE: in browsers that don't support functional decompilation both tests will return `true`
	 */
	_.fn.CONTAINS_SUPER = /xyz/.test(fnStr.call(function(){
		//noinspection JSUnresolvedVariable,BadExpressionStatementJS
		xyz;
	})) ? /\b_super\b/ : /.*/;

	/**
	 * @summary Adds or overrides the given method `name` on the `proto` using the supplied `fn`.
	 * @memberof FooUtils.fn.
	 * @function addOrOverride
	 * @param {Object} proto - The prototype to add the method to.
	 * @param {string} name - The name of the method to add, if this already exists the original will be exposed within the scope of the supplied `fn` as `this._super`.
	 * @param {function} fn - The function to add to the prototype, if this is overriding an existing method you can use `this._super` to access the original within its' scope.
	 * @description If the new method overrides a pre-existing one, this function will expose the overridden method as `this._super` within the new methods scope.
	 *
	 * This replaces having to write out the following to override a method and call its original:
	 *
	 * ```javascript
	 * var original = MyClass.prototype.someMethod;
	 * MyClass.prototype.someMethod = function(arg1, arg2){
	 * 	// execute the original
	 * 	original.call(this, arg1, arg2);
	 * };
	 * ```
	 *
	 * With the following:
	 *
	 * ```javascript
	 * FooUtils.fn.addOrOverride( MyClass.prototype, "someMethod", function(arg1, arg2){
	 * 	// execute the original
	 * 	this._super(arg1, arg2);
	 * });
	 * ```
	 *
	 * This method is used by the {@link FooUtils.Class} to implement the inheritance of individual methods.
	 * @example {@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * var proto = {
	 * 	write: function( message ){
	 * 		console.log( "Original#write: " + message );
	 * 	}
	 * };
	 *
	 * proto.write( "My message" ); // => "Original#write: My message"
	 *
	 * _fn.addOrOverride( proto, "write", function( message ){
	 * 	message = "Override#write: " + message;
	 * 	this._super( message );
	 * } );
	 *
	 * proto.write( "My message" ); // => "Original#write: Override#write: My message"
	 */
	_.fn.addOrOverride = function(proto, name, fn){
		if (!_is.object(proto) || !_is.string(name) || _is.empty(name) || !_is.fn(fn)) return;
		var _super = proto[name],
			wrap = _is.fn(_super) && _.fn.CONTAINS_SUPER.test(fnStr.call(fn));
		// only wrap the function if it overrides a method and makes use of `_super` within it's body.
		proto[name] = wrap ?
			(function (_super, fn) {
				// create a new wrapped that exposes the original method as `_super`
				return function () {
					var tmp = this._super;
					this._super = _super;
					var ret = fn.apply(this, arguments);
					this._super = tmp;
					return ret;
				};
			})(_super, fn) : fn;
	};

	/**
	 * @summary Use the `Function.prototype.apply` method on a class constructor using the `new` keyword.
	 * @memberof FooUtils.fn.
	 * @function apply
	 * @param {Object} klass - The class to create.
	 * @param {Array} [args=[]] - The arguments to pass to the constructor.
	 * @returns {Object} The new instance of the `klass` created with the supplied `args`.
	 * @description When using the default `Function.prototype.apply` you can't use it on class constructors requiring the `new` keyword, this method allows us to do that.
	 * @example {@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * // create a class to test with
	 * function Test( name, value ){
	 * 	if ( !( this instanceof Test )){
	 * 		console.log( "Test instantiated without the `new` keyword." );
	 * 		return;
	 * 	}
	 * 	console.log( "Test: name = " + name + ", value = " + value );
	 * }
	 *
	 * Test.apply( Test, ["My name", "My value"] ); // => "Test instantiated without the `new` keyword."
	 * _fn.apply( Test, ["My name", "My value"] ); // => "Test: name = My name, value = My value"
	 */
	_.fn.apply = function(klass, args){
		args = _is.array(args) ? args : [];
		function Class() {
			return klass.apply(this, args);
		}
		Class.prototype = klass.prototype;
		return new Class();
	};

	/**
	 * @summary Converts the default `arguments` object into a proper array.
	 * @memberof FooUtils.fn.
	 * @function arg2arr
	 * @param {IArguments} args - The arguments object to create an array from.
	 * @returns {Array}
	 * @description This method is simply a replacement for calling `Array.prototype.slice.call()` to create an array from an `arguments` object.
	 * @example {@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * function callMe(){
	 * 	var args = _fn.arg2arr(arguments);
	 * 	console.log( arguments instanceof Array ); // => false
	 * 	console.log( args instanceof Array ); // => true
	 * 	console.log( args ); // => [ "arg1", "arg2" ]
	 * }
	 *
	 * callMe("arg1", "arg2");
	 */
	_.fn.arg2arr = function(args){
		return Array.prototype.slice.call(args);
	};

	/**
	 * @summary Debounces the `fn` by the supplied `time`.
	 * @memberof FooUtils.fn.
	 * @function debounce
	 * @param {function} fn - The function to debounce.
	 * @param {number} time - The time in milliseconds to delay execution.
	 * @returns {function}
	 * @description This returns a wrapped version of the `fn` which delays its' execution by the supplied `time`. Additional calls to the function will extend the delay until the `time` expires.
	 */
	_.fn.debounce = function (fn, time) {
		var timeout;
		return function () {
			var ctx = this, args = _.fn.arg2arr(arguments);
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				fn.apply(ctx, args);
			}, time);
		};
	};

	/**
	 * @summary Throttles the `fn` by the supplied `time`.
	 * @memberof FooUtils.fn.
	 * @function throttle
	 * @param {function} fn - The function to throttle.
	 * @param {number} time - The time in milliseconds to delay execution.
	 * @returns {function}
	 * @description This returns a wrapped version of the `fn` which ensures it's executed only once every `time` milliseconds. The first call to the function will be executed, after that only the last of any additional calls will be executed once the `time` expires.
	 */
	_.fn.throttle = function (fn, time) {
		var last, timeout;
		return function () {
			var ctx = this, args = _.fn.arg2arr(arguments);
			if (!last){
				fn.apply(ctx, args);
				last = Date.now();
			} else {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					if (Date.now() - last >= time) {
						fn.apply(ctx, args);
						last = Date.now();
					}
				}, time - (Date.now() - last));
			}
		}
	};

	/**
	 * @summary Checks the given `value` and ensures a function is returned.
	 * @memberof FooUtils.fn.
	 * @function check
	 * @param {?Object} thisArg=window - The `this` keyword within the returned function, if the supplied value is not an object this defaults to the `window`.
	 * @param {*} value - The value to check, if not a function or the name of one then the `def` value is automatically returned.
	 * @param {function} [def=jQuery.noop] - A default function to use if the `value` is not resolved to a function.
	 * @param {Object} [ctx=window] - If the `value` is a string this is supplied to the {@link FooUtils.fn.fetch} method as the content to retrieve the function from.
	 * @returns {function} A function that ensures the correct context is applied when executed.
	 * @description This function is primarily used to check the value of a callback option that could be supplied as either a function or a string.
	 *
	 * When just the function name is supplied this method uses the {@link FooUtils.fn.fetch} method to resolve and wrap it to ensure when it's called the correct context is applied.
	 *
	 * Being able to resolve a function from a name allows callbacks to be easily set even through data attributes as you can just supply the full function name as a string and then use this method to retrieve the actual function.
	 * @example {@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * // a simple `api` with a `sendMessage` function
	 * window.api = {
	 * 	sendMessage: function(){
	 * 		this.write( "window.api.sendMessage" );
	 * 	},
	 * 	child: {
	 * 		api: {
	 * 			sendMessage: function(){
	 * 				this.write( "window.api.child.api.sendMessage" );
	 * 			}
	 * 		}
	 * 	}
	 * };
	 *
	 * // a default function to use in case the check fails
	 * var def = function(){
	 * 	this.write( "default" );
	 * };
	 *
	 * // an object to use as the `this` object within the scope of the checked functions
	 * var thisArg = {
	 * 	write: function( message ){
	 * 		console.log( message );
	 * 	}
	 * };
	 *
	 * // check the value and return a wrapped function ensuring the correct context.
	 * var fn = _fn.check( thisArg, null, def );
	 * fn(); // => "default"
	 *
	 * fn = _fn.check( thisArg, "api.doesNotExist", def );
	 * fn(); // => "default"
	 *
	 * fn = _fn.check( thisArg, api.sendMessage, def );
	 * fn(); // => "window.api.sendMessage"
	 *
	 * fn = _fn.check( thisArg, "api.sendMessage", def );
	 * fn(); // => "window.api.sendMessage"
	 *
	 * fn = _fn.check( thisArg, "api.sendMessage", def, window.api.child );
	 * fn(); // => "window.api.child.api.sendMessage"
	 */
	_.fn.check = function(thisArg, value, def, ctx){
		def = _is.fn(def) ? def : $.noop;
		thisArg = _is.object(thisArg) ? thisArg : window;
		function wrap(fn){
			return function(){
				return fn.apply(thisArg, arguments);
			};
		}
		value = _is.string(value) ? _.fn.fetch(value, ctx) : value;
		return _is.fn(value) ? wrap(value) : wrap(def);
	};

	/**
	 * @summary Fetches a function given its `name`.
	 * @memberof FooUtils.fn.
	 * @function fetch
	 * @param {string} name - The name of the function to fetch. This can be a `.` notated name.
	 * @param {Object} [ctx=window] - The context to retrieve the function from, defaults to the `window` object.
	 * @returns {?function} `null` if a function with the given name is not found within the context.
	 * @example {@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * // create a dummy `api` with a `sendMessage` function to test
	 * window.api = {
	 * 	sendMessage: function( message ){
	 * 		console.log( "api.sendMessage: " + message );
	 * 	}
	 * };
	 *
	 * // the below shows 3 different ways to fetch the `sendMessage` function
	 * var send1 = _fn.fetch( "api.sendMessage" );
	 * var send2 = _fn.fetch( "api.sendMessage", window );
	 * var send3 = _fn.fetch( "sendMessage", window.api );
	 *
	 * // all the retrieved methods should be the same
	 * console.log( send1 === send2 && send2 === send3 ); // => true
	 *
	 * // check if the function was found
	 * if ( send1 != null ){
	 * 	send1( "My message" ); // => "api.sendMessage: My message"
	 * }
	 */
	_.fn.fetch = function(name, ctx){
		if (!_is.string(name) || _is.empty(name)) return null;
		ctx = _is.object(ctx) ? ctx : window;
		$.each(name.split('.'), function(i, part){
			if (ctx[part]) ctx = ctx[part];
			else return false;
		});
		return _is.fn(ctx) ? ctx : null;
	};

	/**
	 * @summary Enqueues methods using the given `name` from all supplied `objects` and executes each in order with the given arguments.
	 * @memberof FooUtils.fn.
	 * @function enqueue
	 * @param {Array.<Object>} objects - The objects to call the method on.
	 * @param {string} name - The name of the method to execute.
	 * @param {*} [arg1] - The first argument to call the method with.
	 * @param {...*} [argN] - Any additional arguments for the method.
	 * @returns {Promise} If `resolved` the first argument supplied to any success callbacks is an array of all returned value(s). These values are encapsulated within their own array as if the method returned a promise it could be resolved with more than one argument.
	 *
	 * If `rejected` any fail callbacks are supplied the arguments the promise was rejected with plus an additional one appended by this method, an array of all objects that have already had their methods run. This allows you to perform rollback operations if required after a failure. The last object in this array would contain the method that raised the error.
	 * @description This method allows an array of `objects` that implement a common set of methods to be executed in a supplied order. Each method in the queue is only executed after the successful completion of the previous. Success is evaluated as the method did not throw an error and if it returned a promise it was resolved.
	 *
	 * An example of this being used within the plugin is the loading and execution of methods on the various components. Using this method ensures components are loaded and have their methods executed in a static order regardless of when they were registered with the plugin or if the method is async. This way if `ComponentB`'s `preinit` relies on properties set in `ComponentA`'s `preinit` method you can register `ComponentB` with a lower priority than `ComponentA` and you can be assured `ComponentA`'s `preinit` completed successfully before `ComponentB`'s `preinit` is called event if it performs an async operation.
	 * @example {@caption Shows a basic example of how you can use this method.}{@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * // create some dummy objects that implement the same members or methods.
	 * var obj1 = {
	 * 	"name": "obj1",
	 * 	"appendName": function(str){
	 * 		console.log( "Executing obj1.appendName..." );
	 * 		return str + this.name;
	 * 	}
	 * };
	 *
	 * // this objects `appendName` method returns a promise
	 * var obj2 = {
	 * 	"name": "obj2",
	 * 	"appendName": function(str){
	 * 		console.log( "Executing obj2.appendName..." );
	 * 		var self = this;
	 * 		return $.Deferred(function(def){
	 *			// use a setTimeout to delay execution
	 *			setTimeout(function(){
	 *					def.resolve(str + self.name);
	 *			}, 300);
	 * 		});
	 * 	}
	 * };
	 *
	 * // this objects `appendName` method is only executed once obj2's promise is resolved
	 * var obj3 = {
	 * 	"name": "obj3",
	 * 	"appendName": function(str){
	 * 		console.log( "Executing obj3.appendName..." );
	 * 		return str + this.name;
	 * 	}
	 * };
	 *
	 * _fn.enqueue( [obj1, obj2, obj3], "appendName", "modified_by:" ).then(function(results){
	 * 	console.log( results ); // => [ [ "modified_by:obj1" ], [ "modified_by:obj2" ], [ "modified_by:obj3" ] ]
	 * });
	 * @example {@caption If an error is thrown by one of the called methods or it returns a promise that is rejected, execution is halted and any fail callbacks are executed. The last argument is an array of objects that have had their methods run, the last object within this array is the one that raised the error.}{@run true}
	 * // alias the FooUtils.fn namespace
	 * var _fn = FooUtils.fn;
	 *
	 * // create some dummy objects that implement the same members or methods.
	 * var obj1 = {
	 * 	"name": "obj1",
	 * 	"last": null,
	 * 	"appendName": function(str){
	 * 		console.log( "Executing obj1.appendName..." );
	 * 		return this.last = str + this.name;
	 * 	},
	 * 	"rollback": function(){
	 * 		console.log( "Executing obj1.rollback..." );
	 * 		this.last = null;
	 * 	}
	 * };
	 *
	 * // this objects `appendName` method throws an error
	 * var obj2 = {
	 * 	"name": "obj2",
	 * 	"last": null,
	 * 	"appendName": function(str){
	 * 		console.log( "Executing obj2.appendName..." );
	 * 		//throw new Error("Oops, something broke.");
	 * 		var self = this;
	 * 		return $.Deferred(function(def){
	 *			// use a setTimeout to delay execution
	 *			setTimeout(function(){
	 *					self.last = str + self.name;
	 *					def.reject(Error("Oops, something broke."));
	 *			}, 300);
	 * 		});
	 * 	},
	 * 	"rollback": function(){
	 * 		console.log( "Executing obj2.rollback..." );
	 * 		this.last = null;
	 * 	}
	 * };
	 *
	 * // this objects `appendName` and `rollback` methods are never executed
	 * var obj3 = {
	 * 	"name": "obj3",
	 * 	"last": null,
	 * 	"appendName": function(str){
	 * 		console.log( "Executing obj3.appendName..." );
	 * 		return this.last = str + this.name;
	 * 	},
	 * 	"rollback": function(){
	 * 		console.log( "Executing obj3.rollback..." );
	 * 		this.last = null;
	 * 	}
	 * };
	 *
	 * _fn.enqueue( [obj1, obj2, obj3], "appendName", "modified_by:" ).fail(function(err, run){
	 * 	console.log( err.message ); // => "Oops, something broke."
	 * 	console.log( run ); // => [ {"name":"obj1","last":"modified_by:obj1"}, {"name":"obj2","last":"modified_by:obj2"} ]
	 * 	var guilty = run[run.length - 1];
	 * 	console.log( "Error thrown by: " + guilty.name ); // => "obj2"
	 * 	run.reverse(); // reverse execution when rolling back to avoid dependency issues
	 * 	return _fn.enqueue( run, "rollback" ).then(function(){
	 * 		console.log( "Error handled and rollback performed." );
	 * 		console.log( run ); // => [ {"name":"obj1","last":null}, {"name":"obj2","last":null} ]
	 * 	});
	 * });
	 */
	_.fn.enqueue = function(objects, name, arg1, argN){
		var args = _.fn.arg2arr(arguments), // get an array of all supplied arguments
			def = $.Deferred(), // the main deferred object for the function
			queue = $.Deferred(), // the deferred object to use as an queue
			promise = queue.promise(), // used to register component methods for execution
			results = [], // stores the results of each method to be returned by the main deferred
			run = [], // stores each object once its' method has been run
			first = true; // whether or not this is the first resolve callback

		// take the objects and name parameters out of the args array
		objects = args.shift();
		name = args.shift();

		// safely execute a function, catch any errors and reject the deferred if required.
		function safe(obj, method){
			try {
				run.push(obj);
				return method.apply(obj, args);
			} catch(err) {
				def.reject(err, run);
				return def;
			}
		}

		// loop through all the supplied objects
		$.each(objects, function(i, obj){
			// if the obj has a function with the supplied name
			if (_is.fn(obj[name])){
				// then register the method in the callback queue
				promise = promise.then(function(){
					// only register the result if this is not the first resolve callback, the first is triggered by this function kicking off the queue
					if (!first){
						var resolveArgs = _.fn.arg2arr(arguments);
						results.push(resolveArgs);
					}
					first = false;
					// execute the method and return it's result, if the result is a promise
					// the next method will only be executed once it's resolved
					return safe(obj, obj[name]);
				});
			}
		});

		// add one last callback to catch the final result
		promise.then(function(){
			// only register the result if this is not the first resolve callback
			if (!first){
				var resolveArgs = _.fn.arg2arr(arguments);
				results.push(resolveArgs);
			}
			first = false;
			// resolve the main deferred with the array of all the method results
			def.resolve(results);
		});

		// hook into failures and ensure the run array is appended to the args
		promise.fail(function(){
			var rejectArgs = _.fn.arg2arr(arguments);
			rejectArgs.push(run);
			def.reject.apply(def, rejectArgs);
		});

		// kick off the queue
		queue.resolve();

		return def.promise();
	};

	/**
	 * @summary Waits for the outcome of all promises regardless of failure and resolves supplying the results of just those that succeeded.
	 * @memberof FooUtils.fn.
	 * @function when
	 * @param {Promise[]} promises - The array of promises to wait for.
	 * @returns {Promise}
	 */
	_.fn.when = function(promises){
		if (!_is.array(promises) || _is.empty(promises)) return $.when();
		var d = $.Deferred(), results = [], remaining = promises.length;
		function reduceRemaining(){
			remaining--; // always mark as finished
			if(!remaining) d.resolve(results);
		}
		for(var i = 0; i < promises.length; i++){
			if (_is.promise(promises[i])){
				promises[i].then(function(res){
					results.push(res); // on success, add to results
				}).always(reduceRemaining);
			} else {
				reduceRemaining();
			}
		}
		return d.promise(); // return a promise on the remaining values
	};

	/**
	 * @summary Return a promise rejected using the supplied args.
	 * @memberof FooUtils.fn.
	 * @function rejectWith
	 * @param {*} [arg1] - The first argument to reject the promise with.
	 * @param {...*} [argN] - Any additional arguments to reject the promise with.
	 * @returns {Promise}
	 */
	_.fn.rejectWith = function(arg1, argN){
		var def = $.Deferred(), args = _.fn.arg2arr(arguments);
		return def.reject.apply(def, args).promise();
	};

	/**
	 * @summary Return a promise resolved using the supplied args.
	 * @memberof FooUtils.fn.
	 * @function resolveWith
	 * @param {*} [arg1] - The first argument to resolve the promise with.
	 * @param {...*} [argN] - Any additional arguments to resolve the promise with.
	 * @returns {Promise}
	 */
	_.fn.resolveWith = function(arg1, argN){
		var def = $.Deferred(), args = _.fn.arg2arr(arguments);
		return def.resolve.apply(def, args).promise();
	};

	/**
	 * @summary A resolved promise object.
	 * @memberof FooUtils.fn.
	 * @name resolved
	 * @type {Promise}
	 */
	_.fn.resolved = $.Deferred().resolve().promise();

	/**
	 * @summary A rejected promise object.
	 * @memberof FooUtils.fn.
	 * @name rejected
	 * @type {Promise}
	 */
	_.fn.rejected = $.Deferred().reject().promise();

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is
);
(function(_, _is){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary Contains common url utility methods.
	 * @memberof FooUtils.
	 * @namespace url
	 */
	_.url = {};

	// used for parsing a url into it's parts.
	var _a = document.createElement('a');

	/**
	 * @summary Parses the supplied url into an object containing it's component parts.
	 * @memberof FooUtils.url.
	 * @function parts
	 * @param {string} url - The url to parse.
	 * @returns {FooUtils.url~Parts}
	 * @example {@run true}
	 * // alias the FooUtils.url namespace
	 * var _url = FooUtils.url;
	 *
	 * console.log( _url.parts( "http://example.com/path/?param=true#something" ) ); // => {"hash":"#something", ...}
	 */
	_.url.parts = function(url){
		_a.href = url;
		var port = _a.port ? _a.port : (["http:","https:"].indexOf(_a.protocol) !== -1 ? (_a.protocol === "https:" ? "443" : "80") : ""),
			host = _a.hostname + (port ? ":" + port : ""),
			origin = _a.origin ? _a.origin : _a.protocol + "//" + host,
			pathname = _a.pathname.slice(0, 1) === "/" ? _a.pathname : "/" + _a.pathname;
		return {
			hash: _a.hash, host: host, hostname: _a.hostname, href: _a.href,
			origin: origin, pathname: pathname, port: port,
			protocol: _a.protocol, search: _a.search
		};
	};

	/**
	 * @summary Given a <code>url</code> that could be relative or full this ensures a full url is returned.
	 * @memberof FooUtils.url.
	 * @function full
	 * @param {string} url - The url to ensure is full.
	 * @returns {?string} `null` if the given `path` is not a string or empty.
	 * @description Given a full url this will simply return it however if given a relative url this will create a full url using the current location to fill in the blanks.
	 * @example {@run true}
	 * // alias the FooUtils.url namespace
	 * var _url = FooUtils.url;
	 *
	 * console.log( _url.full( "http://example.com/path/" ) ); // => "http://example.com/path/"
	 * console.log( _url.full( "/path/" ) ); // => "{protocol}//{host}/path/"
	 * console.log( _url.full( "path/" ) ); // => "{protocol}//{host}/{pathname}/path/"
	 * console.log( _url.full( "../path/" ) ); // => "{protocol}//{host}/{calculated pathname}/path/"
	 * console.log( _url.full() ); // => null
	 * console.log( _url.full( 123 ) ); // => null
	 */
	_.url.full = function(url){
		if (!_is.string(url) || _is.empty(url)) return null;
		_a.href = url;
		return _a.href;
	};

	/**
	 * @summary Gets or sets a parameter in the given <code>search</code> string.
	 * @memberof FooUtils.url.
	 * @function param
	 * @param {string} search - The search string to use (usually `location.search`).
	 * @param {string} key - The key of the parameter.
	 * @param {?string} [value] - The value to set for the parameter. If not provided the current value for the `key` is returned.
	 * @returns {?string} The value of the `key` in the given `search` string if no `value` is supplied or `null` if the `key` does not exist.
	 * @returns {string} A modified `search` string if a `value` is supplied.
	 * @example <caption>Shows how to retrieve a parameter value from a search string.</caption>{@run true}
	 * // alias the FooUtils.url namespace
	 * var _url = FooUtils.url,
	 * 	// create a search string to test
	 * 	search = "?wmode=opaque&autoplay=1";
	 *
	 * console.log( _url.param( search, "wmode" ) ); // => "opaque"
	 * console.log( _url.param( search, "autoplay" ) ); // => "1"
	 * console.log( _url.param( search, "nonexistent" ) ); // => null
	 * @example <caption>Shows how to set a parameter value in the given search string.</caption>{@run true}
	 * // alias the FooUtils.url namespace
	 * var _url = FooUtils.url,
	 * 	// create a search string to test
	 * 	search = "?wmode=opaque&autoplay=1";
	 *
	 * console.log( _url.param( search, "wmode", "window" ) ); // => "?wmode=window&autoplay=1"
	 * console.log( _url.param( search, "autoplay", "0" ) ); // => "?wmode=opaque&autoplay=0"
	 * console.log( _url.param( search, "v", "2" ) ); // => "?wmode=opaque&autoplay=1&v=2"
	 */
	_.url.param = function(search, key, value){
		if (!_is.string(search) || !_is.string(key) || _is.empty(key)) return search;
		var regex, match, result, param;
		if (_is.undef(value)){
			regex = new RegExp('[?|&]' + key + '=([^&;]+?)(&|#|;|$)'); // regex to match the key and it's value but only capture the value
			match = regex.exec(search) || ["",""]; // match the param otherwise return an empty string match
			result = match[1].replace(/\+/g, '%20'); // replace any + character's with spaces
			return _is.string(result) && !_is.empty(result) ? decodeURIComponent(result) : null; // decode the result otherwise return null
		}
		if (_is.empty(value)){
			regex = new RegExp('^([^#]*\?)(([^#]*)&)?' + key + '(\=[^&#]*)?(&|#|$)');
			result = search.replace(regex, '$1$3$5').replace(/^([^#]*)((\?)&|\?(#|$))/,'$1$3$4');
		} else {
			regex = new RegExp('([?&])' + key + '[^&]*'); // regex to match the key and it's current value but only capture the preceding ? or & char
			param = key + '=' + encodeURIComponent(value);
			result = search.replace(regex, '$1' + param); // replace any existing instance of the key with the new value
			// If nothing was replaced, then add the new param to the end
			if (result === search && !regex.test(result)) { // if no replacement occurred and the parameter is not currently in the result then add it
				result += (result.indexOf("?") !== -1 ? '&' : '?') + param;
			}
		}
		return result;
	};

	//######################
	//## Type Definitions ##
	//######################

	/**
	 * @summary A plain JavaScript object returned by the {@link FooUtils.url.parts} method.
	 * @typedef {Object} FooUtils.url~Parts
	 * @property {string} hash - A string containing a `#` followed by the fragment identifier of the URL.
	 * @property {string} host - A string containing the host, that is the hostname, a `:`, and the port of the URL.
	 * @property {string} hostname - A string containing the domain of the URL.
	 * @property {string} href - A string containing the entire URL.
	 * @property {string} origin - A string containing the canonical form of the origin of the specific location.
	 * @property {string} pathname - A string containing an initial `/` followed by the path of the URL.
	 * @property {string} port - A string containing the port number of the URL.
	 * @property {string} protocol - A string containing the protocol scheme of the URL, including the final `:`.
	 * @property {string} search - A string containing a `?` followed by the parameters of the URL. Also known as "querystring".
	 * @see {@link FooUtils.url.parts} for example usage.
	 */

})(
	// dependencies
	FooUtils,
	FooUtils.is
);
(function (_, _is, _fn) {
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary Contains common string utility methods.
	 * @memberof FooUtils.
	 * @namespace str
	 */
	_.str = {};

	/**
	 * @summary Converts the given `target` to camel case.
	 * @memberof FooUtils.str.
	 * @function camel
	 * @param {string} target - The string to camel case.
	 * @returns {string}
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.camel( "max-width" ) ); // => "maxWidth"
	 * console.log( _str.camel( "max--width" ) ); // => "maxWidth"
	 * console.log( _str.camel( "max Width" ) ); // => "maxWidth"
	 * console.log( _str.camel( "Max_width" ) ); // => "maxWidth"
	 * console.log( _str.camel( "MaxWidth" ) ); // => "maxWidth"
	 * console.log( _str.camel( "Abbreviations like CSS are left intact" ) ); // => "abbreviationsLikeCSSAreLeftIntact"
	 */
	_.str.camel = function (target) {
		if (_is.empty(target)) return target;
		if (target.toUpperCase() === target) return target.toLowerCase();
		return target.replace(/^([A-Z])|[-\s_]+(\w)/g, function (match, p1, p2) {
			if (_is.string(p2)) return p2.toUpperCase();
			return p1.toLowerCase();
		});
	};

	/**
	 * @summary Converts the given `target` to kebab case. Non-alphanumeric characters are converted to `-`.
	 * @memberof FooUtils.str.
	 * @function kebab
	 * @param {string} target - The string to kebab case.
	 * @returns {string}
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.kebab( "max-width" ) ); // => "max-width"
	 * console.log( _str.kebab( "max--width" ) ); // => "max-width"
	 * console.log( _str.kebab( "max Width" ) ); // => "max-width"
	 * console.log( _str.kebab( "Max_width" ) ); // => "max-width"
	 * console.log( _str.kebab( "MaxWidth" ) ); // => "max-width"
	 * console.log( _str.kebab( "Non-alphanumeric ch@racters are converted to dashes!" ) ); // => "non-alphanumeric-ch-racters-are-converted-to-dashes"
	 */
	_.str.kebab = function(target){
		if (_is.empty(target)) return target;
		return target
			.match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
			.filter(Boolean)
			.map(function(x){ return x.toLowerCase(); })
			.join('-');
	};

	/**
	 * @summary Checks if the `target` contains the given `substr`.
	 * @memberof FooUtils.str.
	 * @function contains
	 * @param {string} target - The string to check.
	 * @param {string} substr - The string to check for.
	 * @param {boolean} [ignoreCase=false] - Whether or not to ignore casing when performing the check.
	 * @returns {boolean} `true` if the `target` contains the given `substr`.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str,
	 * 	// create a string to test
	 * 	target = "To be, or not to be, that is the question.";
	 *
	 * console.log( _str.contains( target, "To be" ) ); // => true
	 * console.log( _str.contains( target, "question" ) ); // => true
	 * console.log( _str.contains( target, "no" ) ); // => true
	 * console.log( _str.contains( target, "nonexistent" ) ); // => false
	 * console.log( _str.contains( target, "TO BE" ) ); // => false
	 * console.log( _str.contains( target, "TO BE", true ) ); // => true
	 */
	_.str.contains = function (target, substr, ignoreCase) {
		if (!_is.string(target) || _is.empty(target) || !_is.string(substr) || _is.empty(substr)) return false;
		return substr.length <= target.length
			&& (!!ignoreCase ? target.toUpperCase().indexOf(substr.toUpperCase()) : target.indexOf(substr)) !== -1;
	};

	/**
	 * @summary Checks if the `target` contains the given `word`.
	 * @memberof FooUtils.str.
	 * @function containsWord
	 * @param {string} target - The string to check.
	 * @param {string} word - The word to check for.
	 * @param {boolean} [ignoreCase=false] - Whether or not to ignore casing when performing the check.
	 * @returns {boolean} `true` if the `target` contains the given `word`.
	 * @description This method differs from {@link FooUtils.str.contains} in that it searches for whole words by splitting the `target` string on word boundaries (`\b`) and then comparing the individual parts.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str,
	 * 	// create a string to test
	 * 	target = "To be, or not to be, that is the question.";
	 *
	 * console.log( _str.containsWord( target, "question" ) ); // => true
	 * console.log( _str.containsWord( target, "no" ) ); // => false
	 * console.log( _str.containsWord( target, "NOT" ) ); // => false
	 * console.log( _str.containsWord( target, "NOT", true ) ); // => true
	 * console.log( _str.containsWord( target, "nonexistent" ) ); // => false
	 */
	_.str.containsWord = function(target, word, ignoreCase){
		if (!_is.string(target) || _is.empty(target) || !_is.string(word) || _is.empty(word) || target.length < word.length)
			return false;
		var parts = target.split(/\W/);
		for (var i = 0, len = parts.length; i < len; i++){
			if (ignoreCase ? parts[i].toUpperCase() === word.toUpperCase() : parts[i] === word) return true;
		}
		return false;
	};

	/**
	 * @summary Checks if the `target` ends with the given `substr`.
	 * @memberof FooUtils.str.
	 * @function endsWith
	 * @param {string} target - The string to check.
	 * @param {string} substr - The substr to check for.
	 * @returns {boolean} `true` if the `target` ends with the given `substr`.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.endsWith( "something", "g" ) ); // => true
	 * console.log( _str.endsWith( "something", "ing" ) ); // => true
	 * console.log( _str.endsWith( "something", "no" ) ); // => false
	 */
	_.str.endsWith = function (target, substr) {
		if (!_is.string(target) || _is.empty(target) || !_is.string(substr) || _is.empty(substr)) return target === substr;
		return target.slice(target.length - substr.length) === substr;
	};

	/**
	 * @summary Escapes the `target` for use in a regular expression.
	 * @memberof FooUtils.str.
	 * @function escapeRegExp
	 * @param {string} target - The string to escape.
	 * @returns {string}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions|Regular Expressions: Using Special Characters - JavaScript | MDN}
	 */
	_.str.escapeRegExp = function(target){
		if (_is.empty(target)) return target;
		return target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	};

	/**
	 * @summary Generates a 32 bit FNV-1a hash from the given `target`.
	 * @memberof FooUtils.str.
	 * @function fnv1a
	 * @param {string} target - The string to generate a hash from.
	 * @returns {?number} `null` if the `target` is not a string or empty otherwise a 32 bit FNV-1a hash.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.fnv1a( "Some string to generate a hash for." ) ); // => 207568994
	 * console.log( _str.fnv1a( "Some string to generate a hash for" ) ); // => 1350435704
	 * @see {@link https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function|Fowler–Noll–Vo hash function}
	 */
	_.str.fnv1a = function(target){
		if (!_is.string(target) || _is.empty(target)) return null;
		var i, l, hval = 0x811c9dc5;
		for (i = 0, l = target.length; i < l; i++) {
			hval ^= target.charCodeAt(i);
			hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		return hval >>> 0;
	};

	/**
	 * @summary Returns the remainder of the `target` split on the first index of the given `substr`.
	 * @memberof FooUtils.str.
	 * @function from
	 * @param {string} target - The string to split.
	 * @param {string} substr - The substring to split on.
	 * @returns {?string} `null` if the given `substr` does not exist within the `target`.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str,
	 * 	// create a string to test
	 * 	target = "To be, or not to be, that is the question.";
	 *
	 * console.log( _str.from( target, "no" ) ); // => "t to be, that is the question."
	 * console.log( _str.from( target, "that" ) ); // => " is the question."
	 * console.log( _str.from( target, "question" ) ); // => "."
	 * console.log( _str.from( target, "nonexistent" ) ); // => null
	 */
	_.str.from = function (target, substr) {
		return _.str.contains(target, substr) ? target.substring(target.indexOf(substr) + substr.length) : null;
	};

	/**
	 * @summary Joins any number of strings using the given `separator`.
	 * @memberof FooUtils.str.
	 * @function join
	 * @param {string} separator - The separator to use to join the strings.
	 * @param {string} part - The first string to join.
	 * @param {...string} [partN] - Any number of additional strings to join.
	 * @returns {?string}
	 * @description This method differs from using the standard `Array.prototype.join` function to join strings in that it ignores empty parts and checks to see if each starts with the supplied `separator`. If the part starts with the `separator` it is removed before appending it to the final result.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.join( "_", "all", "in", "one" ) ); // => "all_in_one"
	 * console.log( _str.join( "_", "all", "_in", "one" ) ); // => "all_in_one"
	 * console.log( _str.join( "/", "http://", "/example.com/", "/path/to/image.png" ) ); // => "http://example.com/path/to/image.png"
	 * console.log( _str.join( "/", "http://", "/example.com", "/path/to/image.png" ) ); // => "http://example.com/path/to/image.png"
	 * console.log( _str.join( "/", "http://", "example.com", "path/to/image.png" ) ); // => "http://example.com/path/to/image.png"
	 */
	_.str.join = function(separator, part, partN){
		if (!_is.string(separator) || !_is.string(part)) return null;
		var parts = _fn.arg2arr(arguments);
		separator = parts.shift();
		var i, l, result = parts.shift();
		for (i = 0, l = parts.length; i < l; i++){
			part = parts[i];
			if (_is.empty(part)) continue;
			if (_.str.endsWith(result, separator)){
				result = result.slice(0, result.length-separator.length);
			}
			if (_.str.startsWith(part, separator)){
				part = part.slice(separator.length);
			}
			result += separator + part;
		}
		return result;
	};

	/**
	 * @summary Checks if the `target` starts with the given `substr`.
	 * @memberof FooUtils.str.
	 * @function startsWith
	 * @param {string} target - The string to check.
	 * @param {string} substr - The substr to check for.
	 * @returns {boolean} `true` if the `target` starts with the given `substr`.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.startsWith( "something", "s" ) ); // => true
	 * console.log( _str.startsWith( "something", "some" ) ); // => true
	 * console.log( _str.startsWith( "something", "no" ) ); // => false
	 */
	_.str.startsWith = function (target, substr) {
		if (_is.empty(target) || _is.empty(substr)) return false;
		return target.slice(0, substr.length) === substr;
	};

	/**
	 * @summary Returns the first part of the `target` split on the first index of the given `substr`.
	 * @memberof FooUtils.str.
	 * @function until
	 * @param {string} target - The string to split.
	 * @param {string} substr - The substring to split on.
	 * @returns {string} The `target` if the `substr` does not exist.
	 * @example {@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str,
	 * 	// create a string to test
	 * 	target = "To be, or not to be, that is the question.";
	 *
	 * console.log( _str.until( target, "no" ) ); // => "To be, or "
	 * console.log( _str.until( target, "that" ) ); // => "To be, or not to be, "
	 * console.log( _str.until( target, "question" ) ); // => "To be, or not to be, that is the "
	 * console.log( _str.until( target, "nonexistent" ) ); // => "To be, or not to be, that is the question."
	 */
	_.str.until = function (target, substr) {
		return _.str.contains(target, substr) ? target.substring(0, target.indexOf(substr)) : target;
	};

	/**
	 * @summary A basic string formatter that can use both index and name based placeholders but handles only string or number replacements.
	 * @memberof FooUtils.str.
	 * @function format
	 * @param {string} target - The format string containing any placeholders to replace.
	 * @param {string|number|Object|Array} arg1 - The first value to format the target with. If an object is supplied it's properties are used to match named placeholders. If an array, string or number is supplied it's values are used to match any index placeholders.
	 * @param {...(string|number)} [argN] - Any number of additional strings or numbers to format the target with.
	 * @returns {string} The string formatted with the supplied arguments.
	 * @description This method allows you to supply the replacements as an object when using named placeholders or as an array or additional arguments when using index placeholders.
	 *
	 * This does not perform a simultaneous replacement of placeholders, which is why it's referred to as a basic formatter. This means replacements that contain placeholders within there value could end up being replaced themselves as seen in the last example.
	 * @example {@caption The following shows how to use index placeholders.}{@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str,
	 * 	// create a format string using index placeholders
	 * 	format = "Hello, {0}, are you feeling {1}?";
	 *
	 * console.log( _str.format( format, "Steve", "OK" ) ); // => "Hello, Steve, are you feeling OK?"
	 * // or
	 * console.log( _str.format( format, [ "Steve", "OK" ] ) ); // => "Hello, Steve, are you feeling OK?"
	 * @example {@caption While the above works perfectly fine the downside is that the placeholders provide no clues as to what should be supplied as a replacement value, this is were supplying an object and using named placeholders steps in.}{@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str,
	 * 	// create a format string using named placeholders
	 * 	format = "Hello, {name}, are you feeling {adjective}?";
	 *
	 * console.log( _str.format( format, {name: "Steve", adjective: "OK"} ) ); // => "Hello, Steve, are you feeling OK?"
	 * @example {@caption The following demonstrates the issue with not performing a simultaneous replacement of placeholders.}{@run true}
	 * // alias the FooUtils.str namespace
	 * var _str = FooUtils.str;
	 *
	 * console.log( _str.format("{0}{1}", "{1}", "{0}") ); // => "{0}{0}"
	 *
	 * // If the replacement happened simultaneously the result would be "{1}{0}" but this method executes
	 * // replacements synchronously as seen below:
	 *
	 * // "{0}{1}".replace( "{0}", "{1}" )
	 * // => "{1}{1}".replace( "{1}", "{0}" )
	 * // => "{0}{0}"
	 */
	_.str.format = function (target, arg1, argN){
		var args = _fn.arg2arr(arguments);
		target = args.shift(); // remove the target from the args
		if (_is.string(target) && args.length > 0){
			if (args.length === 1 && (_is.array(args[0]) || _is.object(args[0]))){
				args = args[0];
			}
			_.each(args, function(value, placeholder){
				target = target.replace(new RegExp("\\{" + placeholder + "\\}", "gi"), value + "");
			});
		}
		return target;
	};

})(
	// dependencies
	FooUtils,
	FooUtils.is,
	FooUtils.fn
);
(function($, _, _is, _fn, _str){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary Contains common object utility methods.
	 * @memberof FooUtils.
	 * @namespace obj
	 */
	_.obj = {};

	// used by the obj.create method
	var Obj = function () {};
	/**
	 * @summary Creates a new object with the specified prototype.
	 * @memberof FooUtils.obj.
	 * @function create
	 * @param {Object} proto - The object which should be the prototype of the newly-created object.
	 * @returns {Object} A new object with the specified prototype.
	 * @description This is a basic implementation of the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create|Object.create} method.
	 */
	_.obj.create = function (proto) {
		if (!_is.object(proto))
			throw TypeError('Argument must be an object');
		Obj.prototype = proto;
		var result = new Obj();
		Obj.prototype = null;
		return result;
	};

	/**
	 * @summary Merge the contents of two or more objects together into the first `target` object.
	 * @memberof FooUtils.obj.
	 * @function extend
	 * @param {Object} target - The object to merge properties into.
	 * @param {Object} object - An object containing properties to merge.
	 * @param {...Object} [objectN] - Additional objects containing properties to merge.
	 * @returns {Object} The `target` merged with the contents from any additional objects.
	 * @description This does not merge arrays by index as jQuery does, it treats them as a single property and replaces the array with a shallow copy of the new one.
	 *
	 * This method makes use of the {@link FooUtils.obj.merge} method internally.
	 * @example {@run true}
	 * // alias the FooUtils.obj namespace
	 * var _obj = FooUtils.obj,
	 * 	// create some objects to merge
	 * 	defaults = {"name": "My Object", "enabled": false, "arr": [1,2,3]},
	 * 	options = {"enabled": true, "something": 123, "arr": [4,5,6]};
	 *
	 * // merge the two objects into a new third one without modifying either of the originals
	 * var settings = _obj.extend( {}, defaults, options );
	 *
	 * console.log( settings ); // => {"name": "My Object", "enabled": true, "arr": [4,5,6], "something": 123}
	 * console.log( defaults ); // => {"name": "My Object", "enabled": true, "arr": [1,2,3]}
	 * console.log( options ); // => {"enabled": true, "arr": [4,5,6], "something": 123}
	 */
	_.obj.extend = function(target, object, objectN){
		target = _is.object(target) ? target : {};
		var objects = _fn.arg2arr(arguments);
		objects.shift();
		$.each(objects, function(i, object){
			_.obj.merge(target, object);
		});
		return target;
	};

	/**
	 * @summary Merge the contents of two objects together into the first `target` object.
	 * @memberof FooUtils.obj.
	 * @function merge
	 * @param {Object} target - The object to merge properties into.
	 * @param {Object} object - The object containing properties to merge.
	 * @returns {Object} The `target` merged with the contents from the `object`.
	 * @description This does not merge arrays by index as jQuery does, it treats them as a single property and replaces the array with a shallow copy of the new one.
	 *
	 * This method is used internally by the {@link FooUtils.obj.extend} method.
	 * @example {@run true}
	 * // alias the FooUtils.obj namespace
	 * var _obj = FooUtils.obj,
	 * 	// create some objects to merge
	 * 	target = {"name": "My Object", "enabled": false, "arr": [1,2,3]},
	 * 	object = {"enabled": true, "something": 123, "arr": [4,5,6]};
	 *
	 * console.log( _obj.merge( target, object ) ); // => {"name": "My Object", "enabled": true, "arr": [4,5,6], "something": 123}
	 */
	_.obj.merge = function(target, object){
		target = _is.hash(target) ? target : {};
		object = _is.hash(object) ? object : {};
		for (var prop in object) {
			if (object.hasOwnProperty(prop)) {
				if (_is.hash(object[prop])) {
					target[prop] = _is.hash(target[prop]) ? target[prop] : {};
					_.obj.merge(target[prop], object[prop]);
				} else if (_is.array(object[prop])) {
					target[prop] = object[prop].slice();
				} else {
					target[prop] = object[prop];
				}
			}
		}
		return target;
	};

	/**
	 * @summary Merge the validated properties of the `object` into the `target` using the optional `mappings`.
	 * @memberof FooUtils.obj.
	 * @function mergeValid
	 * @param {Object} target - The object to merge properties into.
	 * @param {FooUtils.obj~Validators} validators - An object containing validators for the `target` object properties.
	 * @param {Object} object - The object containing properties to merge.
	 * @param {FooUtils.obj~Mappings} [mappings] - An object containing property name mappings.
	 * @returns {Object} The modified `target` object containing any valid properties from the supplied `object`.
	 * @example {@caption Shows the basic usage for this method and shows how invalid properties or those with no corresponding validator are ignored.}{@run true}
	 * // alias the FooUtils.obj and FooUtils.is namespaces
	 * var _obj = FooUtils.obj,
	 * 	_is = FooUtils.is;
	 *
	 * //create the target object and it's validators
	 * var target = {"name":"John","location":"unknown"},
	 * 	validators = {"name":_is.string,"location":_is.string};
	 *
	 * // create the object to merge into the target
	 * var object = {
	 * 	"name": 1234, // invalid
	 * 	"location": "Liverpool", // updated
	 * 	"notMerged": true // ignored
	 * };
	 *
	 * // merge the object into the target, invalid properties or those with no corresponding validator are ignored.
	 * console.log( _obj.mergeValid( target, validators, object ) ); // => { "name": "John", "location": "Liverpool" }
	 * @example {@caption Shows how to supply a mappings object for this method.}{@run true}
	 * // alias the FooUtils.obj and FooUtils.is namespaces
	 * var _obj = FooUtils.obj,
	 * 	_is = FooUtils.is;
	 *
	 * //create the target object and it's validators
	 * var target = {"name":"John","location":"unknown"},
	 * 	validators = {"name":_is.string,"location":_is.string};
	 *
	 * // create the object to merge into the target
	 * var object = {
	 * 	"name": { // ignored
	 * 		"proper": "Christopher", // mapped to name if short is invalid
	 * 		"short": "Chris" // map to name
	 * 	},
	 * 	"city": "London" // map to location
	 * };
	 *
	 * // create the mapping object
	 * var mappings = {
	 * 	"name": [ "name.short", "name.proper" ], // try use the short name and fallback to the proper
	 * 	"location": "city"
	 * };
	 *
	 * // merge the object into the target using the mappings, invalid properties or those with no corresponding validator are ignored.
	 * console.log( _obj.mergeValid( target, validators, object, mappings ) ); // => { "name": "Chris", "location": "London" }
	 */
	_.obj.mergeValid = function(target, validators, object, mappings){
		if (!_is.hash(object) || !_is.hash(validators)) return target;
		validators = _is.hash(validators) ? validators : {};
		mappings = _is.hash(mappings) ? mappings : {};
		var prop, maps, value;
		for (prop in validators){
			if (!validators.hasOwnProperty(prop) || !_is.fn(validators[prop])) continue;
			maps = _is.array(mappings[prop]) ? mappings[prop] : (_is.string(mappings[prop]) ? [mappings[prop]] : [prop]);
			$.each(maps, function(i, map){
				value = _.obj.prop(object, map);
				if (_is.undef(value)) return; // continue
				if (validators[prop](value)){
					_.obj.prop(target, prop, value);
					return false; // break
				}
			});
		}
		return target;
	};

	/**
	 * @summary Get or set a property value given its `name`.
	 * @memberof FooUtils.obj.
	 * @function prop
	 * @param {Object} object - The object to inspect for the property.
	 * @param {string} name - The name of the property to fetch. This can be a `.` notated name.
	 * @param {*} [value] - If supplied this is the value to set for the property.
	 * @returns {*} The value for the `name` property, if it does not exist then `undefined`.
	 * @returns {undefined} If a `value` is supplied this method returns nothing.
	 * @example {@caption Shows how to get a property value from an object.}{@run true}
	 * // alias the FooUtils.obj namespace
	 * var _obj = FooUtils.obj,
	 * 	// create an object to test
	 * 	object = {
	 * 		"name": "My Object",
	 * 		"some": {
	 * 			"thing": 123
	 * 		}
	 * 	};
	 *
	 * console.log( _obj.prop( object, "name" ) ); // => "My Object"
	 * console.log( _obj.prop( object, "some.thing" ) ); // => 123
	 * @example {@caption Shows how to set a property value for an object.}{@run true}
	 * // alias the FooUtils.obj namespace
	 * var _obj = FooUtils.obj,
	 * 	// create an object to test
	 * 	object = {
	 * 		"name": "My Object",
	 * 		"some": {
	 * 			"thing": 123
	 * 		}
	 * 	};
	 *
	 * _obj.prop( object, "name", "My Updated Object" );
	 * _obj.prop( object, "some.thing", 987 );
	 *
	 * console.log( object ); // => { "name": "My Updated Object", "some": { "thing": 987 } }
	 */
	_.obj.prop = function(object, name, value){
		if (!_is.object(object) || _is.empty(name)) return;
		var parts, last;
		if (_is.undef(value)){
			if (_str.contains(name, '.')){
				parts = name.split('.');
				last = parts.length - 1;
				$.each(parts, function(i, part){
					if (i === last){
						value = object[part];
					} else if (_is.hash(object[part])) {
						object = object[part];
					} else {
						// exit early
						return false;
					}
				});
			} else if (!_is.undef(object[name])){
				value = object[name];
			}
			return value;
		}
		if (_str.contains(name, '.')){
			parts = name.split('.');
			last = parts.length - 1;
			$.each(parts, function(i, part){
				if (i === last){
					object[part] = value;
				} else {
					object = _is.hash(object[part]) ? object[part] : (object[part] = {});
				}
			});
		} else if (!_is.undef(object[name])){
			object[name] = value;
		}
	};

	//######################
	//## Type Definitions ##
	//######################

	/**
	 * @summary An object used by the {@link FooUtils.obj.mergeValid|mergeValid} method to map new values onto the `target` object.
	 * @typedef {Object.<string,(string|Array.<string>)>} FooUtils.obj~Mappings
	 * @description The mappings object is a single level object. If you want to map a property from/to a child object on either the source or target objects you must supply the name using `.` notation as seen in the below example with the `"name.first"` to `"Name.Short"` mapping.
	 * @example {@caption The basic structure of a mappings object is the below.}
	 * {
	 * 	"TargetName": "SourceName", // for top level properties
	 * 	"Child.TargetName": "Child.SourceName" // for child properties
	 * }
	 * @example {@caption Given the following target object.}
	 * var target = {
	 * 	"name": {
	 * 		"first": "",
	 * 		"last": null
	 * 	},
	 * 	"age": 0
	 * };
	 * @example {@caption And the following object to merge.}
	 * var object = {
	 * 	"Name": {
	 * 		"Full": "Christopher",
	 * 		"Short": "Chris"
	 * 	},
	 * 	"Age": 32
	 * };
	 * @example {@caption The mappings object would look like the below.}
	 * var mappings = {
	 * 	"name.first": "Name.Short",
	 * 	"age": "Age"
	 * };
	 * @example {@caption If you want the `"name.first"` property to try to use the `"Name.Short"` value but fallback to `"Name.Proper"` you can specify the mapping value as an array.}
	 * var mappings = {
	 * 	"name.first": [ "Name.Short", "Name.Proper" ],
	 * 	"age": "Age"
	 * };
	 */

	/**
	 * @summary An object used by the {@link FooUtils.obj.mergeValid|mergeValid} method to validate properties.
	 * @typedef {Object.<string,function(*):boolean>} FooUtils.obj~Validators
	 * @description The validators object is a single level object. If you want to validate a property of a child object you must supply the name using `.` notation as seen in the below example with the `"name.first"` and `"name.last"` properties.
	 *
	 * Any function that accepts a value to test as the first argument and returns a boolean can be used as a validator. This means the majority of the {@link FooUtils.is} methods can be used directly. If the property supports multiple types just provide your own function as seen with `"name.last"` in the below example.
	 * @example {@caption The basic structure of a validators object is the below.}
	 * {
	 * 	"PropName": function(*):boolean, // for top level properties
	 * 	"Child.PropName": function(*):boolean // for child properties
	 * }
	 * @example {@caption Given the following target object.}
	 * var target = {
	 * 	"name": {
	 * 		"first": "", // must be a string
	 * 		"last": null // must be a string or null
	 * 	},
	 * 	"age": 0 // must be a number
	 * };
	 * @example {@caption The validators object could be created as seen below.}
	 * // alias the FooUtils.is namespace
	 * var _is = FooUtils.is;
	 *
	 * var validators = {
	 * 	"name.first": _is.string,
	 * 	"name.last": function(value){
	 * 		return _is.string(value) || value === null;
	 * 	},
	 * 	"age": _is.number
	 * };
	 */

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is,
	FooUtils.fn,
	FooUtils.str
);
(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	// any methods that have dependencies but don't fall into a specific subset or namespace can be added here

	/**
	 * @summary The callback for the {@link FooUtils.ready} method.
	 * @callback FooUtils~readyCallback
	 * @param {jQuery} $ - The instance of jQuery the plugin was registered with.
	 * @this window
	 * @see Take a look at the {@link FooUtils.ready} method for example usage.
	 */

	/**
	 * @summary Waits for the DOM to be accessible and then executes the supplied callback.
	 * @memberof FooUtils.
	 * @function ready
	 * @param {FooUtils~readyCallback} callback - The function to execute once the DOM is accessible.
	 * @example {@caption This method can be used as a replacement for the jQuery ready callback to avoid an error in another script stopping our scripts from running.}
	 * FooUtils.ready(function($){
	 * 	// do something
	 * });
	 */
	_.ready = function (callback) {
		function onready(){
			try { callback.call(window, _.$); }
			catch(err) { console.error(err); }
		}
		if (Function('/*@cc_on return true@*/')() ? document.readyState === "complete" : document.readyState !== "loading") onready();
		else document.addEventListener('DOMContentLoaded', onready, false);
	};

	/**
	 * @summary Executed once for each array index or object property until it returns a truthy value.
	 * @callback FooUtils~findCallback
	 * @param {*} value - The current value being iterated over. This could be either an element in an array or the value of an object property.
	 * @param {(number|string)} [key] - The array index or property name of the `value`.
	 * @param {(Object|Array)} [object] - The array or object currently being searched.
	 * @returns {boolean} A truthy value.
	 */

	/**
	 * @summary Returns the value of the first element or property in the provided target that satisfies the provided test function.
	 * @memberof FooUtils.
	 * @function find
	 * @param {(Object|Array)} target - The object or array to search.
	 * @param {FooUtils~findCallback} callback - A function to execute for each value in the target.
	 * @param {*} [thisArg] - The `this` value within the `callback`.
	 * @returns {*} The value of the first element or property in the provided target that satisfies the provided test function. Otherwise, `undefined` is returned.
	 */
	_.find = function(target, callback, thisArg){
		if (!_is.fn(callback)) return;
		thisArg = _is.undef(thisArg) ? callback : thisArg;
		var i, l;
		if (_is.array(target)){
			for (i = 0, l = target.length; i < l; i++){
				if (callback.call(thisArg, target[i], i, target)){
					return target[i];
				}
			}
		} else if (_is.object(target)){
			var keys = Object.keys(target);
			for (i = 0, l = keys.length; i < l; i++){
				if (callback.call(thisArg, target[keys[i]], keys[i], target)){
					return target[keys[i]];
				}
			}
		}
	};

	/**
	 * @summary Executed once for each array index or object property.
	 * @callback FooUtils~eachCallback
	 * @param {*} value - The current value being iterated over. This could be either an element in an array or the value of an object property.
	 * @param {(number|string)} [key] - The array index or property name of the `value`.
	 * @param {(Object|Array)} [object] - The array or object currently being searched.
	 * @returns {(boolean|void)} Return `false` to break out of the loop, all other values are ignored.
	 */

	/**
	 * @summary Iterate over all indexes or properties of the provided target executing the provided callback once per value.
	 * @memberof FooUtils.
	 * @function each
	 * @param {(Object|Array)} object - The object or array to search.
	 * @param {FooUtils~eachCallback} callback - A function to execute for each value in the target.
	 * @param {*} [thisArg] - The `this` value within the `callback`.
	 */
	_.each = function(object, callback, thisArg){
		if (!_is.fn(callback)) return;
		thisArg = _is.undef(thisArg) ? callback : thisArg;
		var i, l, result;
		if (_is.array(object)){
			for (i = 0, l = object.length; i < l; i++){
				result = callback.call(thisArg, object[i], i, object);
				if (result === false) break;
			}
		} else if (_is.object(object)){
			var keys = Object.keys(object);
			for (i = 0, l = keys.length; i < l; i++){
				result = callback.call(thisArg, object[keys[i]], keys[i], object);
				if (result === false) break;
			}
		}
	};

	/**
	 * @summary Compares two version numbers.
	 * @memberof FooUtils.
	 * @function versionCompare
	 * @param {string} version1 - The first version to use in the comparison.
	 * @param {string} version2 - The second version to compare to the first.
	 * @returns {number} `0` if the version are equal.
	 * `-1` if `version1` is less than `version2`.
	 * `1` if `version1` is greater than `version2`.
	 * `NaN` if either of the supplied versions do not conform to MAJOR.MINOR.PATCH format.
	 * @description This method will compare two version numbers that conform to the basic MAJOR.MINOR.PATCH format returning the result as a simple number. This method will handle short version string comparisons e.g. `1.0` versus `1.0.1`.
	 * @example {@caption The following shows the results of comparing various version strings.}
	 * console.log( FooUtils.versionCompare( "0", "0" ) ); // => 0
	 * console.log( FooUtils.versionCompare( "0.0", "0" ) ); // => 0
	 * console.log( FooUtils.versionCompare( "0.0", "0.0.0" ) ); // => 0
	 * console.log( FooUtils.versionCompare( "0.1", "0.0.0" ) ); // => 1
	 * console.log( FooUtils.versionCompare( "0.1", "0.0.1" ) ); // => 1
	 * console.log( FooUtils.versionCompare( "1", "0.1" ) ); // => 1
	 * console.log( FooUtils.versionCompare( "1.10", "1.9" ) ); // => 1
	 * console.log( FooUtils.versionCompare( "1.9", "1.10" ) ); // => -1
	 * console.log( FooUtils.versionCompare( "1", "1.1" ) ); // => -1
	 * console.log( FooUtils.versionCompare( "1.0.9", "1.1" ) ); // => -1
	 * @example {@caption If either of the supplied version strings does not match the MAJOR.MINOR.PATCH format then `NaN` is returned.}
	 * console.log( FooUtils.versionCompare( "not-a-version", "1.1" ) ); // => NaN
	 * console.log( FooUtils.versionCompare( "1.1", "not-a-version" ) ); // => NaN
	 * console.log( FooUtils.versionCompare( "not-a-version", "not-a-version" ) ); // => NaN
	 */
	_.versionCompare = function(version1, version2){
		// if either of the versions do not match the expected format return NaN
		if (!(/[\d.]/.test(version1) && /[\d.]/.test(version2))) return NaN;

		/**
		 * @summary Splits and parses the given version string into a numeric array.
		 * @param {string} version - The version string to split and parse.
		 * @returns {Array.<number>}
		 * @ignore
		 */
		function split(version){
			var parts = version.split('.'), result = [];
			for(var i = 0, len = parts.length; i < len; i++){
				result[i] = parseInt(parts[i]);
				if (isNaN(result[i])) result[i] = 0;
			}
			return result;
		}

		// get the base numeric arrays for each version
		var v1parts = split(version1),
			v2parts = split(version2);

		// ensure both arrays are the same length by padding the shorter with 0
		while (v1parts.length < v2parts.length) v1parts.push(0);
		while (v2parts.length < v1parts.length) v2parts.push(0);

		// perform the actual comparison
		for (var i = 0; i < v1parts.length; ++i) {
			if (v2parts.length === i) return 1;
			if (v1parts[i] === v2parts[i]) continue;
			if (v1parts[i] > v2parts[i]) return 1;
			else return -1;
		}
		if (v1parts.length !== v2parts.length) return -1;
		return 0;
	};

	// A variable to hold the last number used to generate an ID in the current page.
	var uniqueId = 0;

	/**
	 * @summary Generate and apply a unique id for the given `$element`.
	 * @memberof FooUtils.
	 * @function uniqueId
	 * @param {jQuery} $element - The jQuery element object to retrieve an id from or generate an id for.
	 * @param {string} [prefix="uid-"] - A prefix to append to the start of any generated ids.
	 * @returns {string} Either the `$element`'s existing id or a generated one that has been applied to it.
	 * @example {@run true}
	 * // alias the FooUtils namespace
	 * var _ = FooUtils;
	 *
	 * // create some elements to test
	 * var $hasId = $("<span/>", {id: "exists"});
	 * var $generatedId = $("<span/>");
	 * var $generatedPrefixedId = $("<span/>");
	 *
	 * console.log( _.uniqueId( $hasId ) ); // => "exists"
	 * console.log( $hasId.attr( "id" ) ); // => "exists"
	 * console.log( _.uniqueId( $generatedId ) ); // => "uid-1"
	 * console.log( $generatedId.attr( "id" ) ); // => "uid-1"
	 * console.log( _.uniqueId( $generatedPrefixedId, "plugin-" ) ); // => "plugin-2"
	 * console.log( $generatedPrefixedId.attr( "id" ) ); // => "plugin-2"
	 */
	_.uniqueId = function($element, prefix){
		var id = $element.attr('id');
		if (_is.empty(id)){
			prefix = _is.string(prefix) && !_is.empty(prefix) ? prefix : "uid-";
			id = prefix + (++uniqueId);
			$element.attr('id', id).data('__uniqueId__', true);
		}
		return id;
	};

	/**
	 * @summary Remove the id from the given `$element` if it was set using the {@link FooUtils.uniqueId|uniqueId} method.
	 * @memberof FooUtils.
	 * @function removeUniqueId
	 * @param {jQuery} $element - The jQuery element object to remove a generated id from.
	 * @example {@run true}
	 * // alias the FooUtils namespace
	 * var _ = FooUtils;
	 *
	 * // create some elements to test
	 * var $hasId = $("<span/>", {id: "exists"});
	 * var $generatedId = $("<span/>");
	 * var $generatedPrefixedId = $("<span/>");
	 *
	 * console.log( _.uniqueId( $hasId ) ); // => "exists"
	 * console.log( _.uniqueId( $generatedId ) ); // => "uid-1"
	 * console.log( _.uniqueId( $generatedPrefixedId, "plugin-" ) ); // => "plugin-2"
	 */
	_.removeUniqueId = function($element){
		if ($element.data('__uniqueId__')){
			$element.removeAttr('id').removeData('__uniqueId__');
		}
	};

	/**
	 * @summary Convert CSS class names into CSS selectors.
	 * @memberof FooUtils.
	 * @function selectify
	 * @param {(string|string[]|object)} classes - A space delimited string of CSS class names or an array of them with each item being included in the selector using the OR (`,`) syntax as a separator. If an object is supplied the result will be an object with the same property names but the values converted to selectors.
	 * @returns {(object|string)}
	 * @example {@caption Shows how the method can be used.}
	 * // alias the FooUtils namespace
	 * var _ = FooUtils;
	 *
	 * console.log( _.selectify("my-class") ); // => ".my-class"
	 * console.log( _.selectify("my-class my-other-class") ); // => ".my-class.my-other-class"
	 * console.log( _.selectify(["my-class", "my-other-class"]) ); // => ".my-class,.my-other-class"
	 * console.log( _.selectify({
	 * 	class1: "my-class",
	 * 	class2: "my-class my-other-class",
	 * 	class3: ["my-class", "my-other-class"]
	 * }) ); // => { class1: ".my-class", class2: ".my-class.my-other-class", class3: ".my-class,.my-other-class" }
	 */
	_.selectify = function (classes) {
		if (_is.empty(classes)) return null;
		if (_is.hash(classes)) {
			var result = {}, selector;
			for (var name in classes) {
				if (!classes.hasOwnProperty(name)) continue;
				selector = _.selectify(classes[name]);
				if (selector) {
					result[name] = selector;
				}
			}
			return result;
		}
		if (_is.string(classes) || _is.array(classes)) {
			if (_is.string(classes)) classes = [classes];
			return classes.map(function(str){
				return _is.string(str) ? "." + str.split(/\s/g).join(".") : null;
			}).join(",");
		}
		return null;
	};

	/**
	 * @summary Parses the supplied `src` and `srcset` values and returns the best matching URL for the supplied render size.
	 * @memberof FooUtils.
	 * @function src
	 * @param {string} src - The default src for the image.
	 * @param {string} srcset - The srcset containing additional image sizes.
	 * @param {number} srcWidth - The width of the `src` image.
	 * @param {number} srcHeight - The height of the `src` image.
	 * @param {number} renderWidth - The rendered width of the image element.
	 * @param {number} renderHeight - The rendered height of the image element.
	 * @param {number} [devicePixelRatio] - The device pixel ratio to use while parsing. Defaults to the current device pixel ratio.
	 * @returns {(string|null)} Returns the parsed responsive src or null if no src is provided.
	 * @description This can be used to parse the correct src to use when loading an image through JavaScript.
	 * @example {@caption The following shows using the method with the srcset w-descriptor.}{@run true}
	 * var src = "test-240x120.jpg",
	 * 	width = 240, // the naturalWidth of the 'src' image
	 * 	height = 120, // the naturalHeight of the 'src' image
	 * 	srcset = "test-480x240.jpg 480w, test-720x360.jpg 720w, test-960x480.jpg 960w";
	 *
	 * console.log( FooUtils.src( src, srcset, width, height, 240, 120, 1 ) ); // => "test-240x120.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 240, 120, 2 ) ); // => "test-480x240.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 480, 240, 1 ) ); // => "test-480x240.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 480, 240, 2 ) ); // => "test-960x480.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 720, 360, 1 ) ); // => "test-720x360.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 960, 480, 1 ) ); // => "test-960x480.jpg"
	 * @example {@caption The following shows using the method with the srcset h-descriptor.}{@run true}
	 * var src = "test-240x120.jpg",
	 * 	width = 240, // the naturalWidth of the 'src' image
	 * 	height = 120, // the naturalHeight of the 'src' image
	 * 	srcset = "test-480x240.jpg 240h, test-720x360.jpg 360h, test-960x480.jpg 480h";
	 *
	 * console.log( FooUtils.src( src, srcset, width, height, 240, 120, 1 ) ); // => "test-240x120.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 240, 120, 2 ) ); // => "test-480x240.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 480, 240, 1 ) ); // => "test-480x240.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 480, 240, 2 ) ); // => "test-960x480.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 720, 360, 1 ) ); // => "test-720x360.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 960, 480, 1 ) ); // => "test-960x480.jpg"
	 * @example {@caption The following shows using the method with the srcset x-descriptor.}{@run true}
	 * var src = "test-240x120.jpg",
	 * 	width = 240, // the naturalWidth of the 'src' image
	 * 	height = 120, // the naturalHeight of the 'src' image
	 * 	srcset = "test-480x240.jpg 2x, test-720x360.jpg 3x, test-960x480.jpg 4x";
	 *
	 * console.log( FooUtils.src( src, srcset, width, height, 240, 120, 1 ) ); // => "test-240x120.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 240, 120, 2 ) ); // => "test-480x240.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 480, 240, 1 ) ); // => "test-240x120.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 480, 240, 2 ) ); // => "test-480x240.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 720, 360, 1 ) ); // => "test-240x120.jpg"
	 * console.log( FooUtils.src( src, srcset, width, height, 960, 480, 1 ) ); // => "test-240x120.jpg"
	 */
	_.src = function(src, srcset, srcWidth, srcHeight, renderWidth, renderHeight, devicePixelRatio){
		if (!_is.string(src)) return null;
		// if there is no srcset just return the src
		if (!_is.string(srcset)) return src;

		// first split the srcset into its individual sources
		var sources = srcset.replace(/(\s[\d.]+[whx]),/g, '$1 @,@ ').split(' @,@ ');
		// then parse those sources into objects containing the url, width, height and pixel density
		var list = sources.map(function (val) {
			return {
				url: /^\s*(\S*)/.exec(val)[1],
				w: parseFloat((/\S\s+(\d+)w/.exec(val) || [0, Infinity])[1]),
				h: parseFloat((/\S\s+(\d+)h/.exec(val) || [0, Infinity])[1]),
				x: parseFloat((/\S\s+([\d.]+)x/.exec(val) || [0, 1])[1])
			};
		});

		// if there is no items parsed from the srcset then just return the src
		if (!list.length) return src;

		// add the current src into the mix by inspecting the first parsed item to figure out how to handle it
		list.unshift({
			url: src,
			w: list[0].w !== Infinity && list[0].h === Infinity ? srcWidth : Infinity,
			h: list[0].h !== Infinity && list[0].w === Infinity ? srcHeight : Infinity,
			x: 1
		});

		// get the current viewport info and use it to determine the correct src to load
		var dpr = _is.number(devicePixelRatio) ? devicePixelRatio : (window.devicePixelRatio || 1),
			area = {w: renderWidth * dpr, h: renderHeight * dpr, x: dpr},
			props = ['w','h','x'];

		// first check each of the viewport properties against the max values of the same properties in our src array
		// only src's with a property greater than the viewport or equal to the max are kept
		props.forEach(function (prop) {
			var max = Math.max.apply(null, list.map(function (item) {
				return item[prop];
			}));
			list = list.filter(function (item) {
				return item[prop] >= area[prop] || item[prop] === max;
			});
		});

		// next reduce our src array by comparing the viewport properties against the minimum values of the same properties of each src
		// only src's with a property equal to the minimum are kept
		props.forEach(function (prop) {
			var min = Math.min.apply(null, list.map(function (item) {
				return item[prop];
			}));
			list = list.filter(function (item) {
				return item[prop] === min;
			});
		});

		// return the first url as it is the best match for the current viewport
		return list[0].url;
	};

	/**
	 * @summary Get the scroll parent for the supplied element optionally filtering by axis.
	 * @memberof FooUtils.
	 * @function scrollParent
	 * @param {(string|Element|jQuery)} element - The selector, element or jQuery element to find the scroll parent of.
	 * @param {string} [axis="xy"] - The axis to check. By default this method will check both the X and Y axis.
	 * @param {jQuery} [def] - The default jQuery element to return if no result was found. Defaults to the supplied elements document.
	 * @returns {jQuery}
	 */
	_.scrollParent = function(element, axis, def){
		element = _is.jq(element) ? element : $(element);
		axis = _is.string(axis) && /^(x|y|xy|yx)$/i.test(axis) ? axis : "xy";
		var $doc = $(!!element.length && element[0].ownerDocument || document);
		def = _is.jq(def) ? def : $doc;

		if (!element.length) return def;

		var position = element.css("position"),
			excludeStaticParent = position === "absolute",
			scroll = /(auto|scroll)/i, axisX = /x/i, axisY = /y/i,
			$parent = element.parentsUntil(def).filter(function(i, el){
				var $el = $(this);
				if (excludeStaticParent && $el.css("position") === "static") return false;
				var scrollY = axisY.test(axis) && el.scrollHeight > el.clientHeight && scroll.test($el.css("overflow-y")),
					scrollX = axisX.test(axis) && el.scrollWidth > el.clientWidth && scroll.test($el.css("overflow-x"));
				return scrollY || scrollX;
			}).eq(0);

		if ($parent.is("html")) $parent = $doc;
		return position === "fixed" || !$parent.length ? def : $parent;
	};

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is
);
(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary Contains common utility methods and members for the CSS animation property.
	 * @memberof FooUtils.
	 * @namespace animation
	 */
	_.animation = {};

	function raf(callback){
		return setTimeout(callback, 1000/60);
	}

	function caf(requestID){
		clearTimeout(requestID);
	}

	/**
	 * @summary A cross browser wrapper for the `requestAnimationFrame` method.
	 * @memberof FooUtils.animation.
	 * @function requestFrame
	 * @param {function} callback - The function to call when it's time to update your animation for the next repaint.
	 * @return {number} - The request id that uniquely identifies the entry in the callback list.
	 */
	_.animation.requestFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || raf).bind(window);

	/**
	 * @summary A cross browser wrapper for the `cancelAnimationFrame` method.
	 * @memberof FooUtils.animation.
	 * @function cancelFrame
	 * @param {number} requestID - The ID value returned by the call to {@link FooUtils.animation.requestFrame|requestFrame} that requested the callback.
	 */
	_.animation.cancelFrame = (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || caf).bind(window);

	// create a test element to check for the existence of the various animation properties
	var testElement = document.createElement('div');

	/**
	 * @summary Whether or not animations are supported by the current browser.
	 * @memberof FooUtils.animation.
	 * @name supported
	 * @type {boolean}
	 */
	_.animation.supported = (
		/**
		 * @ignore
		 * @summary Performs a one time test to see if animations are supported
		 * @param {HTMLElement} el - An element to test with.
		 * @returns {boolean} `true` if animations are supported.
		 */
		function(el){
			var style = el.style;
			return _is.string(style['animation'])
				|| _is.string(style['WebkitAnimation'])
				|| _is.string(style['MozAnimation'])
				|| _is.string(style['msAnimation'])
				|| _is.string(style['OAnimation']);
		}
	)(testElement);

	/**
	 * @summary The `animationend` event name for the current browser.
	 * @memberof FooUtils.animation.
	 * @name end
	 * @type {string}
	 * @description Depending on the browser this returns one of the following values:
	 *
	 * <ul><!--
	 * --><li>`"animationend"`</li><!--
	 * --><li>`"webkitAnimationEnd"`</li><!--
	 * --><li>`"msAnimationEnd"`</li><!--
	 * --><li>`"oAnimationEnd"`</li><!--
	 * --><li>`null` - If the browser doesn't support animations</li><!--
	 * --></ul>
	 */
	_.animation.end = (
		/**
		 * @ignore
		 * @summary Performs a one time test to determine which `animationend` event to use for the current browser.
		 * @param {HTMLElement} el - An element to test with.
		 * @returns {?string} The correct `animationend` event for the current browser, `null` if the browser doesn't support animations.
		 */
		function(el){
			var style = el.style;
			if (_is.string(style['animation'])) return 'animationend';
			if (_is.string(style['WebkitAnimation'])) return 'webkitAnimationEnd';
			if (_is.string(style['MozAnimation'])) return 'animationend';
			if (_is.string(style['msAnimation'])) return 'msAnimationEnd';
			if (_is.string(style['OAnimation'])) return 'oAnimationEnd';
			return null;
		}
	)(testElement);

	/**
	 * @summary Gets the `animation-duration` value for the supplied jQuery element.
	 * @memberof FooUtils.animation.
	 * @function duration
	 * @param {jQuery} $element - The jQuery element to retrieve the duration from.
	 * @param {number} [def=0] - The default value to return if no duration is set.
	 * @returns {number} The value of the `animation-duration` property converted to a millisecond value.
	 */
	_.animation.duration = function($element, def){
		def = _is.number(def) ? def : 0;
		if (!_is.jq($element)) return def;
		// we can use jQuery.css() method to retrieve the value cross browser
		var duration = $element.css('animation-duration');
		if (/^([\d.]*)+?(ms|s)/i.test(duration)){
			// if we have a valid duration value split it into it's components
			var parts = duration.split(","), max = 0;
			parts.forEach(function(part){
				var match = part.match(/^\s*?([\d.]*)+?(ms|s)\s*?$/i),
					value = parseFloat(match[1]),
					unit = match[2].toLowerCase();
				if (unit === 's'){
					// convert seconds to milliseconds
					value = value * 1000;
				}
				if (value > max) max = value;
			});
			return max;
		}
		return def;
	};

	/**
	 * @summary Gets the `animation-iteration-count` value for the supplied jQuery element.
	 * @memberof FooUtils.animation.
	 * @function iterations
	 * @param {jQuery} $element - The jQuery element to retrieve the duration from.
	 * @param {number} [def=1] - The default value to return if no iteration count is set.
	 * @returns {number} The value of the `animation-iteration-count` property.
	 */
	_.animation.iterations = function($element, def){
		def = _is.number(def) ? def : 1;
		if (!_is.jq($element)) return def;
		// we can use jQuery.css() method to retrieve the value cross browser
		var iterations = $element.css('animation-iteration-count');
		if (/^(([\d.]+)|infinite)/i.test(iterations)){
			// if we have a valid iterations value split it into it's components
			var parts = iterations.split(","), max = 0;
			parts.forEach(function(part){
				var value = parseFloat(part);
				if (isNaN(value)) value = Infinity;
				if (value > max) max = value;
			});
			return max;
		}
		return def;
	};

	/**
	 * @summary The callback function to execute when starting a animation.
	 * @callback FooUtils.animation~startCallback
	 * @param {jQuery} $element - The element to start the animation on.
	 * @this Element
	 */

	/**
	 * @summary Start a animation by toggling the supplied `className` on the `$element`.
	 * @memberof FooUtils.animation.
	 * @function start
	 * @param {jQuery} $element - The jQuery element to start the animation on.
	 * @param {(string|FooUtils.animation~startCallback)} classNameOrFunc - One or more class names (separated by spaces) to be toggled or a function that performs the required actions to start the animation.
	 * @param {boolean} [state] - A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
	 * @param {number} [timeout] - The maximum time, in milliseconds, to wait for the `animationend` event to be raised. If not provided this will be automatically set to the elements `animation-duration` multiplied by the `animation-iteration-count` property plus an extra 50 milliseconds.
	 * @returns {Promise}
	 * @description This method lets us use CSS animations by toggling a class and using the `animationend` event to perform additional actions once the animation has completed across all browsers. In browsers that do not support animations this method would behave the same as if just calling jQuery's `.toggleClass` method.
	 *
	 * The last parameter `timeout` is used to create a timer that behaves as a safety net in case the `animationend` event is never raised and ensures the deferred returned by this method is resolved or rejected within a specified time.
	 *
	 * If no `timeout` is supplied the `animation-duration` and `animation-iterations-count` must be set on the `$element` before this method is called so one can be generated.
	 * @see {@link https://developer.mozilla.org/en/docs/Web/CSS/animation-duration|animation-duration - CSS | MDN} for more information on the `animation-duration` CSS property.
	 */
	_.animation.start = function($element, classNameOrFunc, state, timeout){
		var deferred = $.Deferred(), promise = deferred.promise();

		$element = $element.first();

		if (_.animation.supported){
			$element.prop('offsetTop');
			var safety = $element.data('animation_safety');
			if (_is.hash(safety) && _is.number(safety.timer)){
				clearTimeout(safety.timer);
				$element.removeData('animation_safety').off(_.animation.end + '.utils');
				safety.deferred.reject();
			}
			if (!_is.number(timeout)){
				var iterations = _.animation.iterations($element);
				if (iterations === Infinity){
					deferred.reject("No timeout supplied with an infinite animation.");
					return promise;
				}
				timeout = (_.animation.duration($element) * iterations) + 50;
			}
			safety = {
				deferred: deferred,
				timer: setTimeout(function(){
					// This is the safety net in case a animation fails for some reason and the animationend event is never raised.
					// This will remove the bound event and resolve the deferred
					$element.removeData('animation_safety').off(_.animation.end + '.utils');
					deferred.resolve();
				}, timeout)
			};
			$element.data('animation_safety', safety);

			$element.on(_.animation.end + '.utils', function(e){
				if ($element.is(e.target)){
					clearTimeout(safety.timer);
					$element.removeData('animation_safety').off(_.animation.end + '.utils');
					deferred.resolve();
				}
			});
		}

		_.animation.requestFrame(function(){
			if (_is.fn(classNameOrFunc)){
				classNameOrFunc.apply($element.get(0), [$element]);
			} else {
				$element.toggleClass(classNameOrFunc, state);
			}
			if (!_.animation.supported){
				// If the browser doesn't support animations then just resolve the deferred
				deferred.resolve();
			}
		});

		return promise;
	};

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is
);
(function($, _, _is, _animation){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary Contains common utility methods and members for the CSS transition property.
	 * @memberof FooUtils.
	 * @namespace transition
	 */
	_.transition = {};

	// create a test element to check for the existence of the various transition properties
	var testElement = document.createElement('div');

	/**
	 * @summary Whether or not transitions are supported by the current browser.
	 * @memberof FooUtils.transition.
	 * @name supported
	 * @type {boolean}
	 */
	_.transition.supported = (
		/**
		 * @ignore
		 * @summary Performs a one time test to see if transitions are supported
		 * @param {HTMLElement} el - An element to test with.
		 * @returns {boolean} `true` if transitions are supported.
		 */
		function(el){
			var style = el.style;
			return _is.string(style['transition'])
				|| _is.string(style['WebkitTransition'])
				|| _is.string(style['MozTransition'])
				|| _is.string(style['msTransition'])
				|| _is.string(style['OTransition']);
		}
	)(testElement);

	/**
	 * @summary The `transitionend` event name for the current browser.
	 * @memberof FooUtils.transition.
	 * @name end
	 * @type {string}
	 * @description Depending on the browser this returns one of the following values:
	 *
	 * <ul><!--
	 * --><li>`"transitionend"`</li><!--
	 * --><li>`"webkitTransitionEnd"`</li><!--
	 * --><li>`"msTransitionEnd"`</li><!--
	 * --><li>`"oTransitionEnd"`</li><!--
	 * --><li>`null` - If the browser doesn't support transitions</li><!--
	 * --></ul>
	 */
	_.transition.end = (
		/**
		 * @ignore
		 * @summary Performs a one time test to determine which `transitionend` event to use for the current browser.
		 * @param {HTMLElement} el - An element to test with.
		 * @returns {?string} The correct `transitionend` event for the current browser, `null` if the browser doesn't support transitions.
		 */
		function(el){
			var style = el.style;
			if (_is.string(style['transition'])) return 'transitionend';
			if (_is.string(style['WebkitTransition'])) return 'webkitTransitionEnd';
			if (_is.string(style['MozTransition'])) return 'transitionend';
			if (_is.string(style['msTransition'])) return 'msTransitionEnd';
			if (_is.string(style['OTransition'])) return 'oTransitionEnd';
			return null;
		}
	)(testElement);

	/**
	 * @summary Gets the `transition-duration` value for the supplied jQuery element.
	 * @memberof FooUtils.transition.
	 * @function duration
	 * @param {jQuery} $element - The jQuery element to retrieve the duration from.
	 * @param {number} [def=0] - The default value to return if no duration is set.
	 * @returns {number} The value of the `transition-duration` property converted to a millisecond value.
	 */
	_.transition.duration = function($element, def){
		def = _is.number(def) ? def : 0;
		if (!_is.jq($element)) return def;
		// we can use jQuery.css() method to retrieve the value cross browser
		var duration = $element.css('transition-duration');
		if (/^([\d.]*)+?(ms|s)/i.test(duration)){
			// if we have a valid duration value split it into it's components
			var parts = duration.split(","), max = 0;
			parts.forEach(function(part){
				var match = part.match(/^\s*?([\d.]*)+?(ms|s)\s*?$/i),
					value = parseFloat(match[1]),
					unit = match[2].toLowerCase();
				if (unit === 's'){
					// convert seconds to milliseconds
					value = value * 1000;
				}
				if (value > max) max = value;
			});
			return max;
		}
		return def;
	};

	/**
	 * @summary The callback function to execute when starting a transition.
	 * @callback FooUtils.transition~startCallback
	 * @param {jQuery} $element - The element to start the transition on.
	 * @this Element
	 */

	/**
	 * @summary Start a transition by toggling the supplied `className` on the `$element`.
	 * @memberof FooUtils.transition.
	 * @function start
	 * @param {jQuery} $element - The jQuery element to start the transition on.
	 * @param {(string|FooUtils.transition~startCallback)} classNameOrFunc - One or more class names (separated by spaces) to be toggled or a function that performs the required actions to start the transition.
	 * @param {boolean} [state] - A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
	 * @param {number} [timeout] - The maximum time, in milliseconds, to wait for the `transitionend` event to be raised. If not provided this will be automatically set to the elements `transition-duration` property plus an extra 50 milliseconds.
	 * @returns {Promise}
	 * @description This method lets us use CSS transitions by toggling a class and using the `transitionend` event to perform additional actions once the transition has completed across all browsers. In browsers that do not support transitions this method would behave the same as if just calling jQuery's `.toggleClass` method.
	 *
	 * The last parameter `timeout` is used to create a timer that behaves as a safety net in case the `transitionend` event is never raised and ensures the deferred returned by this method is resolved or rejected within a specified time.
	 * @see {@link https://developer.mozilla.org/en/docs/Web/CSS/transition-duration|transition-duration - CSS | MDN} for more information on the `transition-duration` CSS property.
	 */
	_.transition.start = function($element, classNameOrFunc, state, timeout){
		var deferred = $.Deferred(), promise = deferred.promise();

		$element = $element.first();

		if (_.transition.supported){
			$element.prop('offsetTop');
			var safety = $element.data('transition_safety');
			if (_is.hash(safety) && _is.number(safety.timer)){
				clearTimeout(safety.timer);
				$element.removeData('transition_safety').off(_.transition.end + '.utils');
				safety.deferred.reject();
			}
			timeout = _is.number(timeout) ? timeout : _.transition.duration($element) + 50;
			safety = {
				deferred: deferred,
				timer: setTimeout(function(){
					// This is the safety net in case a transition fails for some reason and the transitionend event is never raised.
					// This will remove the bound event and resolve the deferred
					$element.removeData('transition_safety').off(_.transition.end + '.utils');
					deferred.resolve();
				}, timeout)
			};
			$element.data('transition_safety', safety);

			$element.on(_.transition.end + '.utils', function(e){
				if ($element.is(e.target)){
					clearTimeout(safety.timer);
					$element.removeData('transition_safety').off(_.transition.end + '.utils');
					deferred.resolve();
				}
			});
		}

		_animation.requestFrame(function() {
			if (_is.fn(classNameOrFunc)){
				classNameOrFunc.apply($element.get(0), [$element]);
			} else {
				$element.toggleClass(classNameOrFunc, state);
			}
			if (!_.transition.supported){
				// If the browser doesn't support transitions then just resolve the deferred
				deferred.resolve();
			}
		});

		return promise;
	};

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is,
	FooUtils.animation
);
(function ($, _, _is, _obj, _fn) {
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary A base class providing some helper methods for prototypal inheritance.
	 * @memberof FooUtils.
	 * @constructs Class
	 * @description This is a base class for making prototypal inheritance simpler to work with. It provides an easy way to inherit from another class and exposes a `_super` method within the scope of any overriding methods that allows a simple way to execute the overridden function.
	 *
	 * Have a look at the {@link FooUtils.Class.extend|extend} and {@link FooUtils.Class.override|override} method examples to see some basic usage.
	 * @example {@caption When using this base class the actual construction of a class is performed by the `construct` method.}
	 * var MyClass = FooUtils.Class.extend({
	 * 	construct: function(arg1, arg2){
	 * 		// handle the construction logic here
	 * 	}
	 * });
	 *
	 * // use the class
	 * var myClass = new MyClass( "arg1:value", "arg2:value" );
	 */
	_.Class = function(){};

	/**
	 * @ignore
	 * @summary The original function when within the scope of an overriding method.
	 * @memberof FooUtils.Class#
	 * @function _super
	 * @param {...*} [argN] - The same arguments as the base method.
	 * @returns {*} The result of the base method.
	 * @description This is only available within the scope of an overriding method if it was created using the {@link FooUtils.Class.extend|extend}, {@link FooUtils.Class.override|override} or {@link FooUtils.fn.addOrOverride} methods.
	 * @see {@link FooUtils.fn.addOrOverride} to see an example of how this property is used.
	 */

	/**
	 * @summary Creates a new class that inherits from this one which in turn allows itself to be extended.
	 * @memberof FooUtils.Class.
	 * @function extend
	 * @param {Object} [definition] - An object containing any methods to implement/override.
	 * @returns {function} A new class that inherits from the base class.
	 * @description Every class created using this method has both the {@link FooUtils.Class.extend|extend} and {@link FooUtils.Class.override|override} static methods added to it to allow it to be extended.
	 * @example {@caption The below shows an example of how to implement inheritance using this method.}{@run true}
	 * // create a base Person class
	 * var Person = FooUtils.Class.extend({
	 * 	construct: function(isDancing){
	 * 		this.dancing = isDancing;
	 * 	},
	 * 	dance: function(){
	 * 		return this.dancing;
	 * 	}
	 * });
	 *
	 * var Ninja = Person.extend({
	 * 	construct: function(){
	 * 		// Call the inherited version of construct()
	 * 		this._super( false );
	 * 	},
	 * 	dance: function(){
	 * 		// Call the inherited version of dance()
	 * 		return this._super();
	 * 	},
	 * 	swingSword: function(){
	 * 		return true;
	 * 	}
	 * });
	 *
	 * var p = new Person(true);
	 * console.log( p.dance() ); // => true
	 *
	 * var n = new Ninja();
	 * console.log( n.dance() ); // => false
	 * console.log( n.swingSword() ); // => true
	 * console.log(
	 * 	p instanceof Person && p.constructor === Person && p instanceof FooUtils.Class
	 * 	&& n instanceof Ninja && n.constructor === Ninja && n instanceof Person && n instanceof FooUtils.Class
	 * ); // => true
	 */
	_.Class.extend = function(definition){
		definition = _is.hash(definition) ? definition : {};
		var proto = _obj.create(this.prototype); // create a new prototype to work with so we don't modify the original
		// iterate over all properties in the supplied definition and update the prototype
		for (var name in definition) {
			if (!definition.hasOwnProperty(name)) continue;
			_fn.addOrOverride(proto, name, definition[name]);
		}
		// if no construct method is defined add a default one that does nothing
		proto.construct = _is.fn(proto.construct) ? proto.construct : function(){};

		// create the new class using the prototype made above
		function Class() {
			if (!_is.fn(this.construct))
				throw new SyntaxError('FooUtils.Class objects must be constructed with the "new" keyword.');
			this.construct.apply(this, arguments);
		}
		Class.prototype = proto;
		//noinspection JSUnresolvedVariable
		Class.prototype.constructor = _is.fn(proto.__ctor__) ? proto.__ctor__ : Class;
		Class.extend = _.Class.extend;
		Class.override = _.Class.override;
		Class.bases = _.Class.bases;
		Class.__base__ = this;
		return Class;
	};

	/**
	 * @summary Overrides a single method on this class.
	 * @memberof FooUtils.Class.
	 * @function override
	 * @param {string} name - The name of the function to override.
	 * @param {function} fn - The new function to override with, the `_super` method will be made available within this function.
	 * @description This is a helper method for overriding a single function of a {@link FooUtils.Class} or one of its child classes. This uses the {@link FooUtils.fn.addOrOverride} method internally and simply provides the correct prototype.
	 * @example {@caption The below example wraps the `Person.prototype.dance` method with a new one that inverts the result. Note the override applies even to instances of the class that are already created.}{@run true}
	 * var Person = FooUtils.Class.extend({
	 *   construct: function(isDancing){
	 *     this.dancing = isDancing;
	 *   },
	 *   dance: function(){
	 *     return this.dancing;
	 *   }
	 * });
	 *
	 * var p = new Person(true);
	 * console.log( p.dance() ); // => true
	 *
	 * Person.override("dance", function(){
	 * 	// Call the original version of dance()
	 * 	return !this._super();
	 * });
	 *
	 * console.log( p.dance() ); // => false
	 */
	_.Class.override = function(name, fn){
		_fn.addOrOverride(this.prototype, name, fn);
	};

	/**
	 * @summary The base class for this class.
	 * @memberof FooUtils.Class.
	 * @name __base__
	 * @type {?FooUtils.Class}
	 * @private
	 */
	_.Class.__base__ = null;

	/**
	 * @summary Get an array of all base classes for this class.
	 * @memberof FooUtils.Class.
	 * @function bases
	 * @returns {FooUtils.Class[]}
	 */
	_.Class.bases = function(){
		function _get(klass, result){
			if (!_is.array(result)) result = [];
			if (_is.fn(klass) && klass.__base__ !== null){
				result.unshift(klass.__base__);
				return _get(klass.__base__, result);
			}
			return result;
		}
		var initial = [];
		return _get(this, initial);
	};
})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is,
	FooUtils.obj,
	FooUtils.fn
);
(function (_, _is, _str) {
    // only register methods if this version is the current version
    if (_.version !== '0.2.0') return;

    /**
     * @summary A base event class providing just a type and defaultPrevented properties.
     * @memberof FooUtils.
     * @class Event
     * @param {string} type - The type for this event.
     * @augments FooUtils.Class
     * @borrows FooUtils.Class.extend as extend
     * @borrows FooUtils.Class.override as override
     * @description This is a very basic event class that is used internally by the {@link FooUtils.EventClass#trigger} method when the first parameter supplied is simply the event name.
     *
     * To trigger your own custom event you will need to inherit from this class and then supply the instantiated event object as the first parameter to the {@link FooUtils.EventClass#trigger} method.
     * @example {@caption The following shows how to use this class to create a custom event.}
     * var MyEvent = FooUtils.Event.extend({
     * 	construct: function(type, customProp){
     * 	    this._super(type);
     * 	    this.myCustomProp = customProp;
     * 	}
     * });
     *
     * // to use the class you would then instantiate it and pass it as the first argument to a FooUtils.EventClass's trigger method
     * var eventClass = ...; // any class inheriting from FooUtils.EventClass
     * var event = new MyEvent( "my-event-type", true );
     * eventClass.trigger(event);
     */
    _.Event = _.Class.extend(/** @lends FooUtils.Event.prototype */{
        /**
         * @ignore
         * @constructs
         * @param {string} type
         **/
        construct: function(type){
            if (_is.empty(type))
                throw new SyntaxError('FooUtils.Event objects must be supplied a `type`.');

            var self = this, parsed = _.Event.parse(type);
            /**
             * @summary The type of event.
             * @memberof FooUtils.Event#
             * @name type
             * @type {string}
             * @readonly
             */
            self.type = parsed.type;
            /**
             * @summary The namespace of the event.
             * @memberof FooUtils.Event#
             * @name namespace
             * @type {string}
             * @readonly
             */
            self.namespace = parsed.namespace;
            /**
             * @summary Whether the default action should be taken or not.
             * @memberof FooUtils.Event#
             * @name defaultPrevented
             * @type {boolean}
             * @readonly
             */
            self.defaultPrevented = false;
            /**
             * @summary The original {@link FooUtils.EventClass} that triggered this event.
             * @memberof FooUtils.Event#
             * @name target
             * @type {FooUtils.EventClass}
             */
            self.target = null;
        },
        /**
         * @summary Informs the class that raised this event that its default action should not be taken.
         * @memberof FooUtils.Event#
         * @function preventDefault
         */
        preventDefault: function(){
            this.defaultPrevented = true;
        },
        /**
         * @summary Gets whether the default action should be taken or not.
         * @memberof FooUtils.Event#
         * @function isDefaultPrevented
         * @returns {boolean}
         */
        isDefaultPrevented: function(){
            return this.defaultPrevented;
        }
    });

    /**
     * @summary Parse the provided event string into a type and namespace.
     * @memberof FooUtils.Event.
     * @function parse
     * @param {string} event - The event to parse.
     * @returns {{namespaced: boolean, type: string, namespace: string}} Returns an object containing the type and namespace for the event.
     */
    _.Event.parse = function(event){
        event = _is.string(event) && !_is.empty(event) ? event : null;
        var namespaced = _str.contains(event, ".");
        return {
            namespaced: namespaced,
            type: namespaced ? _str.startsWith(event, ".") ? null : _str.until(event, ".") : event,
            namespace: namespaced ? _str.from(event, ".") : null
        };
    };

    /**
     * @summary A base class that implements a basic events interface.
     * @memberof FooUtils.
     * @class EventClass
     * @augments FooUtils.Class
     * @borrows FooUtils.Class.extend as extend
     * @borrows FooUtils.Class.override as override
     * @description This is a very basic events implementation that provides just enough to cover most needs.
     */
    _.EventClass = _.Class.extend(/** @lends FooUtils.EventClass.prototype */{
        /**
         * @ignore
         * @constructs
         **/
        construct: function(){
            /**
             * @summary An object containing all the required info to execute a listener.
             * @typedef {Object} FooUtils.EventClass~RegisteredListener
             * @property {string} namespace - The namespace for the listener.
             * @property {function} fn - The callback function for the listener.
             * @property {*} thisArg - The `this` value to execute the callback with.
             */

            /**
             * @summary An object containing a mapping of events to listeners.
             * @typedef {Object.<string, Array<FooUtils.EventClass~RegisteredListener>>} FooUtils.EventClass~RegisteredEvents
             */

            /**
             * @summary The object used to register event handlers.
             * @memberof FooUtils.EventClass#
             * @name events
             * @type {FooUtils.EventClass~RegisteredEvents}
             */
            this.events = {};
        },
        /**
         * @summary Destroy the current instance releasing used resources.
         * @memberof FooUtils.EventClass#
         * @function destroy
         */
        destroy: function(){
            this.events = {};
        },
        /**
         * @summary Attach multiple event listeners to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {Object.<string, function>} events - An object containing event types to listener mappings.
         * @param {*} [thisArg] - The value of `this` within the listeners. Defaults to the class raising the event.
         * @returns {this}
         *//**
         * @summary Attach an event listener for one or more events to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {string} events - One or more space-separated event types.
         * @param {function} listener - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
         * @returns {this}
         */
        on: function(events, listener, thisArg){
            var self = this;
            if (_is.object(events)){
                thisArg = listener;
                Object.keys(events).forEach(function(key){
                    if (_is.fn(events[key])){
                        key.split(" ").forEach(function(type){
                            self.addListener(type, events[key], thisArg);
                        });
                    }
                });
            } else if (_is.string(events) && _is.fn(listener)) {
                events.split(" ").forEach(function(type){
                    self.addListener(type, listener, thisArg);
                });
            }

            return self;
        },
        /**
         * @summary Adds a single event listener to the current class.
         * @memberof FooUtils.EventClass#
         * @function addListener
         * @param {string} event - The event type, this can not contain any whitespace.
         * @param {function} listener - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
         * @returns {boolean} Returns `true` if added.
         */
        addListener: function(event, listener, thisArg){
            if (!_is.string(event) || /\s/.test(event) || !_is.fn(listener)) return false;

            var self = this, parsed = _.Event.parse(event);
            thisArg = _is.undef(thisArg) ? self : thisArg;

            if (!_is.array(self.events[parsed.type])){
                self.events[parsed.type] = [];
            }
            var exists = self.events[parsed.type].some(function(h){
                return h.namespace === parsed.namespace && h.fn === listener && h.thisArg === thisArg;
            });
            if (!exists){
                self.events[parsed.type].push({
                    namespace: parsed.namespace,
                    fn: listener,
                    thisArg: thisArg
                });
                return true;
            }
            return false;
        },
        /**
         * @summary Remove multiple event listeners from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {Object.<string, function>} events - An object containing event types to listener mappings.
         * @param {*} [thisArg] - The value of `this` within the `listener` function. Defaults to the class raising the event.
         * @returns {this}
         *//**
         * @summary Remove an event listener from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {string} events - One or more space-separated event types.
         * @param {function} listener - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
         * @returns {this}
         */
        off: function(events, listener, thisArg){
            var self = this;
            if (_is.object(events)){
                thisArg = listener;
                Object.keys(events).forEach(function(key){
                    key.split(" ").forEach(function(type){
                        self.removeListener(type, events[key], thisArg);
                    });
                });
            } else if (_is.string(events)) {
                events.split(" ").forEach(function(type){
                    self.removeListener(type, listener, thisArg);
                });
            }

            return self;
        },
        /**
         * @summary Removes a single event listener from the current class.
         * @memberof FooUtils.EventClass#
         * @function removeListener
         * @param {string} event - The event type, this can not contain any whitespace.
         * @param {function} [listener] - The listener registered to the event type.
         * @param {*} [thisArg] - The value of `this` registered for the `listener`. Defaults to the class raising the event.
         * @returns {boolean} Returns `true` if removed.
         */
        removeListener: function(event, listener, thisArg){
            if (!_is.string(event) || /\s/.test(event)) return false;

            var self = this, parsed = _.Event.parse(event), types = [];
            thisArg = _is.undef(thisArg) ? self : thisArg;

            if (!_is.empty(parsed.type)){
                types.push(parsed.type);
            } else if (!_is.empty(parsed.namespace)){
                types.push.apply(types, Object.keys(self.events));
            }

            types.forEach(function(type){
                if (!_is.array(self.events[type])) return;
                self.events[type] = self.events[type].filter(function (h) {
                    if (listener != null){
                        return !(h.namespace === parsed.namespace && h.fn === listener && h.thisArg === thisArg);
                    }
                    if (parsed.namespace != null){
                        return h.namespace !== parsed.namespace;
                    }
                    return false;
                });
                if (self.events[type].length === 0){
                    delete self.events[type];
                }
            });
            return true;
        },
        /**
         * @summary Trigger an event on the current class.
         * @memberof FooUtils.EventClass#
         * @function trigger
         * @param {(string|FooUtils.Event)} event - Either a space-separated string of event types or a custom event object to raise.
         * @param {Array} [args] - An array of additional arguments to supply to the listeners after the event object.
         * @returns {(FooUtils.Event|FooUtils.Event[]|null)} Returns the {@link FooUtils.Event|event object} of the triggered event. If more than one event was triggered an array of {@link FooUtils.Event|event objects} is returned. If no `event` was supplied or triggered `null` is returned.
         */
        trigger: function(event, args){
            args = _is.array(args) ? args : [];
            var self = this, result = [];
            if (event instanceof _.Event){
                result.push(event);
                self.emit(event, args);
            } else if (_is.string(event)) {
                event.split(" ").forEach(function(type){
                    var e = new _.Event(type);
                    result.push(e)
                    self.emit(e, args);
                });
            }
            return _is.empty(result) ? null : (result.length === 1 ? result[0] : result);
        },
        /**
         * @summary Emits the supplied event on the current class.
         * @memberof FooUtils.EventClass#
         * @function emit
         * @param {FooUtils.Event} event - The event object to emit.
         * @param {Array} [args] - An array of additional arguments to supply to the listener after the event object.
         */
        emit: function(event, args){
            if (!(event instanceof FooUtils.Event)) return;
            var self = this;
            args = _is.array(args) ? args : [];
            if (event.target === null) event.target = self;
            if (_is.array(self.events[event.type])) {
                self.events[event.type].forEach(function (h) {
                    if (event.namespace != null && h.namespace !== event.namespace) return;
                    h.fn.apply(h.thisArg, [event].concat(args));
                });
            }
            if (_is.array(self.events["__all__"])){
                self.events["__all__"].forEach(function (h) {
                    h.fn.apply(h.thisArg, [event].concat(args));
                });
            }
        }
    });

})(
    // dependencies
    FooUtils,
    FooUtils.is,
    FooUtils.str
);
(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary A simple bounding rectangle class.
	 * @memberof FooUtils.
	 * @class Bounds
	 * @augments FooUtils.Class
	 * @borrows FooUtils.Class.extend as extend
	 * @borrows FooUtils.Class.override as override
	 */
	_.Bounds = _.Class.extend(/** @lends FooUtils.Bounds.prototype */{
		/**
		 * @ignore
		 * @constructs
		 **/
		construct: function(){
			var self = this;
			/**
			 * @summary The top position.
			 * @memberof FooUtils.Bounds#
			 * @name top
			 * @type {number}
			 */
			self.top = 0;
			/**
			 * @summary The right position.
			 * @memberof FooUtils.Bounds#
			 * @name right
			 * @type {number}
			 */
			self.right = 0;
			/**
			 * @summary The bottom position.
			 * @memberof FooUtils.Bounds#
			 * @name bottom
			 * @type {number}
			 */
			self.bottom = 0;
			/**
			 * @summary The left position.
			 * @memberof FooUtils.Bounds#
			 * @name left
			 * @type {number}
			 */
			self.left = 0;
			/**
			 * @summary The width of the rectangle described by the position properties.
			 * @memberof FooUtils.Bounds#
			 * @name width
			 * @type {number}
			 */
			self.width = 0;
			/**
			 * @summary The height of the rectangle described by the position properties.
			 * @memberof FooUtils.Bounds#
			 * @name height
			 * @type {number}
			 */
			self.height = 0;
		},
		/**
		 * @summary Inflate the bounds by the specified amount.
		 * @memberof FooUtils.Bounds#
		 * @function inflate
		 * @param {number} amount - A positive number will expand the bounds while a negative one will shrink it.
		 * @returns {FooUtils.Bounds}
		 */
		inflate: function(amount){
			var self = this;
			if (_is.number(amount)){
				self.top -= amount;
				self.right += amount;
				self.bottom += amount;
				self.left -= amount;
				self.width += amount * 2;
				self.height += amount * 2;
			}
			return self;
		},
		/**
		 * @summary Checks if the supplied bounds object intersects with this one.
		 * @memberof FooUtils.Bounds#
		 * @function intersects
		 * @param {FooUtils.Bounds} bounds - The bounds to check.
		 * @returns {boolean}
		 */
		intersects: function(bounds){
			var self = this;
			return self.left <= bounds.right && bounds.left <= self.right && self.top <= bounds.bottom && bounds.top <= self.bottom;
		}
	});

	var __$window;
	/**
	 * @summary Gets the bounding rectangle of the current viewport.
	 * @memberof FooUtils.
	 * @function getViewportBounds
	 * @param {number} [inflate] - An amount to inflate the bounds by. A positive number will expand the bounds outside of the visible viewport while a negative one would shrink it.
	 * @returns {FooUtils.Bounds}
	 */
	_.getViewportBounds = function(inflate){
		if (!__$window) __$window = $(window);
		var bounds = new _.Bounds();
		bounds.top = __$window.scrollTop();
		bounds.left = __$window.scrollLeft();
		bounds.width = __$window.width();
		bounds.height = __$window.height();
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		bounds.inflate(inflate);
		return bounds;
	};

	/**
	 * @summary Get the bounding rectangle for the supplied element.
	 * @memberof FooUtils.
	 * @function getElementBounds
	 * @param {(jQuery|HTMLElement|string)} element - The jQuery wrapper around the element, the element itself, or a CSS selector to retrieve the element with.
	 * @returns {FooUtils.Bounds}
	 */
	_.getElementBounds = function(element){
		if (!_is.jq(element)) element = $(element);
		var bounds = new _.Bounds();
		if (element.length !== 0){
			var offset = element.offset();
			bounds.top = offset.top;
			bounds.left = offset.left;
			bounds.width = element.width();
			bounds.height = element.height();
		}
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		return bounds;
	};

})(
	FooUtils.$,
	FooUtils,
	FooUtils.is
);
(function($, _, _is, _fn, _obj){
    // only register methods if this version is the current version
    if (_.version !== '0.2.0') return;

    /**
     * @summary A simple timer that triggers events.
     * @memberof FooUtils.
     * @class Timer
     * @param {number} [interval=1000] - The internal tick interval of the timer.
     */
    _.Timer = _.EventClass.extend(/** @lends FooUtils.Timer */{
        /**
         * @ignore
         * @constructs
         * @param {number} [interval=1000]
         */
        construct: function(interval){
            this._super();
            /**
             * @summary The internal tick interval of the timer in milliseconds.
             * @memberof FooUtils.Timer#
             * @name interval
             * @type {number}
             * @default 1000
             * @readonly
             */
            this.interval = _is.number(interval) ? interval : 1000;
            /**
             * @summary Whether the timer is currently running or not.
             * @memberof FooUtils.Timer#
             * @name isRunning
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.isRunning = false;
            /**
             * @summary Whether the timer is currently paused or not.
             * @memberof FooUtils.Timer#
             * @name isPaused
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.isPaused = false;
            /**
             * @summary Whether the timer can resume from a previous state or not.
             * @memberof FooUtils.Timer#
             * @name canResume
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.canResume = false;
            /**
             * @summary Whether the timer can restart or not.
             * @memberof FooUtils.Timer#
             * @name canRestart
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.canRestart = false;
            /**
             * @summary The internal tick timeout ID.
             * @memberof FooUtils.Timer#
             * @name __timeout
             * @type {?number}
             * @default null
             * @private
             */
            this.__timeout = null;
            /**
             * @summary Whether the timer is incrementing or decrementing.
             * @memberof FooUtils.Timer#
             * @name __decrement
             * @type {boolean}
             * @default false
             * @private
             */
            this.__decrement = false;
            /**
             * @summary The total time for the timer.
             * @memberof FooUtils.Timer#
             * @name __time
             * @type {number}
             * @default 0
             * @private
             */
            this.__time = 0;
            /**
             * @summary The remaining time for the timer.
             * @memberof FooUtils.Timer#
             * @name __remaining
             * @type {number}
             * @default 0
             * @private
             */
            this.__remaining = 0;
            /**
             * @summary The current time for the timer.
             * @memberof FooUtils.Timer#
             * @name __current
             * @type {number}
             * @default 0
             * @private
             */
            this.__current = 0;
            /**
             * @summary The final time for the timer.
             * @memberof FooUtils.Timer#
             * @name __finish
             * @type {number}
             * @default 0
             * @private
             */
            this.__finish = 0;
            /**
             * @summary The last arguments supplied to the {@link FooUtils.Timer#start|start} method.
             * @memberof FooUtils.Timer#
             * @name __restart
             * @type {Array}
             * @default []
             * @private
             */
            this.__restart = [];
        },
        /**
         * @summary Resets the timer back to a fresh starting state.
         * @memberof FooUtils.Timer#
         * @function __reset
         * @private
         */
        __reset: function(){
            clearTimeout(this.__timeout);
            this.__timeout = null;
            this.__decrement = false;
            this.__time = 0;
            this.__remaining = 0;
            this.__current = 0;
            this.__finish = 0;
            this.isRunning = false;
            this.isPaused = false;
            this.canResume = false;
        },
        /**
         * @summary Generates event args to be passed to listeners of the timer events.
         * @memberof FooUtils.Timer#
         * @function __eventArgs
         * @param {...*} [args] - Any number of additional arguments to pass to an event listener.
         * @return {Array} - The first 3 values of the result will always be the current time, the total time and boolean indicating if the timer is decremental.
         * @private
         */
        __eventArgs: function(args){
            return [
                this.__current,
                this.__time,
                this.__decrement
            ].concat(_fn.arg2arr(arguments));
        },
        /**
         * @summary Performs the tick for the timer checking and modifying the various internal states.
         * @memberof FooUtils.Timer#
         * @function __tick
         * @private
         */
        __tick: function(){
            var self = this;
            self.trigger("tick", self.__eventArgs());
            if (self.__current === self.__finish){
                self.trigger("complete", self.__eventArgs());
                self.__reset();
            } else {
                if (self.__decrement){
                    self.__current--;
                } else {
                    self.__current++;
                }
                self.__remaining--;
                self.canResume = self.__remaining > 0;
                self.__timeout = setTimeout(function () {
                    self.__tick();
                }, self.interval);
            }
        },
        /**
         * @summary Starts the timer using the supplied `time` and whether or not to increment or decrement from the value.
         * @memberof FooUtils.Timer#
         * @function start
         * @param {number} time - The total time in seconds for the timer.
         * @param {boolean} [decrement=false] - Whether the timer should increment or decrement from or to the supplied time.
         */
        start: function(time, decrement){
            var self = this;
            if (self.isRunning) return;
            decrement = _is.boolean(decrement) ? decrement : false;
            self.__restart = [time, decrement];
            self.__decrement = decrement;
            self.__time = time;
            self.__remaining = time;
            self.__current = decrement ? time : 0;
            self.__finish = decrement ? 0 : time;
            self.canRestart = true;
            self.isRunning = true;
            self.isPaused = false;
            self.trigger("start", self.__eventArgs());
            self.__tick();
        },
        /**
         * @summary Starts the timer counting down to `0` from the supplied `time`.
         * @memberof FooUtils.Timer#
         * @function countdown
         * @param {number} time - The total time in seconds for the timer.
         */
        countdown: function(time){
            this.start(time, true);
        },
        /**
         * @summary Starts the timer counting up from `0` to the supplied `time`.
         * @memberof FooUtils.Timer#
         * @function countup
         * @param {number} time - The total time in seconds for the timer.
         */
        countup: function(time){
            this.start(time, false);
        },
        /**
         * @summary Stops and then restarts the timer using the last arguments supplied to the {@link FooUtils.Timer#start|start} method.
         * @memberof FooUtils.Timer#
         * @function restart
         */
        restart: function(){
            this.stop();
            if (this.canRestart){
                this.start.apply(this, this.__restart);
            }
        },
        /**
         * @summary Stops the timer.
         * @memberof FooUtils.Timer#
         * @function stop
         */
        stop: function(){
            if (this.isRunning || this.isPaused){
                this.__reset();
                this.trigger("stop", this.__eventArgs());
            }
        },
        /**
         * @summary Pauses the timer and returns the remaining seconds.
         * @memberof FooUtils.Timer#
         * @function pause
         * @return {number} - The number of seconds remaining for the timer.
         */
        pause: function(){
            var self = this;
            if (self.__timeout != null){
                clearTimeout(self.__timeout);
                self.__timeout = null;
            }
            if (self.isRunning){
                self.isRunning = false;
                self.isPaused = true;
                self.trigger("pause", self.__eventArgs());
            }
            return self.__remaining;
        },
        /**
         * @summary Resumes the timer from a previously paused state.
         * @memberof FooUtils.Timer#
         * @function resume
         */
        resume: function(){
            var self = this;
            if (self.canResume){
                self.isRunning = true;
                self.isPaused = false;
                self.trigger("resume", self.__eventArgs());
                self.__tick();
            }
        },
        /**
         * @summary Resets the timer back to a fresh starting state.
         * @memberof FooUtils.Timer#
         * @function reset
         */
        reset: function(){
            this.__reset();
            this.trigger("reset", this.__eventArgs());
        }
    });

})(
    FooUtils.$,
    FooUtils,
    FooUtils.is,
    FooUtils.fn,
    FooUtils.obj
);

(function($, _, _is, _fn){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	/**
	 * @summary A factory for classes allowing them to be registered and created using a friendly name.
	 * @memberof FooUtils.
	 * @class Factory
	 * @description This class allows other classes to register themselves for use at a later time. Depending on how you intend to use the registered classes you can also specify a load and execution order through the `priority` parameter of the {@link FooUtils.Factory#register|register} method.
	 * @augments FooUtils.Class
	 * @borrows FooUtils.Class.extend as extend
	 * @borrows FooUtils.Class.override as override
	 */
	_.Factory = _.Class.extend(/** @lends FooUtils.Factory.prototype */{
		/**
		 * @ignore
		 * @constructs
		 **/
		construct: function(){
			/**
			 * @summary An object containing all the required info to create a new instance of a registered class.
			 * @typedef {Object} FooUtils.Factory~RegisteredClass
			 * @property {string} name - The friendly name of the registered class.
			 * @property {function} klass - The constructor for the registered class.
			 * @property {number} priority - The priority for the registered class.
			 */

			/**
			 * @summary An object containing all registered classes.
			 * @memberof FooUtils.Factory#
			 * @name registered
			 * @type {Object.<string, FooUtils.Factory~RegisteredClass>}
			 * @readonly
			 * @example {@caption The following shows the structure of this object. The `<name>` placeholders would be the name the class was registered with.}
			 * {
			 * 	"<name>": {
			 * 		"name": <string>,
			 * 		"klass": <function>,
			 * 		"priority": <number>
			 * 	},
			 * 	"<name>": {
			 * 		"name": <string>,
			 * 		"klass": <function>,
			 * 		"priority": <number>
			 * 	},
			 * 	...
			 * }
			 */
			this.registered = {};
		},
		/**
		 * @summary Checks if the factory contains a class registered using the supplied `name`.
		 * @memberof FooUtils.Factory#
		 * @function contains
		 * @param {string} name - The name of the class to check.
		 * @returns {boolean}
		 * @example {@run true}
		 * // create a new instance of the factory, this is usually exposed by the class that will be using the factory.
		 * var factory = new FooUtils.Factory();
		 *
		 * // create a class to register
		 * function Test(){}
		 *
		 * // register the class with the factory with the default priority
		 * factory.register( "test", Test );
		 *
		 * // test if the class was registered
		 * console.log( factory.contains( "test" ) ); // => true
		 */
		contains: function(name){
			return !_is.undef(this.registered[name]);
		},
		/**
		 * @summary Creates new instances of all registered classes using there registered priority and the supplied arguments.
		 * @memberof FooUtils.Factory#
		 * @function load
		 * @param {Object.<string, (function|string)>} overrides - An object containing classes to override any matching registered classes with, if no overrides are required you can pass `false` or `null`.
		 * @param {*} arg1 - The first argument to supply when creating new instances of all registered classes.
		 * @param {...*} [argN] - Any number of additional arguments to supply when creating new instances of all registered classes.
		 * @returns {Array.<Object>} An array containing new instances of all registered classes.
		 * @description The class indexes within the result array are determined by the `priority` they were registered with, the higher the `priority` the lower the index.
		 *
		 * This method is designed to be used when all registered classes share a common interface or base type and constructor arguments.
		 * @example {@caption The following loads all registered classes into an array ordered by there priority.}{@run true}
		 * // create a new instance of the factory, this is usually exposed by the class that will be using the factory.
		 * var factory = new FooUtils.Factory();
		 *
		 * // create a base Extension class
		 * var Extension = FooUtils.Class.extend({
		 * 	construct: function( type, options ){
		 * 		this.type = type;
		 * 		this.options = options;
		 * 	},
		 * 	getType: function(){
		 * 		return this.type;
		 * 	}
		 * });
		 *
		 * // create various item, this would usually be in another file
		 * var MyExtension1 = Extension.extend({
		 * 	construct: function(options){
		 * 		this._super( "my-extension-1", options );
		 * 	}
		 * });
		 * factory.register( "my-extension-1", MyExtension1, 0 );
		 *
		 * // create various item, this would usually be in another file
		 * var MyExtension2 = Extension.extend({
		 * 	construct: function(options){
		 * 		this._super( "my-extension-2", options );
		 * 	}
		 * });
		 * factory.register( "my-extension-2", MyExtension2, 1 );
		 *
		 * // load all registered classes according to there priority passing the options to all constructors
		 * var loaded = factory.load( null, {"something": true} );
		 *
		 * // only two classes should be loaded
		 * console.log( loaded.length ); // => 2
		 *
		 * // the MyExtension2 class is loaded first due to it's priority being higher than the MyExtension1 class.
		 * console.log( loaded[0] instanceof MyExtension2 && loaded[0] instanceof Extension ); // => true
		 * console.log( loaded[1] instanceof MyExtension1 && loaded[1] instanceof Extension ); // => true
		 *
		 * // do something with the loaded classes
		 * @example {@caption The following loads all registered classes into an array ordered by there priority but uses the overrides parameter to swap out one of them for a custom implementation.}{@run true}
		 * // create a new instance of the factory, this is usually exposed by the class that will be using the factory.
		 * var factory = new FooUtils.Factory();
		 *
		 * // create a base Extension class
		 * var Extension = FooUtils.Class.extend({
		 * 	construct: function( type, options ){
		 * 		this.type = type;
		 * 		this.options = options;
		 * 	},
		 * 	getType: function(){
		 * 		return this.type;
		 * 	}
		 * });
		 *
		 * // create a new extension, this would usually be in another file
		 * var MyExtension1 = Extension.extend({
		 * 	construct: function(options){
		 * 		this._super( "my-extension-1", options );
		 * 	}
		 * });
		 * factory.register( "my-extension-1", MyExtension1, 0 );
		 *
		 * // create a new extension, this would usually be in another file
		 * var MyExtension2 = Extension.extend({
		 * 	construct: function(options){
		 * 		this._super( "my-extension-2", options );
		 * 	}
		 * });
		 * factory.register( "my-extension-2", MyExtension2, 1 );
		 *
		 * // create a custom extension that is not registered but overrides the default "my-extension-1"
		 * var UpdatedMyExtension1 = MyExtension1.extend({
		 * 	construct: function(options){
		 * 		this._super( options );
		 * 		// do something different to the original MyExtension1 class
		 * 	}
		 * });
		 *
		 * // load all registered classes but swaps out the registered "my-extension-1" for the supplied override.
		 * var loaded = factory.load( {"my-extension-1": UpdatedMyExtension1}, {"something": true} );
		 *
		 * // only two classes should be loaded
		 * console.log( loaded.length ); // => 2
		 *
		 * // the MyExtension2 class is loaded first due to it's priority being higher than the UpdatedMyExtension1 class which inherited a priority of 0.
		 * console.log( loaded[0] instanceof MyExtension2 && loaded[0] instanceof Extension ); // => true
		 * console.log( loaded[1] instanceof UpdatedMyExtension1 && loaded[1] instanceof MyExtension1 && loaded[1] instanceof Extension ); // => true
		 *
		 * // do something with the loaded classes
		 */
		load: function(overrides, arg1, argN){
			var self = this,
				args = _fn.arg2arr(arguments),
				reg = [],
				loaded = [],
				name, klass;

			overrides = args.shift() || {};
			for (name in self.registered){
				if (!self.registered.hasOwnProperty(name)) continue;
				var component = self.registered[name];
				if (overrides.hasOwnProperty(name)){
					klass = overrides[name];
					if (_is.string(klass)) klass = _fn.fetch(overrides[name]);
					if (_is.fn(klass)){
						component = {name: name, klass: klass, priority: self.registered[name].priority};
					}
				}
				reg.push(component);
			}

			for (name in overrides){
				if (!overrides.hasOwnProperty(name) || self.registered.hasOwnProperty(name)) continue;
				klass = overrides[name];
				if (_is.string(klass)) klass = _fn.fetch(overrides[name]);
				if (_is.fn(klass)){
					reg.push({name: name, klass: klass, priority: 0});
				}
			}

			reg.sort(function(a, b){ return b.priority - a.priority; });
			$.each(reg, function(i, r){
				if (_is.fn(r.klass)){
					loaded.push(_fn.apply(r.klass, args));
				}
			});
			return loaded;
		},
		/**
		 * @summary Create a new instance of a class registered with the supplied `name` and arguments.
		 * @memberof FooUtils.Factory#
		 * @function make
		 * @param {string} name - The name of the class to create.
		 * @param {*} arg1 - The first argument to supply to the new instance.
		 * @param {...*} [argN] - Any number of additional arguments to supply to the new instance.
		 * @returns {Object}
		 * @example {@caption The following shows how to create a new instance of a registered class.}{@run true}
		 * // create a new instance of the factory, this is usually done by the class that will be using it.
		 * var factory = new FooUtils.Factory();
		 *
		 * // create a Logger class to register, this would usually be in another file
		 * var Logger = FooUtils.Class.extend({
		 * 	write: function( message ){
		 * 		console.log( "Logger#write: " + message );
		 * 	}
		 * });
		 *
		 * factory.register( "logger", Logger );
		 *
		 * // create a new instances of the class registered as "logger"
		 * var logger = factory.make( "logger" );
		 * logger.write( "My message" ); // => "Logger#write: My message"
		 */
		make: function(name, arg1, argN){
			var self = this, args = _fn.arg2arr(arguments), reg;
			name = args.shift();
			reg = self.registered[name];
			if (_is.hash(reg) && _is.fn(reg.klass)){
				return _fn.apply(reg.klass, args);
			}
			return null;
		},
		/**
		 * @summary Gets an array of all registered names.
		 * @memberof FooUtils.Factory#
		 * @function names
		 * @param {boolean} [prioritize=false] - Whether or not to order the names by the priority they were registered with.
		 * @returns {Array.<string>}
		 * @example {@run true}
		 * // create a new instance of the factory, this is usually exposed by the class that will be using the factory.
		 * var factory = new FooUtils.Factory();
		 *
		 * // create some classes to register
		 * function Test1(){}
		 * function Test2(){}
		 *
		 * // register the classes with the factory with the default priority
		 * factory.register( "test-1", Test1 );
		 * factory.register( "test-2", Test2, 1 );
		 *
		 * // log all registered names
		 * console.log( factory.names() ); // => ["test-1","test-2"]
		 * console.log( factory.names( true ) ); // => ["test-2","test-1"] ~ "test-2" appears before "test-1" as it was registered with a higher priority
		 */
		names: function( prioritize ){
			prioritize = _is.boolean(prioritize) ? prioritize : false;
			var names = [], name;
			if (prioritize){
				var reg = [];
				for (name in this.registered){
					if (!this.registered.hasOwnProperty(name)) continue;
					reg.push(this.registered[name]);
				}
				reg.sort(function(a, b){ return b.priority - a.priority; });
				$.each(reg, function(i, r){
					names.push(r.name);
				});
			} else {
				for (name in this.registered){
					if (!this.registered.hasOwnProperty(name)) continue;
					names.push(name);
				}
			}
			return names;
		},
		/**
		 * @summary Registers a `klass` constructor with the factory using the given `name`.
		 * @memberof FooUtils.Factory#
		 * @function register
		 * @param {string} name - The friendly name of the class.
		 * @param {function} klass - The class constructor to register.
		 * @param {number} [priority=0] - This determines the index for the class when using either the {@link FooUtils.Factory#load|load} or {@link FooUtils.Factory#names|names} methods, a higher value equals a lower index.
		 * @returns {boolean} `true` if the `klass` was successfully registered.
		 * @description Once a class is registered you can use either the {@link FooUtils.Factory#load|load} or {@link FooUtils.Factory#make|make} methods to create new instances depending on your use case.
		 * @example {@run true}
		 * // create a new instance of the factory, this is usually exposed by the class that will be using the factory.
		 * var factory = new FooUtils.Factory();
		 *
		 * // create a class to register
		 * function Test(){}
		 *
		 * // register the class with the factory with the default priority
		 * var succeeded = factory.register( "test", Test );
		 *
		 * console.log( succeeded ); // => true
		 * console.log( factory.registered.hasOwnProperty( "test" ) ); // => true
		 * console.log( factory.registered[ "test" ].name === "test" ); // => true
		 * console.log( factory.registered[ "test" ].klass === Test ); // => true
		 * console.log( factory.registered[ "test" ].priority === 0 ); // => true
		 */
		register: function(name, klass, priority){
			if (!_is.string(name) || _is.empty(name) || !_is.fn(klass)) return false;
			priority = _is.number(priority) ? priority : 0;
			var current = this.registered[name];
			this.registered[name] = {
				name: name,
				klass: klass,
				priority: !_is.undef(current) ? current.priority : priority
			};
			return true;
		}
	});

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is,
	FooUtils.fn
);
(function(_, _fn, _str){
	// only register methods if this version is the current version
	if (_.version !== '0.2.0') return;

	// this is done to handle Content Security in Chrome and other browsers blocking access to the localStorage object under certain configurations.
	// see: https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document
	var localAvailable = false;
	try { localAvailable = !!window.localStorage; }
	catch (err){ localAvailable = false; }

	/**
	 * @summary A debug utility class that can be enabled across sessions using the given `key` by storing its state in `localStorage`.
	 * @memberof FooUtils.
	 * @class Debugger
	 * @param {string} key - The key to use to store the debug state in `localStorage`.
	 * @augments FooUtils.Class
	 * @borrows FooUtils.Class.extend as extend
	 * @borrows FooUtils.Class.override as override
	 * @description This class allows you to write additional debug info to the console within your code which by default is not actually output. You can then enable the debugger and it will start to output the results to the console.
	 *
	 * The most useful feature of this is the ability to store the debug state across page sessions by using `localStorage`. This allows you to enable the debugger and then refresh the page to view any debugger output that occurs on page load.
	 */
	_.Debugger = _.Class.extend(/** @lends FooUtils.Debugger.prototype */{
		/**
		 * @ignore
		 * @constructs
		 * @param {string} key
		 **/
		construct: function(key){
			/**
			 * @summary The key used to store the debug state in `localStorage`.
			 * @memberof FooUtils.Debugger#
			 * @name key
			 * @type {string}
			 */
			this.key = key;
			/**
			 * @summary Whether or not the debugger is currently enabled.
			 * @memberof FooUtils.Debugger#
			 * @name enabled
			 * @type {boolean}
			 * @readonly
			 * @description The value for this property is synced with the current state stored in `localStorage` and should never be set from outside of this class.
			 */
			this.enabled = localAvailable ? !!localStorage.getItem(this.key) : false;
		},
		/**
		 * @summary Enable the debugger causing additional info to be logged to the console.
		 * @memberof FooUtils.Debugger#
		 * @function enable
		 * @example
		 * var d = new FooUtils.Debugger( "FOO_DEBUG" );
		 * d.log( "Never logged" );
		 * d.enable();
		 * d.log( "I am logged!" );
		 */
		enable: function(){
			if (!localAvailable) return;
			this.enabled = true;
			localStorage.setItem(this.key, "debug");
		},
		/**
		 * @summary Disable the debugger stopping additional info being logged to the console.
		 * @memberof FooUtils.Debugger#
		 * @function disable
		 * @example
		 * var d = new FooUtils.Debugger( "FOO_DEBUG" );
		 * d.log( "Never logged" );
		 * d.enable();
		 * d.log( "I am logged!" );
		 * d.disable();
		 * d.log( "Never logged" );
		 */
		disable: function(){
			if (!localAvailable) return;
			this.enabled = false;
			localStorage.removeItem(this.key);
		},
		/**
		 * @summary Logs the supplied message and additional arguments to the console when enabled.
		 * @memberof FooUtils.Debugger#
		 * @function log
		 * @param {string} message - The message to log to the console.
		 * @param {*} [argN] - Any number of additional arguments to supply after the message.
		 * @description This method basically wraps the `console.log` method and simply checks the enabled state of the debugger before passing along any supplied arguments.
		 */
		log: function(message, argN){
			if (!this.enabled) return;
			console.log.apply(console, _fn.arg2arr(arguments));
		},
		/**
		 * @summary Logs the formatted message and additional arguments to the console when enabled.
		 * @memberof FooUtils.Debugger#
		 * @function logf
		 * @param {string} message - The message containing named `replacements` to log to the console.
		 * @param {Object.<string, string>} replacements - An object containing key value pairs used to perform a named format on the `message`.
		 * @param {*} [argN] - Any number of additional arguments to supply after the message.
		 * @see {@link FooUtils.str.format} for more information on supplying the replacements object.
		 */
		logf: function(message, replacements, argN){
			if (!this.enabled) return;
			var args = _fn.arg2arr(arguments);
			message = args.shift();
			replacements = args.shift();
			args.unshift(_str.format(message, replacements));
			this.log.apply(this, args);
		}
	});

})(
	// dependencies
	FooUtils,
	FooUtils.fn,
	FooUtils.str
);
(function($, _, _fn){
    // only register methods if this version is the current version
    if (_.version !== '0.2.0') return;

    /**
     * @summary A wrapper around the fullscreen API to ensure cross browser compatibility.
     * @memberof FooUtils.
     * @class FullscreenAPI
     * @augments FooUtils.EventClass
     * @borrows FooUtils.EventClass.extend as extend
     * @borrows FooUtils.EventClass.override as override
     */
    _.FullscreenAPI = _.EventClass.extend(/** @lends FooUtils.FullscreenAPI */{
        /**
         * @ignore
         * @constructs
         */
        construct: function(){
            this._super();
            /**
             * @summary An object containing a single browsers various methods and events needed for this wrapper.
             * @typedef {?Object} FooUtils.FullscreenAPI~BrowserAPI
             * @property {string} enabled
             * @property {string} element
             * @property {string} request
             * @property {string} exit
             * @property {Object} events
             * @property {string} events.change
             * @property {string} events.error
             */

            /**
             * @summary An object containing the supported fullscreen browser API's.
             * @typedef {Object.<string, FooUtils.FullscreenAPI~BrowserAPI>} FooUtils.FullscreenAPI~SupportedBrowsers
             */

            /**
             * @summary Contains the various browser specific method and event names.
             * @memberof FooUtils.FullscreenAPI#
             * @name apis
             * @type {FooUtils.FullscreenAPI~SupportedBrowsers}
             */
            this.apis = {
                w3: {
                    enabled: "fullscreenEnabled",
                    element: "fullscreenElement",
                    request: "requestFullscreen",
                    exit:    "exitFullscreen",
                    events: {
                        change: "fullscreenchange",
                        error:  "fullscreenerror"
                    }
                },
                webkit: {
                    enabled: "webkitFullscreenEnabled",
                    element: "webkitCurrentFullScreenElement",
                    request: "webkitRequestFullscreen",
                    exit:    "webkitExitFullscreen",
                    events: {
                        change: "webkitfullscreenchange",
                        error:  "webkitfullscreenerror"
                    }
                },
                moz: {
                    enabled: "mozFullScreenEnabled",
                    element: "mozFullScreenElement",
                    request: "mozRequestFullScreen",
                    exit:    "mozCancelFullScreen",
                    events: {
                        change: "mozfullscreenchange",
                        error:  "mozfullscreenerror"
                    }
                },
                ms: {
                    enabled: "msFullscreenEnabled",
                    element: "msFullscreenElement",
                    request: "msRequestFullscreen",
                    exit:    "msExitFullscreen",
                    events: {
                        change: "MSFullscreenChange",
                        error:  "MSFullscreenError"
                    }
                }
            };
            /**
             * @summary The current browsers specific method and event names.
             * @memberof FooUtils.FullscreenAPI#
             * @name api
             * @type {FooUtils.FullscreenAPI~BrowserAPI}
             */
            this.api = this.getAPI();
            /**
             * @summary Whether or not the fullscreen API is supported in the current browser.
             * @memberof FooUtils.FullscreenAPI#
             * @name supported
             * @type {boolean}
             */
            this.supported = this.api != null;
            this.__listen();
        },
        /**
         * @summary Destroys the current wrapper unbinding events and freeing up resources.
         * @memberof FooUtils.FullscreenAPI#
         * @function destroy
         * @returns {boolean}
         */
        destroy: function(){
            this.__stopListening();
            return this._super();
        },
        /**
         * @summary Fetches the correct API for the current browser.
         * @memberof FooUtils.FullscreenAPI#
         * @function getAPI
         * @return {?FooUtils.FullscreenAPI~BrowserAPI} Returns `null` if the fullscreen API is not supported.
         */
        getAPI: function(){
            for (var vendor in this.apis) {
                if (!this.apis.hasOwnProperty(vendor)) continue;
                // Check if document has the "enabled" property
                if (this.apis[vendor].enabled in document) {
                    // It seems this browser supports the fullscreen API
                    return this.apis[vendor];
                }
            }
            return null;
        },
        /**
         * @summary Gets the current fullscreen element or null.
         * @memberof FooUtils.FullscreenAPI#
         * @function element
         * @returns {?Element}
         */
        element: function(){
            return this.supported ? document[this.api.element] : null;
        },
        /**
         * @summary Requests the browser to place the specified element into fullscreen mode.
         * @memberof FooUtils.FullscreenAPI#
         * @function request
         * @param {Element} element - The element to place into fullscreen mode.
         * @returns {Promise} A Promise which is resolved once the element is placed into fullscreen mode.
         */
        request: function(element){
            if (this.supported && !!element[this.api.request]){
                var result = element[this.api.request]();
                return !result ? $.Deferred(this.__resolver(this.api.request)).promise() : result;
            }
            return _fn.rejected;
        },
        /**
         * @summary Requests that the browser switch from fullscreen mode back to windowed mode.
         * @memberof FooUtils.FullscreenAPI#
         * @function exit
         * @returns {Promise} A Promise which is resolved once fullscreen mode is exited.
         */
        exit: function(){
            if (this.supported && !!this.element()){
                var result = document[this.api.exit]();
                return !result ? $.Deferred(this.__resolver(this.api.exit)).promise() : result;
            }
            return _fn.rejected;
        },
        /**
         * @summary Toggles the supplied element between fullscreen and windowed modes.
         * @memberof FooUtils.FullscreenAPI#
         * @function toggle
         * @param {Element} element - The element to switch between modes.
         * @returns {Promise} A Promise that is resolved once fullscreen mode is either entered or exited.
         */
        toggle: function(element){
            return !!this.element() ? this.exit() : this.request(element);
        },
        /**
         * @summary Starts listening to the document level fullscreen events and triggers an abbreviated version on this class.
         * @memberof FooUtils.FullscreenAPI#
         * @function __listen
         * @private
         */
        __listen: function(){
            var self = this;
            if (!self.supported) return;
            $(document).on(self.api.events.change + ".utils", function() {
                self.trigger("change");
            }).on(self.api.events.error + ".utils", function() {
                self.trigger("error");
            });
        },
        /**
         * @summary Stops listening to the document level fullscreen events.
         * @memberof FooUtils.FullscreenAPI#
         * @function __stopListening
         * @private
         */
        __stopListening: function(){
            var self = this;
            if (!self.supported) return;
            $(document).off(self.api.events.change + ".utils")
                .off(self.api.events.error + ".utils");
        },
        /**
         * @summary Creates a resolver function to patch browsers which do not return a Promise from there request and exit methods.
         * @memberof FooUtils.FullscreenAPI#
         * @function __resolver
         * @param {string} method - The request or exit method the resolver is being created for.
         * @returns {resolver}
         * @private
         */
        __resolver: function(method){
            var self = this;
            /**
             * @summary Binds to the fullscreen change and error events and resolves or rejects the supplied deferred accordingly.
             * @callback FooUtils.FullscreenAPI~resolver
             * @param {jQuery.Deferred} def - The jQuery.Deferred object to resolve.
             */
            return function resolver(def) {
                // Reject the promise if asked to exitFullscreen and there is no element currently in fullscreen
                if (method === self.api.exit && !!self.element()) {
                    setTimeout(function() {
                        def.reject(new TypeError());
                    }, 1);
                    return;
                }

                // When receiving an internal fullscreenchange event, fulfill the promise
                function change() {
                    def.resolve();
                    $(document).off(self.api.events.change, change)
                        .off(self.api.events.error, error);
                }

                // When receiving an internal fullscreenerror event, reject the promise
                function error() {
                    def.reject(new TypeError());
                    $(document).off(self.api.events.change, change)
                        .off(self.api.events.error, error);
                }

                $(document).on(self.api.events.change, change)
                    .on(self.api.events.error, error);
            };
        }
    });

    /**
     * @summary A cross browser wrapper for the fullscreen API.
     * @memberof FooUtils.
     * @name fullscreen
     * @type {FooUtils.FullscreenAPI}
     */
    _.fullscreen = new _.FullscreenAPI();

})(
    FooUtils.$,
    FooUtils,
    FooUtils.fn
);