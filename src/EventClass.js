(function (_, _is, _str) {
    // only register methods if this version is the current version
    if (_.version !== '@@version') return;

    /**
     * @summary A base event class providing just a type and defaultPrevented properties.
     * @memberof FooUtils.
     * @class Event
     * @param {string} type - The type for this event.
     * @augments FooUtils.Class
     * @borrows FooUtils.Class.extend as extend
     * @borrows FooUtils.Class.override as override
     * @description This is a very basic event class that is used internally by the {@link FooUtils.EventClass#trigger} method when the first parameter supplied is simply the event name.
     *
     * To trigger your own custom event you will need to inherit from this class and then supply the instantiated event object as the first parameter to the {@link FooUtils.EventClass#trigger} method.
     * @example {@caption The following shows how to use this class to create a custom event.}
     * var MyEvent = FooUtils.Event.extend({
     * 	construct: function(type, customProp){
     * 	    this._super(type);
     * 	    this.myCustomProp = customProp;
     * 	}
     * });
     *
     * // to use the class you would then instantiate it and pass it as the first argument to a FooUtils.EventClass's trigger method
     * var eventClass = ...; // any class inheriting from FooUtils.EventClass
     * var event = new MyEvent( "my-event-type", true );
     * eventClass.trigger(event);
     */
    _.Event = _.Class.extend(/** @lends FooUtils.Event.prototype */{
        /** @ignore */
        construct: function(type){
            if (_is.empty(type))
                throw new SyntaxError('FooUtils.Event objects must be supplied a `type`.');

            var self = this, parsed = _.Event.parse(type);
            /**
             * @summary The type of event.
             * @memberof FooUtils.Event#
             * @name type
             * @type {string}
             * @readonly
             */
            self.type = parsed.type;
            /**
             * @summary The namespace of the event.
             * @memberof FooUtils.Event#
             * @name namespace
             * @type {string}
             * @readonly
             */
            self.namespace = parsed.namespace;
            /**
             * @summary Whether the default action should be taken or not.
             * @memberof FooUtils.Event#
             * @name defaultPrevented
             * @type {boolean}
             * @readonly
             */
            self.defaultPrevented = false;
            /**
             * @summary The {@link FooUtils.EventClass} that triggered this event.
             * @memberof FooUtils.Event#
             * @name target
             * @type {FooUtils.EventClass}
             * @readonly
             */
            self.target = null;
        },
        /**
         * @summary Informs the class that raised this event that its default action should not be taken.
         * @memberof FooUtils.Event#
         * @function preventDefault
         */
        preventDefault: function(){
            this.defaultPrevented = true;
        },
        /**
         * @summary Gets whether the default action should be taken or not.
         * @memberof FooUtils.Event#
         * @function isDefaultPrevented
         * @returns {boolean}
         */
        isDefaultPrevented: function(){
            return this.defaultPrevented;
        }
    });

    /**
     * @summary Parse the provided event string into a type and namespace.
     * @memberof FooUtils.Event.
     * @function parse
     * @param {string} event - The event to parse.
     * @returns {{namespaced: boolean, type: string, namespace: string}} Returns an object containing the type and namespace for the event.
     */
    _.Event.parse = function(event){
        event = _is.string(event) && !_is.empty(event) ? event : null;
        var namespaced = _str.contains(event, ".");
        return {
            namespaced: namespaced,
            type: namespaced ? _str.startsWith(event, ".") ? null : _str.until(event, ".") : event,
            namespace: namespaced ? _str.from(event, ".") : null
        };
    };

    /**
     * @summary A base class that implements a basic events interface.
     * @memberof FooUtils.
     * @class EventClass
     * @augments FooUtils.Class
     * @borrows FooUtils.Class.extend as extend
     * @borrows FooUtils.Class.override as override
     * @description This is a very basic events implementation that provides just enough to cover most needs.
     */
    _.EventClass = _.Class.extend(/** @lends FooUtils.EventClass.prototype */{
        /** @ignore */
        construct: function(){
            /**
             * @summary An object containing all the required info to execute a listener.
             * @typedef {Object} FooUtils.EventClass~RegisteredListener
             * @property {string} namespace - The namespace for the listener.
             * @property {function} fn - The callback function for the listener.
             * @property {*} thisArg - The `this` value to execute the callback with.
             */

            /**
             * @summary An object containing a mapping of events to listeners.
             * @typedef {Object.<string, Array<FooUtils.EventClass~RegisteredListener>>} FooUtils.EventClass~RegisteredEvents
             */

            /**
             * @summary The object used to register event handlers.
             * @memberof FooUtils.EventClass#
             * @name events
             * @type {FooUtils.EventClass~RegisteredEvents}
             */
            this.events = {};
        },
        /**
         * @summary Destroy the current instance releasing used resources.
         * @memberof FooUtils.EventClass#
         * @function destroy
         */
        destroy: function(){
            this.events = {};
        },
        /**
         * @summary Attach multiple event listeners to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {Object.<string, function>} events - An object containing event types to listener mappings.
         * @param {*} [thisArg] - The value of `this` within the listeners. Defaults to the class raising the event.
         * @returns {this}
         *//**
         * @summary Attach an event listener for one or more events to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {string} events - One or more space-separated event types.
         * @param {function} listener - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
         * @returns {this}
         */
        on: function(events, listener, thisArg){
            var self = this;
            if (_is.object(events)){
                thisArg = listener;
                Object.keys(events).forEach(function(key){
                    if (_is.fn(events[key])){
                        key.split(" ").forEach(function(type){
                            self.addListener(type, events[key], thisArg);
                        });
                    }
                });
            } else if (_is.string(events) && _is.fn(listener)) {
                events.split(" ").forEach(function(type){
                    self.addListener(type, listener, thisArg);
                });
            }

            return self;
        },
        /**
         * @summary Adds a single event listener to the current class.
         * @memberof FooUtils.EventClass#
         * @function addListener
         * @param {string} event - The event type, this can not contain any whitespace.
         * @param {function} listener - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
         * @returns {boolean} Returns `true` if added.
         */
        addListener: function(event, listener, thisArg){
            if (!_is.string(event) || /\s/.test(event) || !_is.fn(listener)) return false;

            var self = this, parsed = _.Event.parse(event);
            thisArg = _is.undef(thisArg) ? self : thisArg;

            if (!_is.array(self.events[parsed.type])){
                self.events[parsed.type] = [];
            }
            var exists = self.events[parsed.type].some(function(h){
                return h.namespace === parsed.namespace && h.fn === listener && h.thisArg === thisArg;
            });
            if (!exists){
                self.events[parsed.type].push({
                    namespace: parsed.namespace,
                    fn: listener,
                    thisArg: thisArg
                });
                return true;
            }
            return false;
        },
        /**
         * @summary Remove multiple event listeners from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {Object.<string, function>} events - An object containing event types to listener mappings.
         * @param {*} [thisArg] - The value of `this` within the `listener` function. Defaults to the class raising the event.
         * @returns {this}
         *//**
         * @summary Remove an event listener from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {string} events - One or more space-separated event types.
         * @param {function} listener - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
         * @returns {this}
         */
        off: function(events, listener, thisArg){
            var self = this;
            if (_is.object(events)){
                thisArg = listener;
                Object.keys(events).forEach(function(key){
                    key.split(" ").forEach(function(type){
                        self.removeListener(type, events[key], thisArg);
                    });
                });
            } else if (_is.string(events)) {
                events.split(" ").forEach(function(type){
                    self.removeListener(type, listener, thisArg);
                });
            }

            return self;
        },
        /**
         * @summary Removes a single event listener from the current class.
         * @memberof FooUtils.EventClass#
         * @function removeListener
         * @param {string} event - The event type, this can not contain any whitespace.
         * @param {function} [listener] - The listener registered to the event type.
         * @param {*} [thisArg] - The value of `this` registered for the `listener`. Defaults to the class raising the event.
         * @returns {boolean} Returns `true` if removed.
         */
        removeListener: function(event, listener, thisArg){
            if (!_is.string(event) || /\s/.test(event)) return false;

            var self = this, parsed = _.Event.parse(event), types = [];
            thisArg = _is.undef(thisArg) ? self : thisArg;

            if (!_is.empty(parsed.type)){
                types.push(parsed.type);
            } else if (!_is.empty(parsed.namespace)){
                types.push.apply(types, Object.keys(self.events));
            }

            types.forEach(function(type){
                if (!_is.array(self.events[type])) return;
                self.events[type] = self.events[type].filter(function (h) {
                    if (listener != null){
                        return !(h.namespace === parsed.namespace && h.fn === listener && h.thisArg === thisArg);
                    }
                    if (parsed.namespace != null){
                        return h.namespace !== parsed.namespace;
                    }
                    return false;
                });
                if (self.events[type].length === 0){
                    delete self.events[type];
                }
            });
            return true;
        },
        /**
         * @summary Trigger an event on the current class.
         * @memberof FooUtils.EventClass#
         * @function trigger
         * @param {(string|FooUtils.Event)} event - Either a space-separated string of event types or a custom event object to raise.
         * @param {Array} [args] - An array of additional arguments to supply to the listeners after the event object.
         * @returns {(FooUtils.Event|FooUtils.Event[]|null)} Returns the {@link FooUtils.Event|event object} of the triggered event. If more than one event was triggered an array of {@link FooUtils.Event|event objects} is returned. If no `event` was supplied or triggered `null` is returned.
         */
        trigger: function(event, args){
            args = _is.array(args) ? args : [];
            var self = this, result = [];
            if (event instanceof _.Event){
                result.push(event);
                if (event.target === null) event.target = self;
                self.emit(event, args);
            } else if (_is.string(event)) {
                event.split(" ").forEach(function(type){
                    var e = new _.Event(type);
                    e.target = self;
                    result.push(e)
                    self.emit(e, args);
                });
            }
            return _is.empty(result) ? null : (result.length === 1 ? result[0] : result);
        },
        /**
         * @summary Emits the supplied event on the current class.
         * @memberof FooUtils.EventClass#
         * @function emit
         * @param {FooUtils.Event} event - The event object to emit.
         * @param {Array} [args] - An array of additional arguments to supply to the listener after the event object.
         */
        emit: function(event, args){
            if (!(event instanceof FooUtils.Event)) return;
            var self = this;
            args = _is.array(args) ? args : [];
            if (_is.array(self.events[event.type])) {
                self.events[event.type].forEach(function (h) {
                    if (event.namespace != null && h.namespace !== event.namespace) return;
                    h.fn.apply(h.thisArg, [event].concat(args));
                });
            }
            if (_is.array(self.events["__all__"])){
                self.events["__all__"].forEach(function (h) {
                    h.fn.apply(h.thisArg, [event].concat(args));
                });
            }
        }
    });

})(
    // dependencies
    FooUtils,
    FooUtils.is,
    FooUtils.str
);