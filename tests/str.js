QUnit.module('str');

QUnit.test('camel', function (assert) {

	assert.equal( FooUtils.str.camel( "max-width" ), "maxWidth" );
	assert.equal( FooUtils.str.camel( "max--width" ), "maxWidth" );
	assert.equal( FooUtils.str.camel( "max Width" ), "maxWidth" );
	assert.equal( FooUtils.str.camel( "Max_width" ), "maxWidth" );
	assert.equal( FooUtils.str.camel( "MaxWidth" ), "maxWidth" );
	assert.equal( FooUtils.str.camel( "Abbreviations like CSS are left intact" ), "abbreviationsLikeCSSAreLeftIntact" );

});

QUnit.test('contains', function (assert) {

	// create a string to test
	var target = "To be, or not to be, that is the question.";
	assert.ok( FooUtils.str.contains( target, "To be" ) );
	assert.ok( FooUtils.str.contains( target, "question" ) );
	assert.ok( FooUtils.str.contains( target, "no" ) );
	assert.ok( !FooUtils.str.contains( target, "nonexistent" ) );
	assert.ok( !FooUtils.str.contains( target, "TO BE" ) );
	assert.ok( FooUtils.str.contains( target, "TO BE", true ) );

});

QUnit.test('containsWord', function (assert) {

	// create a string to test
	var target = "To be, or not to be, that is the question.";
	assert.ok( FooUtils.str.containsWord( target, "question" ) );
	assert.ok( !FooUtils.str.containsWord( target, "no" ) );
	assert.ok( !FooUtils.str.containsWord( target, "NOT" ) );
	assert.ok( FooUtils.str.containsWord( target, "NOT", true ) );
	assert.ok( !FooUtils.str.containsWord( target, "nonexistent" ) );

});

QUnit.test('endsWith', function(assert){

	assert.ok( FooUtils.str.endsWith( "something", "g" ) );
	assert.ok( FooUtils.str.endsWith( "something", "ing" ) );
	assert.ok( !FooUtils.str.endsWith( "something", "no" ) );

});

QUnit.test('fnv1a', function (assert) {

	assert.equal( FooUtils.str.fnv1a( "Some string to generate a hash for." ), 207568994 );
	assert.equal( FooUtils.str.fnv1a( "Some string to generate a hash for" ), 1350435704 );

});

QUnit.test('from', function (assert) {

	// create a string to test
	var target = "To be, or not to be, that is the question.";
	assert.equal( FooUtils.str.from( target, "no" ), "t to be, that is the question." );
	assert.equal( FooUtils.str.from( target, "that" ), " is the question." );
	assert.equal( FooUtils.str.from( target, "question" ), "." );
	assert.equal( FooUtils.str.from( target, "nonexistent" ), null );

});

QUnit.test('join', function (assert) {

	assert.equal( FooUtils.str.join( "_", "all", "in", "one" ), "all_in_one" );
	assert.equal( FooUtils.str.join( "_", "all", "_in", "one" ), "all_in_one" );
	assert.equal( FooUtils.str.join( "_", "all", "", "_in", "one" ), "all_in_one" );
	assert.equal( FooUtils.str.join( "_", "all", null, "_in", "one" ), "all_in_one" );
	assert.equal( FooUtils.str.join( "/", "http://", "/example.com/", "/path/to/image.png" ), "http://example.com/path/to/image.png" );
	assert.equal( FooUtils.str.join( "/", "http://", "/example.com", "/path/to/image.png" ), "http://example.com/path/to/image.png" );
	assert.equal( FooUtils.str.join( "/", "http://", "example.com", "path/to/image.png" ), "http://example.com/path/to/image.png" );

});

QUnit.test('startsWith', function (assert) {

	assert.ok( FooUtils.str.startsWith( "something", "s" ) );
	assert.ok( FooUtils.str.startsWith( "something", "some" ) );
	assert.ok( !FooUtils.str.startsWith( "something", "no" ) );

});

QUnit.test('until', function (assert) {

	// create a string to test
	var target = "To be, or not to be, that is the question.";
	assert.equal( FooUtils.str.until( target, "no" ), "To be, or " );
	assert.equal( FooUtils.str.until( target, "that" ), "To be, or not to be, " );
	assert.equal( FooUtils.str.until( target, "question" ), "To be, or not to be, that is the " );
	assert.equal( FooUtils.str.until( target, "nonexistent" ), "To be, or not to be, that is the question." );

});

QUnit.test('format:indexed', function (assert) {

	// create a format string using index placeholders
	var format = "Hello, {0}, are you feeling {1}?";
	assert.equal( FooUtils.str.format( format, "Steve", "OK" ), "Hello, Steve, are you feeling OK?" );
	assert.equal( FooUtils.str.format( format, [ "Steve", "OK" ] ), "Hello, Steve, are you feeling OK?" );

});

QUnit.test('format:named', function (assert) {

	// create a format string using named placeholders
	var format = "Hello, {name}, are you feeling {adjective}?";
	assert.equal( FooUtils.str.format( format, {name: "Steve", adjective: "OK"} ), "Hello, Steve, are you feeling OK?" );

});