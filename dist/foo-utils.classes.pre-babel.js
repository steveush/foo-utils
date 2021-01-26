/*!
* FooUtils - Contains common utility methods and classes used in our plugins.
* @version 1.0.0
* @link https://github.com/steveush/foo-utils#readme
* @copyright Steve Usher 2021
* @license Released under the GPL-3.0 license.
*/
(function ($, _, _is, _obj, _fn) {
	// only register methods if this version is the current version
	if (_.version !== '1.0.0') return;

	/**
	 * @summary A base class providing some helper methods for prototypal inheritance.
	 * @memberof FooUtils.
	 * @constructs Class
	 * @description This is a base class for making prototypal inheritance simpler to work with. It provides an easy way to inherit from another class and exposes a `_super` method within the scope of any overriding methods that allows a simple way to execute the overridden function.
	 *
	 * Have a look at the {@link FooUtils.Class.extend|extend} and {@link FooUtils.Class.override|override} method examples to see some basic usage.
	 * @example {@caption When using this base class the actual construction of a class is performed by the `construct` method.}
	 * var MyClass = FooUtils.Class.extend({
	 * 	construct: function(arg1, arg2){
	 * 		// handle the construction logic here
	 * 	}
	 * });
	 *
	 * // use the class
	 * var myClass = new MyClass( "arg1:value", "arg2:value" );
	 */
	_.Class = function(){};

	/**
	 * @ignore
	 * @summary The original function when within the scope of an overriding method.
	 * @memberof FooUtils.Class#
	 * @function _super
	 * @param {...*} [argN] - The same arguments as the base method.
	 * @returns {*} The result of the base method.
	 * @description This is only available within the scope of an overriding method if it was created using the {@link FooUtils.Class.extend|extend}, {@link FooUtils.Class.override|override} or {@link FooUtils.fn.addOrOverride} methods.
	 * @see {@link FooUtils.fn.addOrOverride} to see an example of how this property is used.
	 */

	/**
	 * @summary Creates a new class that inherits from this one which in turn allows itself to be extended.
	 * @memberof FooUtils.Class.
	 * @function extend
	 * @param {Object} [definition] - An object containing any methods to implement/override.
	 * @returns {function} A new class that inherits from the base class.
	 * @description Every class created using this method has both the {@link FooUtils.Class.extend|extend} and {@link FooUtils.Class.override|override} static methods added to it to allow it to be extended.
	 * @example {@caption The below shows an example of how to implement inheritance using this method.}{@run true}
	 * // create a base Person class
	 * var Person = FooUtils.Class.extend({
	 * 	construct: function(isDancing){
	 * 		this.dancing = isDancing;
	 * 	},
	 * 	dance: function(){
	 * 		return this.dancing;
	 * 	}
	 * });
	 *
	 * var Ninja = Person.extend({
	 * 	construct: function(){
	 * 		// Call the inherited version of construct()
	 * 		this._super( false );
	 * 	},
	 * 	dance: function(){
	 * 		// Call the inherited version of dance()
	 * 		return this._super();
	 * 	},
	 * 	swingSword: function(){
	 * 		return true;
	 * 	}
	 * });
	 *
	 * var p = new Person(true);
	 * console.log( p.dance() ); // => true
	 *
	 * var n = new Ninja();
	 * console.log( n.dance() ); // => false
	 * console.log( n.swingSword() ); // => true
	 * console.log(
	 * 	p instanceof Person && p.constructor === Person && p instanceof FooUtils.Class
	 * 	&& n instanceof Ninja && n.constructor === Ninja && n instanceof Person && n instanceof FooUtils.Class
	 * ); // => true
	 */
	_.Class.extend = function(definition){
		definition = _is.hash(definition) ? definition : {};
		const proto = _obj.create(this.prototype); // create a new prototype to work with so we don't modify the original
		// iterate over all properties in the supplied definition and update the prototype
		for (const name in definition) {
			if (!definition.hasOwnProperty(name)) continue;
			_fn.addOrOverride(proto, name, definition[name]);
		}
		// if no construct method is defined add a default one that does nothing
		proto.construct = _is.fn(proto.construct) ? proto.construct : function(){};

		// create the new class using the prototype made above
		function Class() {
			if (!_is.fn(this.construct))
				throw new SyntaxError('FooUtils.Class objects must be constructed with the "new" keyword.');
			this.construct.apply(this, arguments);
		}
		Class.prototype = proto;
		//noinspection JSUnresolvedVariable
		Class.prototype.constructor = _is.fn(proto.__ctor__) ? proto.__ctor__ : Class;
		Class.extend = _.Class.extend;
		Class.override = _.Class.override;
		Class.getBaseClasses = _.Class.getBaseClasses;
		Class.__baseClass__ = this;
		return Class;
	};

	/**
	 * @summary Overrides a single method on this class.
	 * @memberof FooUtils.Class.
	 * @function override
	 * @param {string} name - The name of the function to override.
	 * @param {function} fn - The new function to override with, the `_super` method will be made available within this function.
	 * @description This is a helper method for overriding a single function of a {@link FooUtils.Class} or one of its child classes. This uses the {@link FooUtils.fn.addOrOverride} method internally and simply provides the correct prototype.
	 * @example {@caption The below example wraps the `Person.prototype.dance` method with a new one that inverts the result. Note the override applies even to instances of the class that are already created.}{@run true}
	 * var Person = FooUtils.Class.extend({
	 *   construct: function(isDancing){
	 *     this.dancing = isDancing;
	 *   },
	 *   dance: function(){
	 *     return this.dancing;
	 *   }
	 * });
	 *
	 * var p = new Person(true);
	 * console.log( p.dance() ); // => true
	 *
	 * Person.override("dance", function(){
	 * 	// Call the original version of dance()
	 * 	return !this._super();
	 * });
	 *
	 * console.log( p.dance() ); // => false
	 */
	_.Class.override = function(name, fn){
		_fn.addOrOverride(this.prototype, name, fn);
	};

	/**
	 * @summary The base class for this class.
	 * @memberof FooUtils.Class.
	 * @name __baseClass__
	 * @type {?FooUtils.Class}
	 * @private
	 */
	_.Class.__baseClass__ = null;

	function getBaseClasses(klass, result){
		if (!_is.array(result)) result = [];
		if (_is.fn(klass) && klass.__baseClass__ !== null){
			result.unshift(klass.__baseClass__);
			return getBaseClasses(klass.__baseClass__, result);
		}
		return result;
	}

	/**
	 * @summary Get an array of all base classes for this class.
	 * @memberof FooUtils.Class.
	 * @function getBaseClasses
	 * @returns {FooUtils.Class[]}
	 */
	_.Class.getBaseClasses = function(){
		return getBaseClasses(this, []);
	};
})(
	// dependencies
	FooUtils.$,
	FooUtils,
	FooUtils.is,
	FooUtils.obj,
	FooUtils.fn
);
(function($, _, _is, _fn, _obj){

    /**
     * @summary A registry class allowing classes to be easily registered and created.
     * @memberof FooUtils.
     * @class ClassRegistry
     * @param {FooUtils.ClassRegistry~Options} [options] - The options for the registry.
     * @augments FooUtils.Class
     * @borrows FooUtils.Class.extend as extend
     * @borrows FooUtils.Class.override as override
     * @borrows FooUtils.Class.getBaseClasses as getBaseClasses
     */
    _.ClassRegistry = _.Class.extend(/** @lends FooUtils.ClassRegistry.prototype */{
        /**
         * @ignore
         * @constructs
         * @param {FooUtils.ClassRegistry~Options} [options] - The options for the registry.
         */
        construct: function (options) {
            const self = this;
            /**
             * @summary A callback allowing the arguments supplied to the constructor of a new class to be modified.
             * @callback FooUtils.ClassRegistry~beforeCreate
             * @param {FooUtils.ClassRegistry~RegisteredClass} registered - The registered object containing all the information for the class being created.
             * @param {Array} args - An array of all arguments to be supplied to the constructor of the new class.
             * @returns {Array} Returns an array of all arguments to be supplied to the constructor of the new class.
             * @this FooUtils.ClassRegistry
             */

            /**
             * @summary The options for the registry.
             * @typedef {?Object} FooUtils.ClassRegistry~Options
             * @property {boolean} [allowBase] - Whether or not to allow base classes to be created. Base classes are registered with a priority below 0.
             * @property {?FooUtils.ClassRegistry~beforeCreate} [beforeCreate] - A callback executed just prior to creating an instance of a registered class. This must return an array of arguments to supply to the constructor of the new class.
             */

            /**
             * @summary The options for this instance.
             * @memberof FooUtils.ClassRegistry#
             * @name opt
             * @type {FooUtils.ClassRegistry~Options}
             */
            self.opt = _obj.extend({
                allowBase: true,
                beforeCreate: null
            }, options);

            /**
             * @summary An object detailing a registered class.
             * @typedef {?Object} FooUtils.ClassRegistry~RegisteredClass
             * @property {string} name - The name of the class.
             * @property {FooUtils.Class} ctor - The class constructor.
             * @property {string} selector - The CSS selector for the class.
             * @property {Object} config - The configuration object for the class providing default values that can be overridden at runtime.
             * @property {number} priority - This determines the index for the class when using the {@link FooUtils.ClassRegistry#find|find} method, a higher value equals a lower index.
             */

            /**
             * @summary An object containing all registered classes.
             * @memberof FooUtils.ClassRegistry#
             * @name registered
             * @type {Object.<string, FooUtils.ClassRegistry~RegisteredClass>}
             * @readonly
             * @example {@caption The following shows the structure of this object. The `<name>` placeholders would be the name the class was registered with.}
             * {
             * 	"<name>": {
             * 		"name": <string>,
             * 		"ctor": <function>,
             * 		"selector": <string>,
             * 		"config": <object>,
             * 		"priority": <number>
             * 	},
             * 	"<name>": {
             * 		"name": <string>,
             * 		"ctor": <function>,
             * 		"selector": <string>,
             * 		"config": <object>,
             * 		"priority": <number>
             * 	},
             * 	...
             * }
             */
            self.registered = {};
        },
        /**
         * @summary Register a class constructor with the provided `name`.
         * @memberof FooUtils.ClassRegistry#
         * @function register
         * @param {string} name - The name of the class.
         * @param {FooUtils.Class} klass - The class constructor to register.
         * @param {Object} [config] - The configuration object for the class providing default values that can be overridden at runtime.
         * @param {number} [priority=0] - This determines the index for the class when using the {@link FooUtils.ClassRegistry#find|find} method, a higher value equals a lower index.
         * @returns {boolean} Returns `true` if the class was successfully registered.
         */
        register: function(name, klass, config, priority){
            const self = this;
            if (_is.string(name) && !_is.empty(name) && _is.fn(klass)) {
                priority = _is.number(priority) ? priority : 0;
                const current = self.registered[name];
                self.registered[name] = {
                    name: name,
                    ctor: klass,
                    config: _is.hash(config) ? config : {},
                    priority: !_is.undef(current) ? current.priority : priority
                };
                return true;
            }
            return false;
        },
        /**
         * @summary The callback function for the {@link FooUtils.ClassRegistry#each|each} method.
         * @callback FooUtils.ClassRegistry~eachCallback
         * @param {FooUtils.ClassRegistry~RegisteredClass} registered - The current registered class being iterated over.
         * @param {number} index - The array index of the `registered` object.
         * @returns {(boolean|undefined)} Return `false` to break out of the loop, all other values are ignored.
         */
        /**
         * @summary Iterates over all registered classes executing the provided callback once per class.
         * @param {FooUtils.ClassRegistry~eachCallback} callback - The callback to execute for each registered class.
         * @param {boolean} [prioritize=false] - Whether or not the registered classes should be prioritized before iteration.
         * @param {*} [thisArg] - The value of `this` within the callback.
         */
        each: function(callback, prioritize, thisArg){
            prioritize = _is.boolean(prioritize) ? prioritize : false;
            thisArg = _is.undef(thisArg) ? callback : thisArg;
            const self = this, names = Object.keys(self.registered), registered = names.map(function (name) {
                return self.registered[name];
            });
            if (prioritize){
                registered.sort(function(a, b){ return b.priority - a.priority; });
            }
            let i = 0, l = registered.length;
            for (; i < l; i++){
                const result = callback.call(thisArg, registered[i], i);
                if (result === false) break;
            }
        },
        /**
         * @summary The callback function for the {@link FooUtils.ClassRegistry#find|find} method.
         * @callback FooUtils.ClassRegistry~findCallback
         * @param {FooUtils.ClassRegistry~RegisteredClass} registered - The current registered class being iterated over.
         * @param {number} index - The array index of the `registered` object.
         * @returns {boolean} `true` to return the current registered class.
         */
        /**
         * @summary Iterates through all registered classes until the supplied `callback` returns a truthy value.
         * @param {FooUtils.ClassRegistry~findCallback} callback - The callback to execute for each registered class.
         * @param {boolean} [prioritize=false] - Whether or not the registered classes should be prioritized before iteration.
         * @param {*} [thisArg] - The value of `this` within the callback.
         * @returns {?FooUtils.ClassRegistry~RegisteredClass} `null` if no registered class satisfied the `callback`.
         */
        find: function(callback, prioritize, thisArg){
            prioritize = _is.boolean(prioritize) ? prioritize : false;
            thisArg = _is.undef(thisArg) ? callback : thisArg;
            const self = this, names = Object.keys(self.registered), registered = names.map(function (name) {
                return self.registered[name];
            });
            if (prioritize){
                registered.sort(function(a, b){ return b.priority - a.priority; });
            }
            let i = 0, l = registered.length;
            for (; i < l; i++){
                if (callback.call(thisArg, registered[i], i)){
                    return registered[i];
                }
            }
            return null;
        },
        /**
         * @summary Create a new instance of a registered class by `name`.
         * @memberof FooUtils.ClassRegistry#
         * @function create
         * @param {string} name - The name of the class to create.
         * @param {Object} [config] - Any custom configuration to supply to the class.
         * @param {...*} [argN] - Any number of additional arguments to pass to the class constructor.
         * @returns {?FooUtils.Class} Returns `null` if no registered class can handle the supplied `element`.
         */
        create: function(name, config, argN){
            const self = this, args = _fn.arg2arr(arguments);
            name = args.shift();
            if (_is.string(name) && self.registered.hasOwnProperty(name)){
                const registered = self.registered[name];
                let allowed = true;
                if (registered.priority < 0 && !self.opt.allowBase) allowed = false;
                if (allowed && _is.fn(registered.ctor)){
                    config = args.shift();
                    config = self.mergeConfigurations(registered.name, config);
                    args.unshift.apply(args, [registered.name, config]);
                    return _fn.apply(registered.ctor, self.onBeforeCreate(registered, args));
                }
            }
            return null;
        },
        /**
         * @summary Executes the beforeCreate callback if supplied and gives sub-classes an easy way to modify the arguments supplied to newly created classes.
         * @memberof FooUtils.ClassRegistry#
         * @function onBeforeCreate
         * @param {FooUtils.ClassRegistry~RegisteredClass} registered - The registered class about to be created.
         * @param {Array} args - The array of arguments to be supplied to the registered class constructor.
         * @returns {Array}
         */
        onBeforeCreate: function(registered, args){
            const self = this;
            if (self.opt.beforeCreate !== null && _is.fn(self.opt.beforeCreate)){
                return self.opt.beforeCreate.call(self, registered, args);
            }
            return args;
        },
        /**
         * @summary Get the merged configuration for a class.
         * @memberof FooUtils.ClassRegistry#
         * @function mergeConfigurations
         * @param {string} name - The name of the class to get the config for.
         * @param {Object} [config] - The user supplied defaults to override.
         * @returns {Object}
         */
        mergeConfigurations: function(name, config){
            const self = this;
            if (_is.string(name) && self.registered.hasOwnProperty(name)){
                // check params
                config = _is.hash(config) ? config : {};

                const baseClasses = self.getBaseClasses(name),
                    eArgs = [{}];

                baseClasses.push(self.registered[name]);
                baseClasses.forEach(function(reg){
                    eArgs.push(reg.config);
                });
                eArgs.push(config);

                return _obj.extend.apply(_obj, eArgs);
            }
            return {};
        },
        /**
         * @summary Gets the registered base class for this instance.
         * @memberof FooUtils.ClassRegistry#
         * @function getBaseClass
         * @returns {?FooUtils.ClassRegistry~RegisteredClass}
         */
        getBaseClass: function(){
            return this.find(function(registered){
                return registered.priority < 0;
            }, true);
        },
        /**
         * @summary Get all registered base classes for the supplied `name`.
         * @memberof FooUtils.ClassRegistry#
         * @function getBaseClasses
         * @param {string} name - The name of the class to get the base classes for.
         * @returns {FooUtils.ClassRegistry~RegisteredClass[]}
         */
        getBaseClasses: function(name){
            const self = this, reg = self.registered[name], result = [];
            if (!_is.undef(reg)) {
                reg.ctor.getBaseClasses().forEach(function(base){
                    const found = self.fromType(base);
                    if (_is.hash(found)){
                        result.push(found);
                    }
                });
            }
            return result;
        },
        /**
         * @summary Attempts to find a registered class given the type/constructor.
         * @memberof FooUtils.ClassRegistry#
         * @function fromType
         * @param {FooUtils.Class} type - The type/constructor of the registered class to find.
         * @returns {(FooUtils.ClassRegistry~RegisteredClass|undefined)} Returns the registered class if found. Otherwise, `undefined` is returned.
         */
        fromType: function(type){
            if (!_is.fn(type)) return;
            return this.find(function(registered){
                return registered.ctor === type;
            });
        }
    });

})(
    FooUtils.$,
    FooUtils,
    FooUtils.is,
    FooUtils.fn,
    FooUtils.obj
);

