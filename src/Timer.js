(function($, _, _is, _fn, _obj){
    // only register methods if this version is the current version
    if (_.version !== '@@version') return;

    /**
     * @summary A simple timer that triggers events.
     * @memberof FooUtils.
     * @class Timer
     * @param {number} [interval=1000] - The internal tick interval of the timer.
     */
    _.Timer = _.EventClass.extend(/** @lends FooUtils.Timer */{
        /**
         * @ignore
         * @constructs
         * @param {number} [interval=1000]
         */
        construct: function(interval){
            this._super();
            /**
             * @summary The internal tick interval of the timer in milliseconds.
             * @memberof FooUtils.Timer#
             * @name interval
             * @type {number}
             * @default 1000
             * @readonly
             */
            this.interval = _is.number(interval) ? interval : 1000;
            /**
             * @summary Whether the timer is currently running or not.
             * @memberof FooUtils.Timer#
             * @name isRunning
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.isRunning = false;
            /**
             * @summary Whether the timer is currently paused or not.
             * @memberof FooUtils.Timer#
             * @name isPaused
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.isPaused = false;
            /**
             * @summary Whether the timer can resume from a previous state or not.
             * @memberof FooUtils.Timer#
             * @name canResume
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.canResume = false;
            /**
             * @summary Whether the timer can restart or not.
             * @memberof FooUtils.Timer#
             * @name canRestart
             * @type {boolean}
             * @default false
             * @readonly
             */
            this.canRestart = false;
            /**
             * @summary The internal tick timeout ID.
             * @memberof FooUtils.Timer#
             * @name __timeout
             * @type {?number}
             * @default null
             * @private
             */
            this.__timeout = null;
            /**
             * @summary Whether the timer is incrementing or decrementing.
             * @memberof FooUtils.Timer#
             * @name __decrement
             * @type {boolean}
             * @default false
             * @private
             */
            this.__decrement = false;
            /**
             * @summary The total time for the timer.
             * @memberof FooUtils.Timer#
             * @name __time
             * @type {number}
             * @default 0
             * @private
             */
            this.__time = 0;
            /**
             * @summary The remaining time for the timer.
             * @memberof FooUtils.Timer#
             * @name __remaining
             * @type {number}
             * @default 0
             * @private
             */
            this.__remaining = 0;
            /**
             * @summary The current time for the timer.
             * @memberof FooUtils.Timer#
             * @name __current
             * @type {number}
             * @default 0
             * @private
             */
            this.__current = 0;
            /**
             * @summary The final time for the timer.
             * @memberof FooUtils.Timer#
             * @name __finish
             * @type {number}
             * @default 0
             * @private
             */
            this.__finish = 0;
            /**
             * @summary The last arguments supplied to the {@link FooUtils.Timer#start|start} method.
             * @memberof FooUtils.Timer#
             * @name __restart
             * @type {Array}
             * @default []
             * @private
             */
            this.__restart = [];
        },
        /**
         * @summary Resets the timer back to a fresh starting state.
         * @memberof FooUtils.Timer#
         * @function __reset
         * @private
         */
        __reset: function(){
            clearTimeout(this.__timeout);
            this.__timeout = null;
            this.__decrement = false;
            this.__time = 0;
            this.__remaining = 0;
            this.__current = 0;
            this.__finish = 0;
            this.isRunning = false;
            this.isPaused = false;
            this.canResume = false;
        },
        /**
         * @summary Generates event args to be passed to listeners of the timer events.
         * @memberof FooUtils.Timer#
         * @function __eventArgs
         * @param {...*} [args] - Any number of additional arguments to pass to an event listener.
         * @return {Array} - The first 3 values of the result will always be the current time, the total time and boolean indicating if the timer is decremental.
         * @private
         */
        __eventArgs: function(args){
            return [
                this.__current,
                this.__time,
                this.__decrement
            ].concat(_fn.arg2arr(arguments));
        },
        /**
         * @summary Performs the tick for the timer checking and modifying the various internal states.
         * @memberof FooUtils.Timer#
         * @function __tick
         * @private
         */
        __tick: function(){
            var self = this;
            self.trigger("tick", self.__eventArgs());
            if (self.__current === self.__finish){
                self.trigger("complete", self.__eventArgs());
                self.__reset();
            } else {
                if (self.__decrement){
                    self.__current--;
                } else {
                    self.__current++;
                }
                self.__remaining--;
                self.canResume = self.__remaining > 0;
                self.__timeout = setTimeout(function () {
                    self.__tick();
                }, self.interval);
            }
        },
        /**
         * @summary Starts the timer using the supplied `time` and whether or not to increment or decrement from the value.
         * @memberof FooUtils.Timer#
         * @function start
         * @param {number} time - The total time in seconds for the timer.
         * @param {boolean} [decrement=false] - Whether the timer should increment or decrement from or to the supplied time.
         */
        start: function(time, decrement){
            var self = this;
            if (self.isRunning) return;
            decrement = _is.boolean(decrement) ? decrement : false;
            self.__restart = [time, decrement];
            self.__decrement = decrement;
            self.__time = time;
            self.__remaining = time;
            self.__current = decrement ? time : 0;
            self.__finish = decrement ? 0 : time;
            self.canRestart = true;
            self.isRunning = true;
            self.isPaused = false;
            self.trigger("start", self.__eventArgs());
            self.__tick();
        },
        /**
         * @summary Starts the timer counting down to `0` from the supplied `time`.
         * @memberof FooUtils.Timer#
         * @function countdown
         * @param {number} time - The total time in seconds for the timer.
         */
        countdown: function(time){
            this.start(time, true);
        },
        /**
         * @summary Starts the timer counting up from `0` to the supplied `time`.
         * @memberof FooUtils.Timer#
         * @function countup
         * @param {number} time - The total time in seconds for the timer.
         */
        countup: function(time){
            this.start(time, false);
        },
        /**
         * @summary Stops and then restarts the timer using the last arguments supplied to the {@link FooUtils.Timer#start|start} method.
         * @memberof FooUtils.Timer#
         * @function restart
         */
        restart: function(){
            this.stop();
            if (this.canRestart){
                this.start.apply(this, this.__restart);
            }
        },
        /**
         * @summary Stops the timer.
         * @memberof FooUtils.Timer#
         * @function stop
         */
        stop: function(){
            if (this.isRunning || this.isPaused){
                this.__reset();
                this.trigger("stop", this.__eventArgs());
            }
        },
        /**
         * @summary Pauses the timer and returns the remaining seconds.
         * @memberof FooUtils.Timer#
         * @function pause
         * @return {number} - The number of seconds remaining for the timer.
         */
        pause: function(){
            var self = this;
            if (self.__timeout != null){
                clearTimeout(self.__timeout);
                self.__timeout = null;
            }
            if (self.isRunning){
                self.isRunning = false;
                self.isPaused = true;
                self.trigger("pause", self.__eventArgs());
            }
            return self.__remaining;
        },
        /**
         * @summary Resumes the timer from a previously paused state.
         * @memberof FooUtils.Timer#
         * @function resume
         */
        resume: function(){
            var self = this;
            if (self.canResume){
                self.isRunning = true;
                self.isPaused = false;
                self.trigger("resume", self.__eventArgs());
                self.__tick();
            }
        },
        /**
         * @summary Resets the timer back to a fresh starting state.
         * @memberof FooUtils.Timer#
         * @function reset
         */
        reset: function(){
            this.__reset();
            this.trigger("reset", this.__eventArgs());
        }
    });

})(
    FooUtils.$,
    FooUtils,
    FooUtils.is,
    FooUtils.fn,
    FooUtils.obj
);
