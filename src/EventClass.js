(function (_, _is, _str) {
    // only register methods if this version is the current version
    if (_.version !== '@@version') return;

    _.Event = _.Class.extend(/** @lends FooUtils.Event.prototype */{
        /**
         * @summary A base event class providing just a type and defaultPrevented properties.
         * @constructs
         * @param {string} type - The type for this event.
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
        construct: function(type){
            if (_is.empty(type))
                throw new SyntaxError('FooUtils.Event objects must be supplied a `type`.');

            var namespaced = _str.contains(type, ".");
            /**
             * @summary The type of event.
             * @memberof FooUtils.Event#
             * @name type
             * @type {string}
             * @readonly
             */
            this.type = namespaced ? _str.until(type, ".") : type;
            /**
             * @summary The namespace of the event.
             * @memberof FooUtils.Event#
             * @name namespace
             * @type {string}
             * @readonly
             */
            this.namespace = namespaced ? _str.from(type, ".") : null;
            /**
             * @summary Whether the default action should be taken or not.
             * @memberof FooUtils.Event#
             * @name defaultPrevented
             * @type {boolean}
             * @readonly
             */
            this.defaultPrevented = false;
            /**
             * @summary The {@link FooUtils.EventClass} that triggered this event.
             * @memberof FooUtils.Event#
             * @name target
             * @type {FooUtils.EventClass}
             * @readonly
             */
            this.target = null;
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

    _.EventClass = _.Class.extend(/** @lends FooUtils.EventClass.prototype */{
        /**
         * @summary A base class that implements a basic events interface.
         * @constructs
         * @description This is a very basic events implementation that provides just enough to cover most needs.
         */
        construct: function(){
            /**
             * @summary The object used internally to register event handlers.
             * @memberof FooUtils.EventClass#
             * @name events
             * @type {Object}
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
                Object.keys(events).forEach(function(key){
                    key.split(" ").forEach(function(type){
                        self.addListener(type, events[key], thisArg);
                    });
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

            var self = this;
            thisArg = _is.undef(thisArg) ? self : thisArg;

            var namespaced = _str.contains(event, "."),
                type = namespaced ? _str.until(event, ".") : event,
                namespace = namespaced ? _str.from(event, ".") : null;

            if (!_is.array(self.events[type])){
                self.events[type] = [];
            }
            var exists = self.events[type].some(function(h){
                return h.namespace === namespace && h.fn === listener && h.thisArg === thisArg;
            });
            if (!exists){
                self.events[type].push({
                    namespace: namespace,
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
                thisArg = _is.undef(listener) ? self : listener;
                Object.keys(events).forEach(function(key){
                    key.split(" ").forEach(function(type){
                        self.removeListener(type, _is.fn(events[key]) ? events[key] : null, thisArg);
                    });
                });
            } else if (_is.string(events)) {
                listener = _is.fn(listener) ? listener : null;
                thisArg = _is.undef(thisArg) ? self : thisArg;
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

            var self = this;
            thisArg = _is.undef(thisArg) ? self : thisArg;

            var type = _str.until(event, ".") || null,
                namespace = _str.from(event, ".") || null,
                types = [];

            if (!_is.empty(type)){
                types.push(type);
            } else if (!_is.empty(namespace)){
                types.push.apply(types, Object.keys(self.events));
            }

            types.forEach(function(type){
                if (!_is.array(self.events[type])) return;
                self.events[type] = self.events[type].filter(function (h) {
                    if (listener != null){
                        return !(h.namespace === namespace && h.fn === listener && h.thisArg === thisArg);
                    }
                    if (namespace != null){
                        return h.namespace !== namespace;
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