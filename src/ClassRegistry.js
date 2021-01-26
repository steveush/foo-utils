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
