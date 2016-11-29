QUnit.module('FooUtils');

QUnit.test('version', function (assert) {

	assert.ok(typeof FooUtils.version === 'string');
	assert.ok(/[\d.]/.test(FooUtils.version));

});

QUnit.test('versionCompare', function (assert) {

	assert.equal( FooUtils.versionCompare( "0", "0" ), 0 );
	assert.equal( FooUtils.versionCompare( "0.0", "0" ), 0 );
	assert.equal( FooUtils.versionCompare( "0.0", "0.0.0" ), 0 );
	assert.equal( FooUtils.versionCompare( "0.1", "0.0.0" ), 1 );
	assert.equal( FooUtils.versionCompare( "0.1", "0.0.1" ), 1 );
	assert.equal( FooUtils.versionCompare( "1", "0.1" ), 1 );
	assert.equal( FooUtils.versionCompare( "1.10", "1.9" ), 1 );
	assert.equal( FooUtils.versionCompare( "1.9", "1.10" ), -1 );
	assert.equal( FooUtils.versionCompare( "1", "1.1" ), -1 );
	assert.equal( FooUtils.versionCompare( "1.0.9", "1.1" ), -1 );
	// assert.equal( FooUtils.versionCompare( "not-a-version", "1.1" ), NaN );
	// assert.equal( FooUtils.versionCompare( "1.1", "not-a-version" ), NaN );
	// assert.equal( FooUtils.versionCompare( "not-a-version", "not-a-version" ), NaN );

});