(function (_, _is, _str) {
    // only register methods if this version is the current version
    if (_.version !== '1.0.0') return;

    // noinspection JSUnusedGlobalSymbols
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
        /**
         * @ignore
         * @constructs
         * @param {string} type
         **/
        construct: function(type){
            if (_is.empty(type))
                throw new SyntaxError('FooUtils.Event objects must be supplied a `type`.');

            const self = this, parsed = _.Event.parse(type);
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
             * @summary The original {@link FooUtils.EventClass} that triggered this event.
             * @memberof FooUtils.Event#
             * @name target
             * @type {FooUtils.EventClass}
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
        const namespaced = _str.contains(event, ".");
        return {
            namespaced: namespaced,
            type: namespaced ? _str.startsWith(event, ".") ? null : _str.until(event, ".") : event,
            namespace: namespaced ? _str.from(event, ".") : null
        };
    };

    // noinspection JSUnusedGlobalSymbols
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
        /**
         * @ignore
         * @constructs
         **/
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
            const self = this;
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

            const self = this, parsed = _.Event.parse(event);
            thisArg = _is.undef(thisArg) ? self : thisArg;

            if (!_is.array(self.events[parsed.type])){
                self.events[parsed.type] = [];
            }
            const exists = self.events[parsed.type].some(function (h) {
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
            const self = this;
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

            const self = this, parsed = _.Event.parse(event), types = [];
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
            const self = this, result = [];
            if (event instanceof _.Event){
                result.push(event);
                self.emit(event, args);
            } else if (_is.string(event)) {
                event.split(" ").forEach(function(type){
                    const e = new _.Event(type);
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
            const self = this;
            args = _is.array(args) ? args : [];
            if (event.target === null) event.target = self;
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