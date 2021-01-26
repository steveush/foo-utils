(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '@@version') return;

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