QUnit.module('obj');

QUnit.test('create', function (assert) {

	// create a class to `create`
	function Test() {}

	// add a method to the class so we can test for it later
	Test.prototype.testMethod = function(){
		return true;
	};

	// create a new object using the prototype
	var obj = FooUtils.obj.create(Test.prototype);

	assert.ok(obj instanceof Test);
	assert.ok(obj.testMethod === Test.prototype.testMethod);

});

QUnit.test('extend', function (assert) {

	var defaults = {"name": "My Object", "enabled": false, "arr": [1,2,3]},
		options = {"enabled": true, "something": 123, "arr": [4,5,6]};

	var settings = FooUtils.obj.extend( {}, defaults, options );

	// make sure the settings is the expected result of the defaults overwritten by the options
	assert.deepEqual(settings, {"name": "My Object", "enabled": true, "arr": [4,5,6], "something": 123});
	// make sure the defaults were not modified
	assert.deepEqual(defaults, {"name": "My Object", "enabled": false, "arr": [1,2,3]});
	// make sure the options were not modified
	assert.deepEqual(options, {"enabled": true, "something": 123, "arr": [4,5,6]});

});

QUnit.test('merge', function (assert) {

	var defaults = {"name": "My Object", "enabled": false, "arr": [1,2,3]},
		options = {"enabled": true, "something": 123, "arr": [4,5,6]};

	FooUtils.obj.extend( defaults, options );
	// make sure the defaults are the expected results
	assert.deepEqual(defaults, {"name": "My Object", "enabled": true, "arr": [4,5,6], "something": 123});
	// make sure the options were not modified
	assert.deepEqual(options, {"enabled": true, "something": 123, "arr": [4,5,6]});

});

QUnit.test('mergeValid', function (assert) {

	//create the target object and it's validators
	var target = {"name":"John","location":"unknown"},
		validators = {
			"name": function (value) {
				return typeof value === 'string';
			},
			"location": function (value) {
				return typeof value === 'string';
			}
		};
	// create the object to merge into the target
	var object = {
		"name": 1234, // invalid
		"location": "Liverpool", // updated
		"notMerged": true // ignored
	};
	// merge the object into the target, invalid properties or those with no corresponding validator are ignored.
	var result = FooUtils.obj.mergeValid( target, validators, object );
	assert.deepEqual(result, { "name": "John", "location": "Liverpool" });

});

QUnit.test('mergeValid:mappings', function (assert) {

	//create the target object and it's validators
	var target = {"name":"John","location":"unknown"},
		validators = {
			"name": function (value) {
				return typeof value === 'string';
			},
			"location": function (value) {
				return typeof value === 'string';
			}
		};

	// create the object to merge into the target
	var object = {
		"name": { // ignored
			"proper": "Christopher", // mapped to name if short is invalid
			"short": "Chris" // map to name
		},
		"city": "London" // map to location
	};
	// create the mapping object
	var mappings = {
		"name": [ "name.short", "name.proper" ], // try use the short name and fallback to the proper
		"location": "city"
	};
	// merge the object into the target using the mappings, invalid properties or those with no corresponding validator are ignored.
	var result = FooUtils.obj.mergeValid( target, validators, object, mappings );
	// make sure the mappings were used and the values are as expected
	assert.deepEqual(result, { "name": "Chris", "location": "London" });

});

QUnit.test('mergeValid:mappings->fallback', function (assert) {

	//create the target object and it's validators
	var target = {"name":"John","location":"unknown"},
		validators = {
			"name": function (value) {
				return typeof value === 'string';
			},
			"location": function (value) {
				return typeof value === 'string';
			}
		};

	// create the object to merge into the target
	var object = {
		"name": { // ignored
			"proper": "Christopher", // mapped to name if short is invalid
			"short": null // map to name
		},
		"city": "London" // map to location
	};
	// create the mapping object
	var mappings = {
		"name": [ "name.short", "name.proper" ], // try use the short name and fallback to the proper
		"location": "city"
	};
	// merge the object into the target using the mappings, invalid properties or those with no corresponding validator are ignored.
	var result = FooUtils.obj.mergeValid( target, validators, object, mappings );
	// the mapping specifies "name.short" as the first value to try use but it is null so it falls back to using the "name.proper"
	assert.deepEqual(result, { "name": "Christopher", "location": "London" });

});

QUnit.test('prop:get', function(assert){

	// create an object to test
	var object = {
		"name": "My Object",
		"some": {
			"thing": 123,
			"arr": [1,2,3]
		}
	};
	assert.equal( FooUtils.obj.prop( object, "name" ), "My Object" );
	assert.equal( FooUtils.obj.prop( object, "some.thing" ), 123 );
	assert.deepEqual( FooUtils.obj.prop( object, "some.arr" ), [1,2,3] );

});

QUnit.test('prop:set', function (assert) {

	// create an object to test
	var object = {
		"name": "My Object",
		"some": {
			"thing": 123,
			"arr": [1,2,3]
		}
	};
	FooUtils.obj.prop( object, "name", "My Updated Object" );
	FooUtils.obj.prop( object, "some.thing", 987 );
	FooUtils.obj.prop( object, "some.arr", [9,8,7] );

	assert.equal( object.name, "My Updated Object" );
	assert.equal( object.some.thing, 987 );
	assert.deepEqual( object.some.arr, [9,8,7] );

});