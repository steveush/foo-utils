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