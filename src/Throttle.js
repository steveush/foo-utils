(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '@@version') return;

	_.Throttle = _.Class.extend(/** @lends FooUtils.Throttle */{
		/**
		 * @summary A timer to throttle the execution of code.
		 * @memberof FooUtils
		 * @constructs
		 * @param {number} [idle=0] - The idle time, in milliseconds, that must pass before executing the callback supplied to the {@link FooUtils.Throttle#limit|limit} method.
		 * @augments FooUtils.Class
		 * @borrows FooUtils.Class.extend as extend
		 * @borrows FooUtils.Class.override as override
		 * @description This class is basically a wrapper around the {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout|window.setTimeout} and {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearTimeout|window.clearTimeout} functions. It was created to help throttle the execution of code in event handlers that could be called multiple times per second such as the window resize event. It is meant to limit the execution of expensive code until the specified idle time has lapsed.
		 *
		 * Take a look at the examples for the {@link FooUtils.Throttle#limit|limit} and {@link FooUtils.Throttle#clear|clear} methods for basic usage.
		 * @example <caption>The below shows how you can use this class to prevent expensive code being executed with every call to your window resize handler. If you run this example resize your browser to see when the messages are logged.</caption>{@run true}
		 * var throttle = new FooUtils.Throttle( 50 );
		 *
		 * $(window).on("resize", function(){
		 *
		 * 	throttle.limit(function(){
		 * 		console.log( "Only called when resizing has stopped for at least 50 milliseconds." );
		 * 	});
		 *
		 * });
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout|WindowTimers.setTimeout() - Web APIs | MDN}
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearTimeout|WindowTimers.clearTimeout() - Web APIs | MDN}
		 */
		construct: function(idle){
			/**
			 * @summary The id from the last call to {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout|window.setTimeout}.
			 * @type {?number}
			 * @readonly
			 * @default null
			 */
			this.id = null;
			/**
			 * @summary Whether or not there is an active timer.
			 * @type {boolean}
			 * @readonly
			 * @default false
			 */
			this.active = false;
			/**
			 * @summary The idle time, in milliseconds, the timer should wait before executing the callback supplied to the {@link FooUtils.Throttle#limit|limit} method.
			 * @type {number}
			 * @readonly
			 * @default 0
			 */
			this.idle = _is.number(idle) ? idle : 0;
		},
		/**
		 * @summary Starts a new timer clearing any previously set and executes the <code>callback</code> once it expires.
		 * @instance
		 * @param {function} callback - The function to call once the timer expires.
		 * @example <caption>In the below example the <code>callback</code> function will only be executed once despite the repeated calls to the {@link FooUtils.Throttle#limit|limit} method as each call resets the idle timer.</caption>{@run true}
		 * // create a new throttle
		 * var throttle = new FooUtils.Throttle( 50 );
		 *
		 * // this `for` loop represents something like the window resize event that could call your handler multiple times a second
		 * for (var i = 0, max = 5; i < max; i++){
		 *
		 * 	throttle.limit( function(){
		 * 		console.log( "Only called once, after the idle timer lapses" );
		 * 	} );
		 *
		 * }
		 */
		limit: function(callback){
			if (!_is.fn(callback)) return;
			this.clear();
			var self = this;
			this.active = true;
			this.id = setTimeout(function(){
				self.active = false;
				self.id = null;
				callback();
			}, this.idle);
		},
		/**
		 * @summary Clear any previously set timer and prevent the execution of its' callback.
		 * @instance
		 * @example <caption>The below shows how to cancel an active throttle and prevent the execution of it's callback.</caption>{@run true}
		 * // create a new throttle
		 * var throttle = new FooUtils.Throttle( 50 );
		 *
		 * // this `for` loop represents something like the window resize event that could call your handler multiple times a second
		 * for (var i = 0, max = 5; i < max; i++){
		 *
		 * 	throttle.limit( function(){
		 * 		console.log( "I'm never called" );
		 * 	} );
		 *
		 * }
		 *
		 * // cancel the current throttle timer
		 * throttle.clear();
		 */
		clear: function(){
			if (_is.number(this.id)){
				clearTimeout(this.id);
				this.active = false;
				this.id = null;
			}
		}
	});

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is
);