"use strict";

/*!
* FooUtils - Contains common utility methods and classes used in our plugins.
* @version 1.0.0
* @link https://github.com/steveush/foo-utils#readme
* @copyright Steve Usher 2021
* @license Released under the GPL-3.0 license.
*/
(function ($, _, _is, _fn, _obj) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary A simple timer that triggers events.
   * @memberof FooUtils.
   * @class Timer
   * @param {number} [interval=1000] - The internal tick interval of the timer.
   */

  _.Timer = _.EventClass.extend(
  /** @lends FooUtils.Timer */
  {
    /**
     * @ignore
     * @constructs
     * @param {number} [interval=1000]
     */
    construct: function construct(interval) {
      var self = this;

      self._super();
      /**
       * @summary The internal tick interval of the timer in milliseconds.
       * @memberof FooUtils.Timer#
       * @name interval
       * @type {number}
       * @default 1000
       * @readonly
       */


      self.interval = _is.number(interval) ? interval : 1000;
      /**
       * @summary Whether the timer is currently running or not.
       * @memberof FooUtils.Timer#
       * @name isRunning
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.isRunning = false;
      /**
       * @summary Whether the timer is currently paused or not.
       * @memberof FooUtils.Timer#
       * @name isPaused
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.isPaused = false;
      /**
       * @summary Whether the timer can resume from a previous state or not.
       * @memberof FooUtils.Timer#
       * @name canResume
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.canResume = false;
      /**
       * @summary Whether the timer can restart or not.
       * @memberof FooUtils.Timer#
       * @name canRestart
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.canRestart = false;
      /**
       * @summary The internal tick timeout ID.
       * @memberof FooUtils.Timer#
       * @name __timeout
       * @type {?number}
       * @default null
       * @private
       */

      self.__timeout = null;
      /**
       * @summary Whether the timer is incrementing or decrementing.
       * @memberof FooUtils.Timer#
       * @name __decrement
       * @type {boolean}
       * @default false
       * @private
       */

      self.__decrement = false;
      /**
       * @summary The total time for the timer.
       * @memberof FooUtils.Timer#
       * @name __time
       * @type {number}
       * @default 0
       * @private
       */

      self.__time = 0;
      /**
       * @summary The remaining time for the timer.
       * @memberof FooUtils.Timer#
       * @name __remaining
       * @type {number}
       * @default 0
       * @private
       */

      self.__remaining = 0;
      /**
       * @summary The current time for the timer.
       * @memberof FooUtils.Timer#
       * @name __current
       * @type {number}
       * @default 0
       * @private
       */

      self.__current = 0;
      /**
       * @summary The final time for the timer.
       * @memberof FooUtils.Timer#
       * @name __finish
       * @type {number}
       * @default 0
       * @private
       */

      self.__finish = 0;
      /**
       * @summary The last arguments supplied to the {@link FooUtils.Timer#start|start} method.
       * @memberof FooUtils.Timer#
       * @name __restart
       * @type {Array}
       * @default []
       * @private
       */

      self.__restart = [];
    },

    /**
     * @summary Resets the timer back to a fresh starting state.
     * @memberof FooUtils.Timer#
     * @function __reset
     * @private
     */
    __reset: function __reset() {
      var self = this;
      clearTimeout(self.__timeout);
      self.__timeout = null;
      self.__decrement = false;
      self.__time = 0;
      self.__remaining = 0;
      self.__current = 0;
      self.__finish = 0;
      self.isRunning = false;
      self.isPaused = false;
      self.canResume = false;
    },

    /**
     * @summary Generates event args to be passed to listeners of the timer events.
     * @memberof FooUtils.Timer#
     * @function __eventArgs
     * @param {...*} [args] - Any number of additional arguments to pass to an event listener.
     * @return {Array} - The first 3 values of the result will always be the current time, the total time and boolean indicating if the timer is decremental.
     * @private
     */
    __eventArgs: function __eventArgs(args) {
      var self = this;
      return [self.__current, self.__time, self.__decrement].concat(_fn.arg2arr(arguments));
    },

    /**
     * @summary Performs the tick for the timer checking and modifying the various internal states.
     * @memberof FooUtils.Timer#
     * @function __tick
     * @private
     */
    __tick: function __tick() {
      var self = this;
      self.trigger("tick", self.__eventArgs());

      if (self.__current === self.__finish) {
        self.trigger("complete", self.__eventArgs());

        self.__reset();
      } else {
        if (self.__decrement) {
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
    start: function start(time, decrement) {
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
    countdown: function countdown(time) {
      this.start(time, true);
    },

    /**
     * @summary Starts the timer counting up from `0` to the supplied `time`.
     * @memberof FooUtils.Timer#
     * @function countup
     * @param {number} time - The total time in seconds for the timer.
     */
    countup: function countup(time) {
      this.start(time, false);
    },

    /**
     * @summary Stops and then restarts the timer using the last arguments supplied to the {@link FooUtils.Timer#start|start} method.
     * @memberof FooUtils.Timer#
     * @function restart
     */
    restart: function restart() {
      var self = this;
      self.stop();

      if (self.canRestart) {
        self.start.apply(self, self.__restart);
      }
    },

    /**
     * @summary Stops the timer.
     * @memberof FooUtils.Timer#
     * @function stop
     */
    stop: function stop() {
      var self = this;

      if (self.isRunning || self.isPaused) {
        self.__reset();

        self.trigger("stop", self.__eventArgs());
      }
    },

    /**
     * @summary Pauses the timer and returns the remaining seconds.
     * @memberof FooUtils.Timer#
     * @function pause
     * @return {number} - The number of seconds remaining for the timer.
     */
    pause: function pause() {
      var self = this;

      if (self.__timeout != null) {
        clearTimeout(self.__timeout);
        self.__timeout = null;
      }

      if (self.isRunning) {
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
    resume: function resume() {
      var self = this;

      if (self.canResume) {
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
    reset: function reset() {
      var self = this;

      self.__reset();

      self.trigger("reset", this.__eventArgs());
    }
  });
})(FooUtils.$, FooUtils, FooUtils.is, FooUtils.fn, FooUtils.obj);
