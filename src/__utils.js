/**
 * @file This creates the global FooUtils namespace ensuring it only registers itself if the namespace doesn't already exist or if the current version is lower than this one.
 */
(function ($) {

	if (!$){
		console.warn('jQuery must be included in the page prior to the FooUtils library.');
		return;
	}

	/**
	 * @summary This namespace contains common utility methods and code shared between our plugins.
	 * @namespace FooUtils
	 * @description This namespace relies on jQuery being included in the page prior to it being loaded.
	 */
	var utils = {
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

	/**
	 * @summary Compares two version numbers.
	 * @memberof FooUtils
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
	utils.versionCompare = function(version1, version2){
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

	function __exists(){
		try {
			return !!window.FooUtils; // does the namespace already exist?
		} catch(err) {
			return false;
		}
	}

	if (__exists()){
		// if it already exists always log a warning as there may be version conflicts as the following code always ensures the latest version is loaded
		if (utils.versionCompare(utils.version, window.FooUtils.version) > 0){
			// if it exists but it's an old version replace it
			console.warn("An older version of FooUtils (" + window.FooUtils.version + ") already exists in the page, version " + utils.version + " will override it.");
			window.FooUtils = utils;
		} else {
			// otherwise its a newer version so do nothing
			console.warn("A newer version of FooUtils (" + window.FooUtils.version + ") already exists in the page, version " + utils.version + " will not register itself.");
		}
	} else {
		// if it doesn't exist register it
		window.FooUtils = utils;
	}

	// at this point there will always be a FooUtils namespace registered to the global scope.

})(jQuery);