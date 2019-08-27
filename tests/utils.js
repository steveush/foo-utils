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

QUnit.test('selectify', function(assert){

	assert.equal( FooUtils.selectify("test-class"), ".test-class" );
	assert.equal( FooUtils.selectify("test-class other-test-class"), ".test-class.other-test-class" );
	assert.equal( FooUtils.selectify(["test-class", "other-test-class"]), ".test-class,.other-test-class" );
	assert.deepEqual( FooUtils.selectify({
		class1: "test-class",
		class2: "test-class other-test-class",
		class3: ["test-class", "other-test-class"]
	}), {
		class1: ".test-class",
		class2: ".test-class.other-test-class",
		class3: ".test-class,.other-test-class"
	} );

});

QUnit.test('src:w-descriptor', function(assert){

	var src = "240x120.src", srcWidth = 240, srcHeight = 120, srcset = "480x240.src 480w, 720x360.src 720w, 960x480.src 960w";

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 1), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 720, 360, 1), "720x360.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 960, 480, 1), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 2), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 720, 360, 2), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 960, 480, 2), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 3), "720x360.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 4), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 1), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 2), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 3), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 4), "960x480.src" );

});

QUnit.test('src:h-descriptor', function(assert){

	var src = "240x120.src", srcWidth = 240, srcHeight = 120, srcset = "480x240.src 240h, 720x360.src 360h, 960x480.src 480h";

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 1), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 720, 360, 1), "720x360.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 960, 480, 1), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 2), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 720, 360, 2), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 960, 480, 2), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 3), "720x360.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 4), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 1), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 2), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 3), "960x480.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 4), "960x480.src" );

});

QUnit.test('src:x-descriptor', function(assert){

	var src = "240x120.src", srcWidth = 240, srcHeight = 120, srcset = "480x240.src 2x, 720x360.src 3x, 960x480.src 4x";

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 720, 360, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 960, 480, 1), "240x120.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 720, 360, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 960, 480, 2), "480x240.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 3), "720x360.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 240, 120, 4), "960x480.src" );

	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 1), "240x120.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 2), "480x240.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 3), "720x360.src" );
	assert.equal( FooUtils.src(src, srcset, srcWidth, srcHeight, 480, 240, 4), "960x480.src" );

});

QUnit.test('scrollParent', function(assert){
	var $fixture = $("#qunit-fixture"),
		$wrap = $("<div/>")
			.css({
				"overflow-x": "scroll",
				"overflow-y": "scroll",
				"max-width": "100px",
				"max-height": "100px"
			}).appendTo($fixture),
		$element = $("<div/>")
			.css({
				"width": "150px",
				"height": "150px"
			}).appendTo($wrap),
		$parent = FooUtils.scrollParent($element, 'xy', $fixture);
	assert.ok($parent.is($wrap));
	$parent = FooUtils.scrollParent(null, 'xy', $fixture);
	assert.ok($parent.is($fixture));
	$parent = FooUtils.scrollParent($element, 'abc', $fixture);
	assert.ok($parent.is($wrap));
	$parent = FooUtils.scrollParent(null, null, $fixture);
	assert.ok($parent.is($fixture));
	$parent = FooUtils.scrollParent(null, null, null);
	assert.ok($parent.is(document));
});

QUnit.test('scrollParent:axisY', function(assert){
	var $fixture = $("#qunit-fixture"),
		$wrap = $("<div/>")
			.css({
				"overflow-x": "hidden",
				"overflow-y": "scroll",
				"max-height": "100px"
			}).appendTo($fixture),
		$element = $("<div/>")
			.css({
				"width": "150px",
				"height": "150px"
			}).appendTo($wrap),
		$parent = FooUtils.scrollParent($element, 'xy', $fixture);
	assert.ok($parent.is($wrap));
	$parent = FooUtils.scrollParent($element, 'x', $fixture);
	assert.ok($parent.is($fixture));
	$parent = FooUtils.scrollParent($element, 'y', $fixture);
	assert.ok($parent.is($wrap));
});

QUnit.test('scrollParent:axisX', function(assert){
	var $fixture = $("#qunit-fixture"),
		$wrap = $("<div/>")
			.css({
				"overflow-x": "scroll",
				"overflow-y": "hidden",
				"max-width": "100px"
			}).appendTo($fixture),
		$element = $("<div/>")
			.css({
				"width": "150px",
				"height": "150px"
			}).appendTo($wrap),
		$parent = FooUtils.scrollParent($element, 'xy', $fixture);
	assert.ok($parent.is($wrap));
	$parent = FooUtils.scrollParent($element, 'x', $fixture);
	assert.ok($parent.is($wrap));
	$parent = FooUtils.scrollParent($element, 'y', $fixture);
	assert.ok($parent.is($fixture));
});