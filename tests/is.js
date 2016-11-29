QUnit.module("is");

QUnit.test(".array", function(assert){

	assert.ok(!FooUtils.is.array({}), 'array(object)');
	assert.ok(!FooUtils.is.array(undefined), 'array(undefined)');
	assert.ok(!FooUtils.is.array(false), 'array(bool)');
	assert.ok(!FooUtils.is.array('string'), 'array(string)');
	assert.ok(!FooUtils.is.array(1), 'array(number)');
	assert.ok(!FooUtils.is.array(null), 'array(null)');
	assert.ok(FooUtils.is.array([]), 'array(array)');

});

QUnit.test(".boolean", function(assert){

	assert.ok(!FooUtils.is.boolean({}), 'boolean(object)');
	assert.ok(!FooUtils.is.boolean(undefined), 'boolean(undefined)');
	assert.ok(!FooUtils.is.boolean([]), 'boolean(array)');
	assert.ok(!FooUtils.is.boolean('string'), 'boolean(string)');
	assert.ok(!FooUtils.is.boolean(1), 'boolean(number)');
	assert.ok(!FooUtils.is.boolean(null), 'boolean(null)');
	assert.ok(FooUtils.is.boolean(false), 'boolean(false)');
	assert.ok(FooUtils.is.boolean(true), 'boolean(true)');

});

QUnit.test(".element", function(assert){

	assert.ok(!FooUtils.is.element(function(){}), 'element(function)');
	assert.ok(!FooUtils.is.element(undefined), 'element(undefined)');
	assert.ok(!FooUtils.is.element([]), 'element(array)');
	assert.ok(!FooUtils.is.element('string'), 'element(string)');
	assert.ok(!FooUtils.is.element(1), 'element(number)');
	assert.ok(!FooUtils.is.element(null), 'element(null)');
	assert.ok(!FooUtils.is.element({}), 'element(object)');
	assert.ok(FooUtils.is.element(document.querySelector('#qunit-fixture')), 'element(element)');

});

QUnit.test(".empty", function(assert){

	assert.ok( FooUtils.is.empty( undefined ), "empty(undefined)" );
	assert.ok( FooUtils.is.empty( null ), "empty(null)" );
	assert.ok( FooUtils.is.empty( 0 ), "empty(0)" );
	assert.ok( FooUtils.is.empty( 0.0 ), "empty(0.0)" );
	assert.ok( FooUtils.is.empty( "" ), "empty('')" );
	assert.ok( FooUtils.is.empty( [] ), "empty([])" );
	assert.ok( FooUtils.is.empty( {} ), "empty({})" );
	assert.ok( !FooUtils.is.empty( 1 ), "empty(1)" );
	assert.ok( !FooUtils.is.empty( 0.1 ), "empty(0.1)" );
	assert.ok( !FooUtils.is.empty( "one" ), "empty('one')" );
	assert.ok( !FooUtils.is.empty( ["one"] ), "empty(['one'])" );
	assert.ok( !FooUtils.is.empty( { "name": "My Object" } ), "empty({name: 'My Object'})" );

});

QUnit.test(".error", function(assert){

	assert.ok( FooUtils.is.error(Error("Test")), "error(Error)" );
	assert.ok( FooUtils.is.error(SyntaxError("Test")), "error(SyntaxError)" );
	assert.ok( !FooUtils.is.error({name: "NotReal", message: ""}), "error({name: 'NotReal', message: ''})" );
	assert.ok( !FooUtils.is.error(null), "error(null)" );
	assert.ok( !FooUtils.is.error(false), "error(false)" );
	assert.ok( !FooUtils.is.error(1), "error(1)" );
	assert.ok( !FooUtils.is.error(""), "error('')" );
	assert.ok( !FooUtils.is.error(undefined), "error(undefined)" );

});

QUnit.test(".fn", function(assert){

	assert.ok(!FooUtils.is.fn({}), 'fn(object)');
	assert.ok(!FooUtils.is.fn(undefined), 'fn(undefined)');
	assert.ok(!FooUtils.is.fn([]), 'fn(array)');
	assert.ok(!FooUtils.is.fn('string'), 'fn(string)');
	assert.ok(!FooUtils.is.fn(1), 'fn(number)');
	assert.ok(!FooUtils.is.fn(null), 'fn(null)');
	assert.ok(FooUtils.is.fn(function(){}), 'fn(function)');

});

