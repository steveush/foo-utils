(function($, _, _fn){
    // only register methods if this version is the current version
    if (_.version !== '@@version') return;

    /**
     * @summary A wrapper around the fullscreen API to ensure cross browser compatibility.
     * @memberof FooUtils.
     * @class FullscreenAPI
     * @augments FooUtils.EventClass
     * @borrows FooUtils.EventClass.extend as extend
     * @borrows FooUtils.EventClass.override as override
     */
    _.FullscreenAPI = _.EventClass.extend(/** @lends FooUtils.FullscreenAPI */{
        /**
         * @ignore
         * @constructs
         */
        construct: function(){
            this._super();
            /**
             * @summary An object containing a single browsers various methods and events needed for this wrapper.
             * @typedef {?Object} FooUtils.FullscreenAPI~BrowserAPI
             * @property {string} enabled
             * @property {string} element
             * @property {string} request
             * @property {string} exit
             * @property {Object} events
             * @property {string} events.change
             * @property {string} events.error
             */

            /**
             * @summary An object containing the supported fullscreen browser API's.
             * @typedef {Object.<string, FooUtils.FullscreenAPI~BrowserAPI>} FooUtils.FullscreenAPI~SupportedBrowsers
             */

            /**
             * @summary Contains the various browser specific method and event names.
             * @memberof FooUtils.FullscreenAPI#
             * @name apis
             * @type {FooUtils.FullscreenAPI~SupportedBrowsers}
             */
            this.apis = {
                w3: {
                    enabled: "fullscreenEnabled",
                    element: "fullscreenElement",
                    request: "requestFullscreen",
                    exit:    "exitFullscreen",
                    events: {
                        change: "fullscreenchange",
                        error:  "fullscreenerror"
                    }
                },
                webkit: {
                    enabled: "webkitFullscreenEnabled",
                    element: "webkitCurrentFullScreenElement",
                    request: "webkitRequestFullscreen",
                    exit:    "webkitExitFullscreen",
                    events: {
                        change: "webkitfullscreenchange",
                        error:  "webkitfullscreenerror"
                    }
                },
                moz: {
                    enabled: "mozFullScreenEnabled",
                    element: "mozFullScreenElement",
                    request: "mozRequestFullScreen",
                    exit:    "mozCancelFullScreen",
                    events: {
                        change: "mozfullscreenchange",
                        error:  "mozfullscreenerror"
                    }
                },
                ms: {
                    enabled: "msFullscreenEnabled",
                    element: "msFullscreenElement",
                    request: "msRequestFullscreen",
                    exit:    "msExitFullscreen",
                    events: {
                        change: "MSFullscreenChange",
                        error:  "MSFullscreenError"
                    }
                }
            };
            /**
             * @summary The current browsers specific method and event names.
             * @memberof FooUtils.FullscreenAPI#
             * @name api
             * @type {FooUtils.FullscreenAPI~BrowserAPI}
             */
            this.api = this.getAPI();
            /**
             * @summary Whether or not the fullscreen API is supported in the current browser.
             * @memberof FooUtils.FullscreenAPI#
             * @name supported
             * @type {boolean}
             */
            this.supported = this.api != null;
            this.__listen();
        },
        /**
         * @summary Destroys the current wrapper unbinding events and freeing up resources.
         * @memberof FooUtils.FullscreenAPI#
         * @function destroy
         * @returns {boolean}
         */
        destroy: function(){
            this.__stopListening();
            return this._super();
        },
        /**
         * @summary Fetches the correct API for the current browser.
         * @memberof FooUtils.FullscreenAPI#
         * @function getAPI
         * @return {?FooUtils.FullscreenAPI~BrowserAPI} Returns `null` if the fullscreen API is not supported.
         */
        getAPI: function(){
            for (var vendor in this.apis) {
                if (!this.apis.hasOwnProperty(vendor)) continue;
                // Check if document has the "enabled" property
                if (this.apis[vendor].enabled in document) {
                    // It seems this browser supports the fullscreen API
                    return this.apis[vendor];
                }
            }
            return null;
        },
        /**
         * @summary Gets the current fullscreen element or null.
         * @memberof FooUtils.FullscreenAPI#
         * @function element
         * @returns {?Element}
         */
        element: function(){
            return this.supported ? document[this.api.element] : null;
        },
        /**
         * @summary Requests the browser to place the specified element into fullscreen mode.
         * @memberof FooUtils.FullscreenAPI#
         * @function request
         * @param {Element} element - The element to place into fullscreen mode.
         * @returns {Promise} A Promise which is resolved once the element is placed into fullscreen mode.
         */
        request: function(element){
            if (this.supported && !!element[this.api.request]){
                var result = element[this.api.request]();
                return !result ? $.Deferred(this.__resolver(this.api.request)).promise() : result;
            }
            return _fn.rejected;
        },
        /**
         * @summary Requests that the browser switch from fullscreen mode back to windowed mode.
         * @memberof FooUtils.FullscreenAPI#
         * @function exit
         * @returns {Promise} A Promise which is resolved once fullscreen mode is exited.
         */
        exit: function(){
            if (this.supported && !!this.element()){
                var result = document[this.api.exit]();
                return !result ? $.Deferred(this.__resolver(this.api.exit)).promise() : result;
            }
            return _fn.rejected;
        },
        /**
         * @summary Toggles the supplied element between fullscreen and windowed modes.
         * @memberof FooUtils.FullscreenAPI#
         * @function toggle
         * @param {Element} element - The element to switch between modes.
         * @returns {Promise} A Promise that is resolved once fullscreen mode is either entered or exited.
         */
        toggle: function(element){
            return !!this.element() ? this.exit() : this.request(element);
        },
        /**
         * @summary Starts listening to the document level fullscreen events and triggers an abbreviated version on this class.
         * @memberof FooUtils.FullscreenAPI#
         * @function __listen
         * @private
         */
        __listen: function(){
            var self = this;
            if (!self.supported) return;
            $(document).on(self.api.events.change + ".utils", function() {
                self.trigger("change");
            }).on(self.api.events.error + ".utils", function() {
                self.trigger("error");
            });
        },
        /**
         * @summary Stops listening to the document level fullscreen events.
         * @memberof FooUtils.FullscreenAPI#
         * @function __stopListening
         * @private
         */
        __stopListening: function(){
            var self = this;
            if (!self.supported) return;
            $(document).off(self.api.events.change + ".utils")
                .off(self.api.events.error + ".utils");
        },
        /**
         * @summary Creates a resolver function to patch browsers which do not return a Promise from there request and exit methods.
         * @memberof FooUtils.FullscreenAPI#
         * @function __resolver
         * @param {string} method - The request or exit method the resolver is being created for.
         * @returns {resolver}
         * @private
         */
        __resolver: function(method){
            var self = this;
            /**
             * @summary Binds to the fullscreen change and error events and resolves or rejects the supplied deferred accordingly.
             * @callback FooUtils.FullscreenAPI~resolver
             * @param {jQuery.Deferred} def - The jQuery.Deferred object to resolve.
             */
            return function resolver(def) {
                // Reject the promise if asked to exitFullscreen and there is no element currently in fullscreen
                if (method === self.api.exit && !!self.element()) {
                    setTimeout(function() {
                        def.reject(new TypeError());
                    }, 1);
                    return;
                }

                // When receiving an internal fullscreenchange event, fulfill the promise
                function change() {
                    def.resolve();
                    $(document).off(self.api.events.change, change)
                        .off(self.api.events.error, error);
                }

                // When receiving an internal fullscreenerror event, reject the promise
                function error() {
                    def.reject(new TypeError());
                    $(document).off(self.api.events.change, change)
                        .off(self.api.events.error, error);
                }

                $(document).on(self.api.events.change, change)
                    .on(self.api.events.error, error);
            };
        }
    });

    /**
     * @summary A cross browser wrapper for the fullscreen API.
     * @memberof FooUtils.
     * @name fullscreen
     * @type {FooUtils.FullscreenAPI}
     */
    _.fullscreen = new _.FullscreenAPI();

})(
    FooUtils.$,
    FooUtils,
    FooUtils.fn
);