QUnit.module('FooUtils');

QUnit.test('version', function (assert) {

	assert.ok(typeof FooUtils.version === 'string');
	assert.ok(/[\d.]/.test(FooUtils.version));

});

QUnit.test('find:array', function (assert) {

	var array1 = ["element1","element2","element3"];
	var found1 = FooUtils.find(array1, function(value, index, array){
		return value === "element2";
	});
	var found2 = FooUtils.find(array1, function(value, index, array){
		return index === 1;
	});

	assert.ok("element2" === found1 && "element2" === found2);

	var array2 = [{id: 1},{id: 2},{id: 3}];
	var found3 = FooUtils.find(array2, function(value, index, array){
		return value.id === 2;
	});
	var found4 = FooUtils.find(array2, function(value, index, array){
		return index === 1;
	});
	assert.ok(found3 === array2[1] && found4 === array2[1]);

});

QUnit.test('find:object', function (assert) {

	var object1 = {key1:"value1",key2:"value2",key3:"value3"};
	var found1 = FooUtils.find(object1, function(value, key, object){
		return value === "value2";
	});
	var found2 = FooUtils.find(object1, function(value, key, object){
		return key === "key2";
	});

	assert.ok("value2" === found1 && "value2" === found2);

	var object1 = {key1:{id: 1},key2:{id: 2},key3:{id: 3}};
	var found3 = FooUtils.find(object1, function(value, key, object){
		return value.id === 2;
	});
	var found4 = FooUtils.find(object1, function(value, key, object){
		return key === "key2";
	});
	assert.ok(found3 === object1.key2 && found4 === object1.key2);

});

QUnit.test('each:array', function (assert) {

	assert.expect(12);
	var array1 = ["element1","element2","element3"];
	FooUtils.each(array1, function(value, index, array){
		assert.ok(true, "Expected iteration.");
		assert.ok(array === array1, "Array argument supplied correctly.");
		assert.ok(FooUtils.is.number(index), "Index argument is a number.");
		assert.ok(value === array[index], "Value argument matches array value.");
	});

});

QUnit.test('each:object', function (assert) {

	assert.expect(12);
	var object1 = {key1:"value1",key2:"value2",key3:"value3"};
	FooUtils.each(object1, function(value, key, object){
		assert.ok(true, "Expected iteration.");
		assert.ok(object === object1, "Object argument supplied correctly.");
		assert.ok(FooUtils.is.string(key), "Key argument is a string.");
		assert.ok(value === object[key], "Value argument matches object property value.");
	});

});

QUnit.test('each:break:array', function (assert) {

	assert.expect(2);
	var array1 = ["element1","element2","element3"];
	FooUtils.each(array1, function(value, index, array){
		assert.ok(true, "Expected iteration.");
		if (value === "element2") return false; // exit after 2 iterations
	});

});

QUnit.test('each:break:object', function (assert) {

	assert.expect(2);
	var object1 = {key1:"value1",key2:"value2",key3:"value3"};
	FooUtils.each(object1, function(value, key, object){
		assert.ok(true, "Expected iteration.");
		if (value === "value2") return false; // exit after 2 iterations
	});

});

QUnit.test('inArray', function (assert) {

	assert.equal( FooUtils.inArray(), -1 );
	assert.equal( FooUtils.inArray( "test" ), -1 );
	assert.equal( FooUtils.inArray( "test", [] ), -1 );
	assert.equal( FooUtils.inArray( "test", ["test"] ), 0 );
	assert.equal( FooUtils.inArray( "test", ["weo","test"] ), 1 );
	assert.equal( FooUtils.inArray( "weo", ["weo","test"] ), 0 );
	assert.equal( FooUtils.inArray( "blah", ["weo","test"] ), -1 );

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