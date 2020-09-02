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
			 * @memberof FooUtils
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
			 * @memberof FooUtils
			 * @name version
			 * @type {string}
			 */
			version: '@@version'
		};
	}

	// at this point there will always be a FooUtils namespace registered to the global scope.

})(jQuery);