QUnit.module('url');

QUnit.test('parts', function (assert) {

	var parts = FooUtils.url.parts("http://localhost:3000/path/to/page.html?param=true#my-hash");
	assert.deepEqual(parts, {
		hash:"#my-hash",
		host:"localhost:3000",
		hostname:"localhost",
		href:"http://localhost:3000/path/to/page.html?param=true#my-hash",
		origin:"http://localhost:3000",
		pathname:"/path/to/page.html",
		port:"3000",
		protocol:"http:",
		search:"?param=true"
	});

});

QUnit.test('param:get', function (assert) {

	// create a search string to test
	var search = "?wmode=opaque&autoplay=1&encoded=%2Fencoded_value%2F";
	assert.equal( FooUtils.url.param( search, "wmode" ), "opaque" );
	assert.equal( FooUtils.url.param( search, "autoplay" ), "1" );
	assert.equal( FooUtils.url.param( search, "encoded" ), "/encoded_value/" );
	assert.equal( FooUtils.url.param( search, "nonexistent" ), null );

});

QUnit.test('param:set', function (assert) {

	// create a search string to test
	var search = "?wmode=opaque&autoplay=1";
	assert.equal( FooUtils.url.param( search, "wmode", "window" ), "?wmode=window&autoplay=1" );
	assert.equal( FooUtils.url.param( search, "autoplay", "0" ), "?wmode=opaque&autoplay=0" );
	assert.equal( FooUtils.url.param( search, "v", "2" ), "?wmode=opaque&autoplay=1&v=2" );
	assert.equal( FooUtils.url.param( search, "encoded", "/encoded_value/" ), "?wmode=opaque&autoplay=1&encoded=%2Fencoded_value%2F" );

});