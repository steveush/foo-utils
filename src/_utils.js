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
	 * @memberof FooUtils
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

	// A variable to hold the last number used to generate an ID in the current page.
	var uniqueId = 0;

	/**
	 * @summary Generate and apply a unique id for the given `$element`.
	 * @memberof FooUtils
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
	 * @memberof FooUtils
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
	 * @memberof FooUtils
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
	 * @memberof FooUtils
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
	 * @memberof FooUtils
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
			hidden = /hidden/i, axisX = /x/i, axisY = /y/i,
			$parent = element.parentsUntil(def).filter(function(i, el){
				var $el = $(this);
				if (excludeStaticParent && $el.css("position") === "static") return false;
				var scrollY = axisY.test(axis) && el.scrollHeight > el.clientHeight && !hidden.test($el.css("overflow-y")),
					scrollX = axisX.test(axis) && el.scrollWidth > el.clientWidth && !hidden.test($el.css("overflow-x"));
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