/*!
* FooUtils - Contains common utility methods and classes used in our plugins.
* @version 1.0.0
* @link https://github.com/steveush/foo-utils#readme
* @copyright Steve Usher 2021
* @license Released under the GPL-3.0 license.
*/
(function($, _, _is, _fn){
	// only register methods if this version is the current version
	if (_.version !== '1.0.0') return;

	/**
	 * @summary Contains common utility methods and members for the CSS transition property.
	 * @memberof FooUtils.
	 * @namespace transition
	 */
	_.transition = {};

	/**
	 * @summary The data name used by transitions to ensure promises are resolved.
	 * @memberof FooUtils.transition.
	 * @name dataName
	 * @type {string}
	 * @default "__foo-transition__"
	 */
	_.transition.dataName = '__foo-transition__';

	/**
	 * @summary The CSS className used to disable transitions when using the {@link FooUtils.transition.disable|disable} method instead of inline styles.
	 * @memberof FooUtils.transition.
	 * @name disableClassName
	 * @type {?string}
	 * @default null
	 */
	_.transition.disableClassName = null;

	/**
	 * @summary The global timeout used as a safety measure when using the {@link FooUtils.transition.start|start} method. This can be overridden using the `timeout` parameter of the {@link FooUtils.transition.start|start} method.
	 * @memberof FooUtils.transition.
	 * @name timeout
	 * @type {number}
	 * @default 3000
	 */
	_.transition.timeout = 3000;

	/**
	 * @summary Disable transitions temporarily on the provided element so changes can be made immediately within the callback.
	 * @memberof FooUtils.transition.
	 * @function disable
	 * @param {(jQuery|HTMLElement)} element - The element to disable transitions on.
	 * @param {FooUtils.transition~modifyFn} modifyFn - A function to execute while the elements transitions are disabled.
	 */
	_.transition.disable = function(element, modifyFn){
		const $el = _is.jq(element) ? element : $(element);
		if ($el.length > 0 && _is.fn(modifyFn)) {
			const el = $el.get(0), hasClass = _is.string(_.transition.disableClassName);
			let restore = null;

			if (hasClass) $el.addClass(_.transition.disableClassName);
			else {
				restore = {
					value: el.style.getPropertyValue('transition'),
					priority: el.style.getPropertyPriority('transition')
				};
				el.style.setProperty('transition', 'none', 'important');
			}

			modifyFn.call(modifyFn, $el);
			$el.prop("offsetWidth");

			if (hasClass) $el.removeClass(_.transition.disableClassName);
			else {
				el.style.removeProperty('transition');
				if (_is.string(restore.value) && restore.value.length > 0){
					el.style.setProperty('transition', restore.value, restore.priority);
				}
			}
		}
	};

	/**
	 * @summary Stop a transition started using the {@link FooUtils.transition.start|start} method.
	 * @memberof FooUtils.transition.
	 * @function stop
	 * @param {(jQuery|HTMLElement)} element - The element to stop the transition on.
	 * @returns {Promise}
	 */
	_.transition.stop = function(element){
		const d = $.Deferred(), $el = _is.jq(element) ? element : $(element);
		if ($el.length > 0){
			const current = $el.data(_.transition.dataName);
			if (_is.promise(current)){
				current.always(function(){
					// request the next frame to give the previous event unbinds time to settle
					_.requestFrame(function(){
						d.resolve($el);
					});
				}).reject(new Error("Transition cancelled."));
			} else {
				d.resolve($el);
			}
		} else {
			d.reject(new Error("Unable to stop transition. Make sure the element exists."));
		}
		return d.promise();
	};

	/**
	 * @summary Creates a new transition event listener ensuring the element and optionally the propertyName matches before executing the callback.
	 * @memberof FooUtils.transition.
	 * @function createListener
	 * @param {HTMLElement} element - The element being listened to.
	 * @param {function(*): void} callback - The callback to execute once the element and optional propertyName are matched.
	 * @param {?string} [propertyName=null] - The propertyName to match on the TransitionEvent object.
	 * @returns {function(*): void}
	 */
	_.transition.createListener = function(element, callback, propertyName){
		const el = element, fn = callback, prop = propertyName, hasProp = _is.string(propertyName);
		return function(event){
			const evt = event.originalEvent instanceof TransitionEvent ? event.originalEvent : event;
			let matches = false;
			if (evt.target === el){
				matches = hasProp ? evt.propertyName === prop : true;
			}
			if (matches) fn.apply(fn, _fn.arg2arr(arguments));
		};
	};

	/**
	 * @summary Start a transition on an element returning a promise that is resolved once the transition ends.
	 * @memberof FooUtils.transition.
	 * @function start
	 * @param {(jQuery|HTMLElement)} element - The element to perform the transition on.
	 * @param {FooUtils.transition~modifyFn} triggerFn - The callback that triggers the transition on the element.
	 * @param {?string} [propertyName] - A specific property name to wait for before resolving. If not supplied the first instance of the transitionend event will resolve the promise.
	 * @param {number} [timeout] - A safety timeout to ensure the returned promise is finalized. If not supplied the value of the {@link FooUtils.transition.timeout} property is used.
	 * @returns {Promise}
	 */
	_.transition.start = function(element, triggerFn, propertyName, timeout){
		const d = $.Deferred(), $el = _is.jq(element) ? element : $(element);
		if ($el.length > 0 && _is.fn(triggerFn)){
			const el = $el.get(0);
			// first stop any active transitions
			_.transition.stop($el).always(function(){
				// then setup the data object and event listeners for the new transition
				const listener = _.transition.createListener(el, function(){
					d.resolve($el);
				}, propertyName);

				$el.data(_.transition.dataName, d)
					.on("transitionend.foo-utils", listener)
					.prop("offsetWidth"); // force layout to ensure transitions on newly appended elements occur

				// request the next frame to give the event bindings time to settle
				_.requestFrame(function(){
					// just in case a transition is cancelled by some other means and the transitionend event is never fired this
					// timeout ensures the returned promise is always finalized.
					const safety = setTimeout(function(){
						d.reject(new Error("Transition safety timeout triggered."));
					}, _is.number(timeout) ? timeout : _.transition.timeout);

					// we always want to cleanup after ourselves so clear the safety, remove the data object and unbind the events
					d.always(function(){
						clearTimeout(safety);
						$el.removeData(_.transition.dataName).off("transitionend.foo-utils", listener);
					});

					// now that everything is setup kick off the transition by calling the triggerFn
					triggerFn.call(triggerFn, $el);
				});

			});
		} else {
			d.reject(new Error("Unable to perform transition. Make sure the element exists and a trigger function is supplied."));
		}
		return d.promise();
	};

	/**
	 * @summary Used to modify an element which has transitions optionally allowing the transition to occur or not.
	 * @memberof FooUtils.transition.
	 * @function modify
	 * @param {(jQuery|HTMLElement)} element - The element to perform the modifications to.
	 * @param {FooUtils.transition~modifyFn} modifyFn - The callback used to perform the modifications.
	 * @param {boolean} [immediate=false] - Whether or not transitions should be allowed to execute and waited on. The default value of `false` means transitions are allowed and the promise will only resolve once there transitionend event has fired.
	 * @param {?string} [propertyName=null] - A specific property name to wait for before resolving. If not supplied the first instance of the transitionend event will resolve the promise.
	 * @returns {Promise} Returns a promise that is resolved once the modifications to the element have ended.
	 */
	_.transition.modify = function(element, modifyFn, immediate, propertyName){
		const $el = _is.jq(element) ? element : $(element);
		if ($el.length > 0 && _is.fn(modifyFn)){
			if (immediate){
				_.transition.disable($el, modifyFn);
				return _fn.resolve();
			}
			return _.transition.start($el, modifyFn, propertyName);
		}
		return _fn.reject(new Error("Unable to perform modification. Make sure the element exists and a modify function is supplied."));
	};

	/**
	 * @summary Perform one or more modifications to the element such as setting inline styles or toggling classNames.
	 * @callback FooUtils.transition~modifyFn
	 * @param {jQuery} $element - The jQuery object for the element to modify.
	 */

})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is,
	FooUtils.fn
);