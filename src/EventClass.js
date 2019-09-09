(function (_, _is, _str) {
    // only register methods if this version is the current version
    if (_.version !== '@@version') return;

    _.Event = _.Class.extend(/** @lends FooUtils.Event */{
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

    _.EventClass = _.Class.extend(/** @lends FooUtils.EventClass */{
        /**
         * @summary A base class that implements a basic events interface.
         * @constructs
         * @description This is a very basic events implementation that provides just enough to cover most needs.
         */
        construct: function(){
            /**
             * @summary The object used internally to register event handlers.
             * @memberof FooUtils.EventClass#
             * @name __handlers
             * @type {Object}
             * @private
             */
            this.__handlers = {};
        },
        /**
         * @summary Destroy the current instance releasing used resources.
         * @memberof FooUtils.EventClass#
         * @function destroy
         */
        destroy: function(){
            this.__handlers = {};
        },
        /**
         * @summary Attach multiple event handler functions for one or more events to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {object} events - An object containing an event name to handler mapping.
         * @param {*} [thisArg] - The value of `this` within the `handler` function. Defaults to the `EventClass` raising the event.
         * @returns {this}
         *//**
         * @summary Attach an event handler function for one or more events to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {string} events - One or more space-separated event types.
         * @param {function} handler - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `handler` function. Defaults to the `EventClass` raising the event.
         * @returns {this}
         */
        on: function(events, handler, thisArg){
            var self = this;
            if (_is.object(events)){
                thisArg = _is.undef(handler) ? this : handler;
                Object.keys(events).forEach(function(type){
                    self.__on(type, events[type], thisArg);
                });
            } else if (_is.string(events) && _is.fn(handler)) {
                thisArg = _is.undef(thisArg) ? this : thisArg;
                events.split(" ").forEach(function(type){
                    self.__on(type, handler, thisArg);
                });
            }

            return self;
        },
        __on: function(event, handler, thisArg){
            var self = this,
                namespaced = _str.contains(event, "."),
                type = namespaced ? _str.until(event, ".") : event,
                namespace = namespaced ? _str.from(event, ".") : null;

            if (!_is.array(self.__handlers[type])){
                self.__handlers[type] = [];
            }
            var exists = self.__handlers[type].some(function(h){
                return h.namespace === namespace && h.fn === handler && h.thisArg === thisArg;
            });
            if (!exists){
                self.__handlers[type].push({
                    namespace: namespace,
                    fn: handler,
                    thisArg: thisArg
                });
            }
        },
        /**
         * @summary Remove multiple event handler functions for one or more events from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {object} events - An object containing an event name to handler mapping.
         * @param {*} [thisArg] - The value of `this` within the `handler` function. Defaults to the `EventClass` raising the event.
         * @returns {this}
         *//**
         * @summary Remove an event handler function for one or more events from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {string} events - One or more space-separated event types.
         * @param {function} handler - The handler to remove.
         * @param {*} [thisArg] - The value of `this` within the `handler` function.
         * @returns {this}
         */
        off: function(events, handler, thisArg){
            var self = this;
            if (_is.object(events)){
                thisArg = _is.undef(handler) ? this : handler;
                Object.keys(events).forEach(function(type){
                    self.__off(type, _is.fn(events[type]) ? events[type] : null, thisArg);
                });
            } else if (_is.string(events)) {
                handler = _is.fn(handler) ? handler : null;
                thisArg = _is.undef(thisArg) ? this : thisArg;
                events.split(" ").forEach(function(type){
                    self.__off(type, handler, thisArg);
                });
            }

            return self;
        },
        __off: function(event, handler, thisArg){
            var self = this,
                type = _str.until(event, ".") || null,
                namespace = _str.from(event, ".") || null,
                types = [];

            if (!_is.empty(type)){
                types.push(type);
            } else if (!_is.empty(namespace)){
                types.push.apply(types, Object.keys(self.__handlers));
            }

            types.forEach(function(type){
                if (!_is.array(self.__handlers[type])) return;
                self.__handlers[type] = self.__handlers[type].filter(function (h) {
                    if (handler != null){
                        return !(h.namespace === namespace && h.fn === handler && h.thisArg === thisArg);
                    }
                    if (namespace != null){
                        return h.namespace !== namespace;
                    }
                    return false;
                });
                if (self.__handlers[type].length === 0){
                    delete self.__handlers[type];
                }
            });
        },
        /**
         * @summary Trigger an event on the current class.
         * @memberof FooUtils.EventClass#
         * @function trigger
         * @param {(string|FooUtils.Event)} event - Either a space-separated string of event types or a custom event object to raise.
         * @param {Array} [args] - An array of additional arguments to supply to the handlers after the event object.
         * @returns {(FooUtils.Event|FooUtils.Event[]|null)} Returns the {@link FooUtils.Event|event object} of the triggered event. If more than one event was triggered an array of {@link FooUtils.Event|event objects} is returned. If no `event` was supplied or triggered `null` is returned.
         */
        trigger: function(event, args){
            args = _is.array(args) ? args : [];
            var self = this, result = [];
            if (event instanceof _.Event){
                result.push(event);
                self.__trigger(event, args);
            } else if (_is.string(event)) {
                event.split(" ").forEach(function(type){
                    var index = result.push(new _.Event(type)) - 1;
                    self.__trigger(result[index], args);
                });
            }
            return _is.empty(result) ? null : (result.length === 1 ? result[0] : result);
        },
        __trigger: function(event, args){
            var self = this;
            event.target = self;
            if (!_is.array(self.__handlers[event.type])) return;
            self.__handlers[event.type].forEach(function (h) {
                if (event.namespace != null && h.namespace !== event.namespace) return;
                h.fn.apply(h.thisArg, [event].concat(args));
            });
        }
    });

})(
    // dependencies
    FooUtils,
    FooUtils.is,
    FooUtils.str
);