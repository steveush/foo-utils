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

QUnit.test('nextFrame:success', function(assert){

	assert.expect(2);
	var done = assert.async(),
		callback = function(){
			assert.ok( true, 'The callback has been called.' );
			return 'result';
		};

	FooUtils.nextFrame(callback).then(function(r1){
		assert.equal( r1, 'result' );
		done();
	}, function(){
		assert.ok( false, 'should be successfull callback' );
		done();
	});

});

QUnit.test('nextFrame:error', function(assert){

	assert.expect(2);
	var done = assert.async(),
		callback = function(){
			assert.ok( true, 'The callback has been called.' );
			throw new Error('test-error');
		};

	FooUtils.nextFrame(callback).then(function(){
		assert.ok( false, 'should be error callback' );
		done();
	}, function(err){
		assert.equal( err.message, 'test-error' );
		done();
	});

});