QUnit.test(".hash", function(assert){

	assert.ok(!FooUtils.is.hash(function(){}), 'hash(function)');
	assert.ok(!FooUtils.is.hash(undefined), 'hash(undefined)');
	assert.ok(!FooUtils.is.hash([]), 'hash(array)');
	assert.ok(!FooUtils.is.hash('string'), 'hash(string)');
	assert.ok(!FooUtils.is.hash(1), 'hash(number)');
	assert.ok(!FooUtils.is.hash(null), 'hash(null)');
	assert.ok(!FooUtils.is.hash(window), 'hash(window)');
	assert.ok(!FooUtils.is.hash(document), 'hash(document)');
	assert.ok(FooUtils.is.hash({}), 'hash(object)');

});

QUnit.test(".jq", function(assert){

	var el = document.querySelector('#qunit-fixture');

	assert.ok(FooUtils.is.jq( $(el) ) ); // => true
	assert.ok(FooUtils.is.jq( $() ) ); // => true
	assert.ok(!FooUtils.is.jq( el ) ); // => false
	assert.ok(!FooUtils.is.jq( {} ) ); // => false
	assert.ok(!FooUtils.is.jq( null ) ); // => false
	assert.ok(!FooUtils.is.jq( 123 ) ); // => false
	assert.ok(!FooUtils.is.jq( "" ) ); // => false

});

QUnit.test(".number", function(assert){

	assert.ok(!FooUtils.is.number({}), 'number(object)');
	assert.ok(!FooUtils.is.number(undefined), 'number(undefined)');
	assert.ok(!FooUtils.is.number(false), 'number(bool)');
	assert.ok(!FooUtils.is.number('string'), 'number(string)');
	assert.ok(!FooUtils.is.number([]), 'number(array)');
	assert.ok(!FooUtils.is.number(null), 'number(null)');
	assert.ok(FooUtils.is.number(1), 'number(number)');

});

QUnit.test(".object", function(assert){

	assert.ok(!FooUtils.is.object(function(){}), 'object(function)');
	assert.ok(!FooUtils.is.object(undefined), 'object(undefined)');
	assert.ok(!FooUtils.is.object([]), 'object(array)');
	assert.ok(!FooUtils.is.object('string'), 'object(string)');
	assert.ok(!FooUtils.is.object(1), 'object(number)');
	assert.ok(!FooUtils.is.object(null), 'object(null)');
	assert.ok(FooUtils.is.object({}), 'object(object)');

});

QUnit.test(".promise", function(assert){

	assert.ok( FooUtils.is.promise( $.Deferred() ) ); // => true
	assert.ok( !FooUtils.is.promise( {} ) ); // => false
	assert.ok( !FooUtils.is.promise( undefined ) ); // => false
	assert.ok( !FooUtils.is.promise( null ) ); // => false
	assert.ok( !FooUtils.is.promise( "" ) ); // => false
	assert.ok( !FooUtils.is.promise( 123 ) ); // => false

});

QUnit.test(".size", function(assert){

	assert.ok( FooUtils.is.size( 80 ) ); // => true
	assert.ok( FooUtils.is.size( "80px" ) ); // => true
	assert.ok( FooUtils.is.size( "80em" ) ); // => true
	assert.ok( FooUtils.is.size( "80%" ) ); // => true
	assert.ok( !FooUtils.is.size( {} ) ); // => false
	assert.ok( !FooUtils.is.size( undefined ) ); // => false
	assert.ok( !FooUtils.is.size( null ) ); // => false
	assert.ok( !FooUtils.is.size( "" ) ); // => false

});

QUnit.test(".string", function (assert) {

	assert.ok(!FooUtils.is.string({}), 'string(object)');
	assert.ok(!FooUtils.is.string(undefined), 'string(undefined)');
	assert.ok(!FooUtils.is.string(false), 'string(bool)');
	assert.ok(!FooUtils.is.string(1), 'string(number)');
	assert.ok(!FooUtils.is.string([]), 'string(array)');
	assert.ok(!FooUtils.is.string(null), 'string(null)');
	assert.ok(FooUtils.is.string('string'), 'string(string)');

});

QUnit.test(".undef", function (assert) {

	assert.ok(!FooUtils.is.undef({}), 'undef(object)');
	assert.ok(!FooUtils.is.undef('string'), 'undef(string)');
	assert.ok(!FooUtils.is.undef(false), 'undef(bool)');
	assert.ok(!FooUtils.is.undef(1), 'undef(number)');
	assert.ok(!FooUtils.is.undef([]), 'undef(array)');
	assert.ok(!FooUtils.is.undef(null), 'undef(null)');
	assert.ok(FooUtils.is.undef(undefined), 'undef(undefined)');

});