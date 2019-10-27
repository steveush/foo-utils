(function($, _, _is){
	// only register methods if this version is the current version
	if (_.version !== '@@version') return;

	/**
	 * @summary Contains common utility methods and members for the CSS animation property.
	 * @memberof FooUtils
	 * @namespace animation
	 */
	_.animation = {};

	function raf(callback){
		return setTimeout(callback, 1);
	}

	function caf(requestID){
		clearTimeout(requestID);
	}

	/**
	 * @summary A cross browser wrapper for the `requestAnimationFrame` method.
	 * @memberof FooUtils.animation
	 * @function requestFrame
	 * @param {function} callback - The function to call when it's time to update your animation for the next repaint.
	 * @return {number} - The request id that uniquely identifies the entry in the callback list.
	 */
	_.animation.requestFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || raf).bind(window);

	/**
	 * @summary A cross browser wrapper for the `cancelAnimationFrame` method.
	 * @memberof FooUtils.animation
	 * @function cancelFrame
	 * @param {number} requestID - The ID value returned by the call to {@link FooUtils.animation.requestFrame|requestFrame} that requested the callback.
	 */
	_.animation.cancelFrame = (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || caf).bind(window);

	// create a test element to check for the existence of the various animation properties
	var testElement = document.createElement('div');

	/**
	 * @summary Whether or not animations are supported by the current browser.
	 * @memberof FooUtils.animation
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
	 * @memberof FooUtils.animation
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
	 * @memberof FooUtils.animation
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
		if (/^([\d.]*)+?(ms|s)$/i.test(duration)){
			// if we have a valid time value
			var match = duration.match(/^([\d.]*)+?(ms|s)$/i),
				value = parseFloat(match[1]),
				unit = match[2].toLowerCase();
			if (unit === 's'){
				// convert seconds to milliseconds
				value = value * 1000;
			}
			return value;
		}
		return def;
	};

	/**
	 * @summary Gets the `animation-iteration-count` value for the supplied jQuery element.
	 * @memberof FooUtils.animation
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
		if (/^(\d+|infinite)$/i.test(iterations)){
			return iterations === "infinite" ? Infinity : parseInt(iterations);
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
	 * @memberof FooUtils.animation
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