(function(_, _is){
	// only register methods if this version is the current version
	if (_.version !== '@@version') return;

	/**
	 * @summary Contains common url utility methods.
	 * @memberof FooUtils
	 * @namespace url
	 */
	_.url = {};

	// used for parsing a url into it's parts.
	var _a = document.createElement('a');

	/**
	 * @summary Parses the supplied url into an object containing it's component parts.
	 * @memberof FooUtils.url
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
	 * @memberof FooUtils.url
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
	 * @memberof FooUtils.url
	 * @function param
	 * @param {string} search - The search string to use (usually `location.search`).
	 * @param {string} key - The key of the parameter.
	 * @param {string} [value] - The value to set for the parameter. If not provided the current value for the `key` is returned.
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
			match = regex.exec(search) || [,""]; // match the param otherwise return an empty string match
			result = match[1].replace(/\+/g, '%20'); // replace any + character's with spaces
			return _is.string(result) && !_is.empty(result) ? decodeURIComponent(result) : null; // decode the result otherwise return null
		}
		if (value === "" || value === null){
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