[![NPM](https://nodei.co/npm/foo-utils.png?downloads=true)](https://nodei.co/npm/foo-utils/)

[![Dependency Status](https://img.shields.io/david/steveush/foo-utils.svg)](https://david-dm.org/steveush/foo-utils) [![devDependency Status](https://img.shields.io/david/dev/steveush/foo-utils.svg)](https://david-dm.org/steveush/foo-utils#info=devDependencies) [![Donate](https://img.shields.io/badge/Donate-PayPal-brightgreen.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DHYUFBMRBJLTW)

# FooUtils

Contains common utility methods and classes used in our plugins.

## Usage

Either use the `foo-utils.js` or `foo-utils.min.js` files in the dist/ directory with the default namespace `FooUtils` or if you want to embed this as part of another package you can rename the namespace and file as part of a copy/concat/uglify task by using something like the below.

```javascript
copy: {
    main: {
        src: './node_modules/foo-utils/dist/foo-utils.js',
        dest: 'compiled/my-api-utils.js',
        options: {
            process: function (content, srcpath) {
                return content.replace(/FooUtils/g, "MyApi.utils");
            }
        }
    }
},
```

The above simply regex replaces all occurrences of `FooUtils` to `MyApi.utils` within the JavaScript files and then renames the file to `my-api-utils.js`. As this is a simple regex replace the namespace `MyApi` **must** exist prior to the `my-api-utils.js` file being included in the page.

This package does expose a custom grunt task called `foo-utils` that can be used to perform the above and it requires just two options to be set; `namespace` and `dest`.

```javascript
"foo-utils": {
    options: {
        namespace: "MyApi.utils",
        dest: "./dist/my-api-utils.js"
    }
},
```

Ideally the above would be used as a step in a larger build process that would include the `my-api-utils.js` file as part of its own concat or uglify tasks resulting in a single file so any include order namespace issues are no longer a problem.

## Changelog

### 1.0.0

There are considerable changes for this version as I included babel in the build and performed a cleanup of old/unused methods.

* Breaking Change: Removed the `FooUtils.uniqueId` and `FooUtils.removeUniqueId` methods as they were no longer being used in any of our plugins.
* Breaking Change: Removed the `FooUtils.scrollParent` method as it was no longer being used due to issues in some browsers.
* Breaking Change: Removed the `FooUtils.src` method as it was no longer being used in any of our plugins.
* Breaking Change: Removed the `FooUtils.versionCompare` method as it was only being used by the lib when it registered itself and that was changed in version 0.2.0.
* Breaking Change: Removed the `FooUtils.animation` namespace and moved the `FooUtils.animation.requestFrame` and `FooUtils.animation.cancelFrame` methods to the base `FooUtils` namespace as `FooUtils.requestFrame` and `FooUtils.cancelFrame`.
* Breaking Change: Removed the `FooUtils.transition.transitionend` and `FooUtils.transition.supported` properties as all supported browsers now have support for the `transitionend` event and browser detection is no longer required.
* Breaking Change: Updated the signature of the `FooUtils.transition.start(element, triggerFn, propertyName, timeout)` method to provide better functionality now that all supported browsers support the `transitionend` event.
* Breaking Change: Removed the `FooUtils.Bounds` object as its functionality can be better implemented using an `IntersectionObserver`.
* Breaking Change: Removed the `FooUtils.fn.when` method and replaced it with `FooUtils.fn.all` and `FooUtils.fn.allSettled` to match the signatures of the standard `Promise` api.
* Breaking Change: Updated the signatures of the `FooUtils.fn.resolveWith` and `FooUtils.fn.rejectWith` methods to better match those provided by jQuery. The first parameter is now the `thisArg` within any callbacks.
* Breaking Change: Changed the `FooUtils.Class.bases` method to `FooUtils.Class.getBaseClasses`.
* Breaking Change: Removed the `FooUtils.fn.check` and `FooUtils.fn.fetch` methods as they were no longer being used in any of our plugins.
* Breaking Change: Removed the `FooUtils.Factory` class, use the new `FooUtils.ClassRegistry` class instead.
* Added new `FooUtils.ClassRegistry` class to replace the previous `FooUtils.Factory` class.
* Added new `FooUtils.transition.disable(element, modifyFn)` method to help with working with transitions. This method temporarily disables all transitions on an element, executes the callback to modify the element, and then enables all transitions again once modifications are complete.
* Added new `FooUtils.transition.modify(element, modifyFn [, immediate [, propertyName]])` method to help with working with transitions. The `immediate` parameter changes how the `modifyFn` is used; `true` is applied immediately with no transition, `false` is applied immediately but waits for the transition to end.
* Added new `FooUtils.fn.all` method to match the functionality provided by the `Promise.all` method.
* Added new `FooUtils.fn.allSettled` method to match the functionality provided by the `Promise.allSettled` method.
* Added new `FooUtils.fn.resolve` method to match the functionality provided by the `Promise.resolve` method and the previous `FooUtils.fn.resolveWith` method.
* Added new `FooUtils.fn.reject` method to match the functionality provided by the `Promise.reject` method and the previous `FooUtils.fn.rejectWith` method.

### 0.2.2

* Added new `FooUtils.inArray` method to test if a value exists in an array. Essentially a wrapper around the native `indexOf` method on an array, but it checks if the haystack is an actual array.

### 0.2.1

* Breaking Change: Removed the `FooUtils.Debugger` class, it's usefulness had come to an end, and it was reporting as a cookie in Chrome because it checked on the existence of localStorage as the script was parsed.
* Breaking Change: Removed the default instance of the `FooUtils.FullscreenAPI` class which was exposed as `FooUtils.fullscreen` as not all projects need it and initializing it by default was unnecessary overhead.

### 0.2.0

* Breaking Change: Changed how the lib registers itself to the global. Previously it would only register itself if it didn't exist, or the existing version was older. The version check is no longer performed.
* Added new `FooUtils.find` method to pluck a single value from an array or object.
* Added new `FooUtils.each` method to iterate over arrays or objects.
* Added new `FooUtils.Event.parse` method that splits an event name into its type and namespace.
* Updated the `FooUtils.transition.duration`, `FooUtils.animation.duration` and `FooUtils.animation.iterations` methods to handle multiple values.
* Updated the `FooUtils.EventClass` to expose various internal members publicly. This class now exposes an `events` object as well as a `addListener` and `removeListener` methods.
* Updated the `FooUtils.fn.when` method to handle values that are not promises passed in as part of the array.
* Updated the `FooUtils.str.format` method to use the new `FooUtils.each` method internally.
* Updated the `FooUtils.str.from` and `FooUtils.str.until` methods by simply removing unnecessary parameter checks.
* Updated the `devDependencies` in the `package.json`.
* Updated various comments across the library to give better intellisense.

### 0.1.9

* Added new `FooUtils.Class.bases` method to return an array of all inherited classes.

### 0.1.8

* Added new `FooUtils.str.kebab` method for formatting strings to kebab case (this-is-kebab).

### 0.1.7

* Fixed issue with transitions/animations not firing on newly appended elements.

### 0.1.6

* Fixed inconsistent results across browsers when using the `FooUtils.url.parts` method.
* Added new `FooUtils.animation` namespace containing various properties and methods to help with CSS animations.
* Added new `FooUtils.FullscreenAPI` class, exposed as the `FooUtils.fullscreen` instance, to provide a cross browser fullscreen API.
* Added new `FooUtils.Timer` class to provide a simple event based timer. 

### 0.1.5

* Fixed issue with the `FooUtils.EventClass`'s `on` and `off` methods when using an object with space separated event names.

### 0.1.4

* Updated the `FooUtils.EventClass` and `FooUtils.Event` classes to handle namespaced events.
* Updated the `FooUtils.EventClass`'s `on` and `off` methods to accept an object containing event type to handler mappings.

### 0.1.3

* Fixed context issue with `FooUtils.fn.debounce`.

### 0.1.2

* Updated `FooUtils.scrollParent( element, axis, def )` to explicitly test for `overflow:scroll` or `overflow:auto` rather than just not `overflow:hidden`.

### 0.1.1

* Updated `FooUtils.scrollParent( element, axis, def )` to exclude `<html/>` from the result as its scroll events are raised on the `document`.

### 0.1.0

Start of changelog. Older versions have no breaking changes.
* Breaking Change: Removed `FooUtils.Throttle` class, replaced with two methods `FooUtils.fn.debounce( fn, time )` and `FooUtils.fn.throttle( fn, time )`.
* Added new `FooUtils.EventClass` base class and `FooUtils.Event` classes to allow objects to be subscribed to and emit events through the supplied `.on( eventName, callback [, thisArg] )`, `.off( eventName [, callback] )` and `.trigger( eventName, args )` methods.
* Added new `FooUtils.selectify( classes )` method.
* Added new `FooUtils.src( src, srcset, srcWidth, srcHeight, renderWidth, renderHeight, devicePixelRatio )` method.
* Added new `FooUtils.scrollParent( element, axis, def )` method.