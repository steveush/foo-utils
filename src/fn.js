(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '@@version') return;

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