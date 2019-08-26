(function (_, _is) {
    // only register methods if this version is the current version
    if (_.version !== '@@version') return;

    _.Event = _.Class.extend(/** @lends FooUtils.Class */{
        /**
         * @summary A base event class providing just a type and defaultPrevented properties.
         * @memberof FooUtils
         * @constructs Event
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
            /**
             * @summary The type of event.
             * @memberof FooUtils.Event#
             * @name type
             * @type {string}
             */
            this.type = type;
            /**
             * @summary Whether or not to prevent the default behavior following this event.
             * @memberof FooUtils.Event#
             * @name defaultPrevented
             * @type {boolean}
             */
            this.defaultPrevented = false;
        },
        /**
         * @summary Informs the class that raised this event that its default action should not be taken.
         * @memberof FooUtils.Event#
         * @function preventDefault
         */
        preventDefault: function(){
            this.defaultPrevented = true;
        }
    });

    _.EventClass = _.Class.extend(/** @lends FooUtils.Class */{
        /**
         * @summary A base class that implements a basic events interface.
         * @memberof FooUtils
         * @constructs EventClass
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
         * @summary Attach an event handler function for one or more events to the class.
         * @memberof FooUtils.EventClass#
         * @function on
         * @param {string} events - One or more space-separated event types.
         * @param {function} handler - A function to execute when the event is triggered.
         * @param {*} [thisArg] - The value of `this` within the `handler` function. Defaults to the `EventClass` raising the event.
         * @returns {this}
         */
        on: function(events, handler, thisArg){
            if (!_is.string(events) || !_is.fn(handler)) return this;
            thisArg = _is.undef(thisArg) ? this : thisArg;
            var self = this, handlers = self.__handlers, exists;
            events.split(" ").forEach(function(type){
                if (!_is.array(handlers[type])){
                    handlers[type] = [];
                }
                exists = handlers[type].some(function(h){
                    return h.fn === handler && h.thisArg === thisArg;
                });
                if (!exists){
                    handlers[type].push({
                        fn: handler,
                        thisArg: thisArg
                    });
                }
            });
            return self;
        },
        /**
         * @summary Remove an event handler function for one or more events from the class.
         * @memberof FooUtils.EventClass#
         * @function off
         * @param {string} events - One or more space-separated event types.
         * @param {function} handler - The handler to remove.
         * @param {*} [thisArg] - The value of `this` within the `handler` function.
         * @returns {FooUtils.EventClass}
         */
        off: function(events, handler, thisArg){
            if (!_is.string(events)) return this;
            handler = _is.fn(handler) ? handler : null;
            thisArg = _is.undef(thisArg) ? this : thisArg;
            var self = this, handlers = self.__handlers;
            events.split(" ").forEach(function(type){
                if (_is.array(handlers[type])){
                    if (handler != null){
                        handlers[type] = handlers[type].filter(function(h){
                            return !(h.fn === handler && h.thisArg === thisArg);
                        });
                        if (handlers[type].length === 0){
                            delete handlers[type];
                        }
                    } else {
                        delete handlers[type];
                    }
                }
            });
            return self;
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
            var instance = event instanceof _.Event;
            if (!instance && !_is.string(event)) return null;
            args = _is.array(args) ? args : [];
            var self = this,
                handlers = self.__handlers,
                result = [],
                _trigger = function(e){
                    result.push(e);
                    if (!_is.array(handlers[e.type])) return;
                    handlers[e.type].forEach(function (h) {
                        h.fn.apply(h.thisArg, [e].concat(args));
                    });
                };

            if (instance){
                _trigger(event);
            } else {
                event.split(" ").forEach(function(type){
                    _trigger(new _.Event(type));
                });
            }
            return _is.empty(result) ? null : (result.length === 1 ? result[0] : result);
        }
    });

})(
    // dependencies
    FooUtils,
    FooUtils.is
);