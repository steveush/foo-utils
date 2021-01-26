/*!
* FooUtils - Contains common utility methods and classes used in our plugins.
* @version 1.0.0
* @link https://github.com/steveush/foo-utils#readme
* @copyright Steve Usher 2021
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
			version: '1.0.0'
		};
	}

	// at this point there will always be a FooUtils namespace registered to the global scope.

})(jQuery);
(function ($, _){
	// only register methods if this version is the current version
	if (_.version !== '1.0.0') return;

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
			for(const prop in value) {
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
	if (_.version !== '1.0.0') return;

	/**
	 * @memberof FooUtils.
	 * @namespace fn
	 * @summary Contains common function utility methods.
	 */
	_.fn = {};

	const fnStr = Function.prototype.toString;

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
	 * @summary An empty function that does nothing. Useful for setting a default value and checking if it has changed.
	 * @memberof FooUtils.fn.
	 * @function noop
	 */
	_.fn.noop = function(){};

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
		const _super = proto[name],
			wrap = _is.fn(_super) && _.fn.CONTAINS_SUPER.test(fnStr.call(fn));
		// only wrap the function if it overrides a method and makes use of `_super` within it's body.
		proto[name] = wrap ?
			(function (_super, fn) {
				// create a new wrapped that exposes the original method as `_super`
				return function () {
					const tmp = this._super;
					this._super = _super;
					const ret = fn.apply(this, arguments);
					this._super = tmp;
					return ret;
				};
			})(_super, fn) : fn;
	};

	/**
	 * @summary Exposes the `methods` from the `source` on the `target`.
	 * @memberof FooUtils.fn.
	 * @function expose
	 * @param {Object} source - The object to expose methods from.
	 * @param {Object} target - The object to expose methods on.
	 * @param {String[]} methods - An array of method names to expose.
	 * @param {*} [thisArg] - The value of `this` within the exposed `methods`. Defaults to the `source` object.
	 */
	_.fn.expose = function(source, target, methods, thisArg){
		if (_is.object(source) && _is.object(target) && _is.array(methods)) {
			thisArg = _is.undef(thisArg) ? source : thisArg;
			methods.forEach(function(method){
				if (_is.string(method) && _is.fn(source[method])){
					target[method] = source[method].bind(thisArg);
				}
			});
		}
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
		args.unshift(klass);
		return new (Function.prototype.bind.apply(klass, args));
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
	 * @summary Debounce the `fn` by the supplied `time`.
	 * @memberof FooUtils.fn.
	 * @function debounce
	 * @param {function} fn - The function to debounce.
	 * @param {number} time - The time in milliseconds to delay execution.
	 * @returns {function}
	 * @description This returns a wrapped version of the `fn` which delays its' execution by the supplied `time`. Additional calls to the function will extend the delay until the `time` expires.
	 */
	_.fn.debounce = function (fn, time) {
		let timeout;
		return function () {
			const ctx = this, args = _.fn.arg2arr(arguments);
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
		let last, timeout;
		return function () {
			const ctx = this, args = _.fn.arg2arr(arguments);
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

	/**
	 * @summary Return a promise rejected using the supplied args.
	 * @memberof FooUtils.fn.
	 * @function reject
	 * @param {*} [arg1] - The first argument to reject the promise with.
	 * @param {...*} [argN] - Any additional arguments to reject the promise with.
	 * @returns {Promise}
	 */
	_.fn.reject = function(arg1, argN){
		const def = $.Deferred(), args = _.fn.arg2arr(arguments);
		return def.reject.apply(def, args).promise();
	};

	/**
	 * @summary Return a promise resolved using the supplied args.
	 * @memberof FooUtils.fn.
	 * @function resolve
	 * @param {*} [arg1] - The first argument to resolve the promise with.
	 * @param {...*} [argN] - Any additional arguments to resolve the promise with.
	 * @returns {Promise}
	 */
	_.fn.resolve = function(arg1, argN){
		const def = $.Deferred(), args = _.fn.arg2arr(arguments);
		return def.resolve.apply(def, args).promise();
	};

	/**
	 * @summary Return a promise rejected using the supplied args.
	 * @memberof FooUtils.fn.
	 * @function rejectWith
	 * @param {*} thisArg - The value of `this` within the promises callbacks.
	 * @param {*} [arg1] - The first argument to reject the promise with.
	 * @param {...*} [argN] - Any additional arguments to reject the promise with.
	 * @returns {Promise}
	 */
	_.fn.rejectWith = function(thisArg, arg1, argN){
		const def = $.Deferred(), args = _.fn.arg2arr(arguments);
		args.shift(); // remove the thisArg
		return def.rejectWith(thisArg, args).promise();
	};

	/**
	 * @summary Return a promise resolved using the supplied args.
	 * @memberof FooUtils.fn.
	 * @function resolveWith
	 * @param {*} thisArg - The value of `this` within the promises callbacks.
	 * @param {*} [arg1] - The first argument to resolve the promise with.
	 * @param {...*} [argN] - Any additional arguments to resolve the promise with.
	 * @returns {Promise}
	 */
	_.fn.resolveWith = function(thisArg, arg1, argN){
		const def = $.Deferred(), args = _.fn.arg2arr(arguments);
		args.shift(); // remove the thisArg
		return def.resolveWith(thisArg, args).promise();
	};

	/**
	 * @summary Waits for all promises to complete before resolving with an array containing the return value of each. This method will reject immediately with the first rejection message or error.
	 * @memberof FooUtils.fn.
	 * @function all
	 * @param {Promise[]} promises - The array of promises to wait for.
	 * @returns {Promise}
	 */
	_.fn.all = function(promises){
		const d = $.Deferred(), results = [];
		if (_is.array(promises) && promises.length > 0) {
			let remaining = promises.length, rejected = false;

			/**
			 * Pushes the arguments into the results array at the supplied index.
			 * @ignore
			 * @param {number} index
			 * @param {Array} args
			 */
			function pushResult(index, args){
				if (rejected) return;
				results[index] = args.length === 0 ? undefined : args.length === 1 ? args[0] : args;
				remaining--;
				if(!remaining) d.resolve(results);
			}

			let i = 0, l = promises.length;
			for (; i < l; i++){
				if (rejected) break;
				let j = i; // hold a scoped reference that can be used in the async callbacks
				if (_is.promise(promises[j])){
					promises[j].then(function(){
						pushResult(j, _.fn.arg2arr(arguments));
					}, function(){
						if (rejected) return;
						rejected = true;
						d.reject.apply(d, _.fn.arg2arr(arguments));
					});
				} else {
					// if we were supplied something that was not a promise then just add it as a fulfilled result
					pushResult(j, [ promises[j] ]);
				}
			}
		} else {
			d.resolve(results);
		}
		return d.promise();
	};

	/**
	 * @summary Waits for all promises to complete before resolving with an array containing the outcome of each.
	 * @memberof FooUtils.fn.
	 * @function allSettled
	 * @param {Promise[]} promises - The array of promises to wait for.
	 * @returns {Promise}
	 */
	_.fn.allSettled = function(promises){
		const d = $.Deferred(), results = [];
		if (_is.array(promises) && promises.length > 0) {
			let remaining = promises.length;

			/**
			 * Sets the value in the results array using the status and args.
			 * @ignore
			 * @param {number} index
			 * @param {string} status
			 * @param {Array} args
			 */
			function setResult(index, status, args) {
				results[index] = {status: status};
				if (args.length > 0) {
					const prop = status === "rejected" ? "reason" : "value";
					results[index][prop] = args.length === 1 ? args[0] : args;
				}
				remaining--;
				if (!remaining) d.resolve(results);
			}

			let i = 0, l = promises.length;
			for (; i < l; i++) {
				let j = i; // hold a scoped reference that can be used in the async callbacks
				if (_is.promise(promises[j])) {
					promises[j].then(function () {
						setResult(j, "fulfilled", _.fn.arg2arr(arguments));
					}, function () {
						setResult(j, "rejected", _.fn.arg2arr(arguments));
					});
				} else {
					// if we were supplied something that was not a promise then just add it as a fulfilled result
					setResult(j, "fulfilled", [ promises[j] ]);
				}
			}
		} else {
			d.resolve(results);
		}
		return d.promise();
	};

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is
);
(function(_, _is){
	// only register methods if this version is the current version
	if (_.version !== '1.0.0') return;

	/**
	 * @summary Contains common url utility methods.
	 * @memberof FooUtils.
	 * @namespace url
	 */
	_.url = {};

	// used for parsing a url into it's parts.
	const _a = document.createElement('a');

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
		const port = _a.port ? _a.port : (["http:", "https:"].indexOf(_a.protocol) !== -1 ? (_a.protocol === "https:" ? "443" : "80") : ""),
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
		let regex, match, result, param;
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
	if (_.version !== '1.0.0') return;

	/**
	 * @summary Contains common string utility methods.
	 * @memberof FooUtils.
	 * @namespace str
	 */
	_.str = {};

	/**
	 * @summary Removes whitespace from both ends of the target string.
	 * @memberof FooUtils.str.
	 * @function trim
	 * @param {string} target - The string to trim.
	 * @returns {string|null} Returns `null` if the supplied target is not a string.
	 */
	_.str.trim = function(target){
		return _is.string(target) ? target.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : null;
	};

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
		if (!_is.string(target)) return target;
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
		if (!_is.string(target)) return target;
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
		const parts = target.split(/\W/);
		let i = 0, len = parts.length;
		for (; i < len; i++){
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
		if (!_is.string(target) || !_is.string(substr) || substr.length > target.length) return false;
		return target.slice(target.length - substr.length) === substr;
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
	 * @summary Escapes the `target` for use in a regular expression.
	 * @memberof FooUtils.str.
	 * @function escapeRegExp
	 * @param {string} target - The string to escape.
	 * @returns {string}
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
	 */
	_.str.escapeRegExp = function(target){
		if (!_is.string(target)) return target;
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
		let i, l, hval = 0x811c9dc5;
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
		const parts = _fn.arg2arr(arguments);
		separator = parts.shift();
		let i, l, result = parts.shift();
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
		let args = _fn.arg2arr(arguments);
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
	if (_.version !== '1.0.0') return;

	/**
	 * @summary Contains common object utility methods.
	 * @memberof FooUtils.
	 * @namespace obj
	 */
	_.obj = {};

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

		function Obj(){}
		Obj.prototype = proto;
		return new Obj();
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
		const objects = _fn.arg2arr(arguments);
		objects.shift();
		_.each(objects, function(object){
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
		for (const prop in object) {
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
		let prop, maps, value;
		for (prop in validators){
			if (!validators.hasOwnProperty(prop) || !_is.fn(validators[prop])) continue;
			maps = _is.array(mappings[prop]) ? mappings[prop] : (_is.string(mappings[prop]) ? [mappings[prop]] : [prop]);
			_.each(maps, function(map){
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
		let parts, last;
		if (_is.undef(value)){
			if (_str.contains(name, '.')){
				parts = name.split('.');
				last = parts.length - 1;
				_.each(parts, function(part, i){
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
			_.each(parts, function(part, i){
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
	if (_.version !== '1.0.0') return;

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
		let i, l;
		if (_is.array(target)){
			for (i = 0, l = target.length; i < l; i++){
				if (callback.call(thisArg, target[i], i, target)){
					return target[i];
				}
			}
		} else if (_is.object(target)){
			const keys = Object.keys(target);
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
		let i, l, result;
		if (_is.array(object)){
			for (i = 0, l = object.length; i < l; i++){
				result = callback.call(thisArg, object[i], i, object);
				if (result === false) break;
			}
		} else if (_is.object(object)){
			const keys = Object.keys(object);
			for (i = 0, l = keys.length; i < l; i++){
				result = callback.call(thisArg, object[keys[i]], keys[i], object);
				if (result === false) break;
			}
		}
	};

	/**
	 * @summary Checks if a value exists within an array.
	 * @memberof FooUtils.
	 * @function inArray
	 * @param {*} needle - The value to search for.
	 * @param {Array} haystack - The array to search within.
	 * @returns {number} Returns the index of the value if found otherwise -1.
	 */
	_.inArray = function(needle, haystack){
		if (_is.array(haystack)){
			return haystack.indexOf(needle);
		}
		return -1;
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
			let result = {}, selector;
			for (const name in classes) {
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
	 * @ignore
	 * @summary Internal replacement for the `requestAnimationFrame` method if the browser doesn't support any form of the method.
	 * @param {function} callback - The function to call when it's time to update your animation for the next repaint.
	 * @return {number} - The request id that uniquely identifies the entry in the callback list.
	 */
	function raf(callback){
		return setTimeout(callback, 1000/60);
	}

	/**
	 * @ignore
	 * @summary Internal replacement for the `cancelAnimationFrame` method if the browser doesn't support any form of the method.
	 * @param {number} requestID - The ID value returned by the call to {@link FooUtils.requestFrame|requestFrame} that requested the callback.
	 */
	function caf(requestID){
		clearTimeout(requestID);
	}

	/**
	 * @summary A cross browser wrapper for the `requestAnimationFrame` method.
	 * @memberof FooUtils.
	 * @function requestFrame
	 * @param {function} callback - The function to call when it's time to update your animation for the next repaint.
	 * @return {number} - The request id that uniquely identifies the entry in the callback list.
	 */
	_.requestFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || raf).bind(window);

	/**
	 * @summary A cross browser wrapper for the `cancelAnimationFrame` method.
	 * @memberof FooUtils.
	 * @function cancelFrame
	 * @param {number} requestID - The ID value returned by the call to {@link FooUtils.requestFrame|requestFrame} that requested the callback.
	 */
	_.cancelFrame = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || caf).bind(window);

	/**
	 * @summary Registers a callback with the next available animation frame.
	 * @memberof FooUtils.
	 * @function nextFrame
	 * @param {function} callback - The callback to execute for the next frame.
	 * @param {*} [thisArg] - The value of `this` within the callback. Defaults to the callback itself.
	 * @returns {Promise} Returns a promise object that is resolved using the return value of the callback.
	 */
	_.nextFrame = function(callback, thisArg){
		return $.Deferred(function(def){
			if (!_is.fn(callback)) {
				def.reject(new Error('Provided callback is not a function.'));
			} else {
				thisArg = _is.undef(thisArg) ? callback : thisArg;
				_.requestFrame(function(){
					try {
						def.resolve(callback.call(thisArg));
					} catch(err) {
						def.reject(err);
					}
				});
			}
		}).promise();
	};

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is
);