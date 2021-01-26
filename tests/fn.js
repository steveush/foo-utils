QUnit.module("fn");

QUnit.test(".CONTAINS_SUPER", function(assert){

	// create some functions to test
	function testFn1(){}
	function testFn2(){
		this._super();
	}

	assert.ok( !FooUtils.fn.CONTAINS_SUPER.test(testFn1), "testFn1 does not contain the _super keyword." );
	assert.ok( FooUtils.fn.CONTAINS_SUPER.test(testFn2), "testFn2 does contain the _super keyword." );

});

QUnit.test(".addOrOverride", function(assert){

	var original = function(message){
		return "original:" + message;
	};

	var proto = {
		testString: original
	};

	assert.equal( proto.testString("msg"), "original:msg", "proto.testString('msg') == 'original:msg'" );

	FooUtils.fn.addOrOverride( proto, "testString", function(message){
		assert.ok( this._super === original, "this._super === original" );
		return this._super("override:" + message);
	} );
	assert.equal( proto.testString("msg"), "original:override:msg", "proto.testString('msg') == 'original:override:msg'" );

});

QUnit.test(".apply", function (assert) {

	// create a class to test with
	function Test( name, value ){
		if ( !( this instanceof Test )){
			throw SyntaxError("The Test class requires the 'new' keyword.");
		}
		this.name = name;
		this.value =  value;
	}

	assert.throws(function(){
		Test.apply(Test, ["name", "value"]);
	}, SyntaxError, "Can't use apply with classes that require the 'new' keyword.");

	var test = FooUtils.fn.apply(Test, ["name", "value"]);
	assert.ok( test instanceof Test, "instanceof Test");
	assert.equal( test.name, "name", "test.name == 'name'" );
	assert.equal( test.value, "value", "test.name == 'value'" );

});

QUnit.test(".arg2arr", function(assert){

	function test() {
		var args = FooUtils.fn.arg2arr(arguments);
		assert.equal(args.length, arguments.length, "args.length == arguments.length");
		assert.ok( args instanceof Array, "instanceof Array");
		assert.equal( args[0], arguments[0], "args[0] == arguments[0]" );
		assert.equal( args[1], arguments[1], "args[1] == arguments[1]" );
		assert.equal( args[2], arguments[2], "args[2] == arguments[2]" );
		args.pop();
		assert.notEqual( args.length, arguments.length, "args(popped).length != arguments.length" );
	}

	test("arg1", "arg2", "arg3");
});

QUnit.test(".debounce", function(assert){

	assert.expect(5);
	var done = assert.async(), iterations = 8, every = 10, current = 0;
	var debounced = FooUtils.fn.debounce(function(arg1, arg2, arg3, arg4, arg5){
		assert.equal( arg1, true, "arg1 == true" );
		assert.equal( arg2, false, "arg2 == false" );
		assert.equal( arg3, 0, "arg3 == 0" );
		assert.equal( arg4, 1, "arg4 == 1" );
		assert.equal( arg5, "string", "arg5 == 'string'" );
	}, 50);

	function spam(finished, wait){
		current++;
		debounced(true, false, 0, 1, "string");
		if (current < iterations){
			setTimeout(function(){
				spam(finished, wait);
			}, every);
		} else {
			setTimeout(finished, wait);
		}
	}

	spam(function(){
		done();
	}, 200);

});

QUnit.test(".throttle", function(assert){

	assert.expect(15);
	var done = assert.async(), iterations = 8, every = 10, current = 0;
	var throttled = FooUtils.fn.throttle(function(arg1, arg2, arg3, arg4, arg5){
		assert.equal( arg1, true, "arg1 == true" );
		assert.equal( arg2, false, "arg2 == false" );
		assert.equal( arg3, 0, "arg3 == 0" );
		assert.equal( arg4, 1, "arg4 == 1" );
		assert.equal( arg5, "string", "arg5 == 'string'" );
	}, 50);

	function spam(finished, wait){
		current++;
		throttled(true, false, 0, 1, "string");
		if (current < iterations){
			setTimeout(function(){
				spam(finished, wait);
			}, every);
		} else {
			setTimeout(finished, wait);
		}
	}

	spam(function(){
		done();
	}, 200);

});

QUnit.test(".all:empty", function (assert) {

	assert.expect(3);
	var done = assert.async();

	var result = FooUtils.fn.all();
	assert.ok(FooUtils.is.promise(result), "Result is a promise.");
	result.then(function(values){
		assert.ok(true, "Result is a resolved promise.");
		assert.ok(FooUtils.is.array(values) && values.length === 0, "Result is an empty array.");
	}, function(){
		assert.ok(false, "Result is a rejected promise.");
	}).always(function(){
		done();
	});
});

QUnit.test(".all:error", function (assert) {

	assert.expect(3);
	var done = assert.async();

	function success(arg1, argN){
		const args = FooUtils.fn.arg2arr(arguments);
		return $.Deferred(function(def){
			setTimeout(function(){
				def.resolve.apply(def, args);
			}, 10);
		}).promise();
	}

	function failed(arg1, argN){
		const args = FooUtils.fn.arg2arr(arguments);
		return $.Deferred(function(def){
			setTimeout(function(){
				def.reject.apply(def, args);
			}, 10);
		}).promise();
	}

	var promises = [null, false, success("success-1"), failed("failed"), "string", failed("failed-2", "second-error")];

	var result = FooUtils.fn.all(promises);
	assert.ok(FooUtils.is.promise(result), "Result is a promise.");
	result.then(function(values){
		assert.ok(false, "Result is a resolved promise.");
	}, function(err){
		assert.ok(true, "Result is a rejected promise.");
		assert.ok(err === "failed", "err is the expected result.");
	}).always(function(){
		done();
	});

});

QUnit.test(".all:success", function (assert) {

	assert.expect(9);
	var done = assert.async();

	function success(arg1, argN){
		const args = FooUtils.fn.arg2arr(arguments);
		return $.Deferred(function(def){
			setTimeout(function(){
				def.resolve.apply(def, args);
			}, 10);
		}).promise();
	}

	var promises = [null, false, success("success-1"), "string", success("success-2", "second-result"), success("success-3")];

	var result = FooUtils.fn.all(promises);
	assert.ok(FooUtils.is.promise(result), "Result is a promise.");
	result.then(function(values){
		assert.ok(true, "Result is a resolved promise.");
		assert.ok(FooUtils.is.array(values), "Result is an array.");
		assert.ok(values[0] === null, "r1 is the expected result.");
		assert.ok(values[1] === false, "r2 is the expected result.");
		assert.ok(values[2] === "success-1", "r3 is the expected result.");
		assert.ok(values[3] === "string", "r4 is the expected result.");
		assert.ok(values[4].length === 2 && values[4][0] === "success-2" && values[4][1] === "second-result", "r5 is the expected result.");
		assert.ok(values[5] === "success-3", "r6 is the expected result.");
	}, function(){
		assert.ok(false, "Result is a rejected promise.");
	}).always(function(){
		done();
	});

});

QUnit.test(".allSettled:empty", function (assert) {

	assert.expect(3);
	var done = assert.async();

	var result = FooUtils.fn.allSettled();
	assert.ok(FooUtils.is.promise(result), "Result is a promise.");
	result.then(function(values){
		assert.ok(true, "Result is a resolved promise.");
		assert.ok(FooUtils.is.array(values) && values.length === 0, "Result is an empty array.");
	}, function(){
		assert.ok(false, "Result is a rejected promise.");
	}).always(function(){
		done();
	});
});

QUnit.test(".allSettled:mixed", function (assert) {

	assert.expect(10);
	var done = assert.async();

	function success(arg1, argN){
		const args = FooUtils.fn.arg2arr(arguments);
		return $.Deferred(function(def){
			setTimeout(function(){
				def.resolve.apply(def, args);
			}, 10);
		}).promise();
	}

	function failed(arg1, argN){
		const args = FooUtils.fn.arg2arr(arguments);
		return $.Deferred(function(def){
			setTimeout(function(){
				def.reject.apply(def, args);
			}, 10);
		}).promise();
	}

	var promises = [null, false, success("success-1"), failed("failed"), "string", failed("failed-2", "second-arg"), success("success-2", "second-arg")];

	var result = FooUtils.fn.allSettled(promises);
	assert.ok(FooUtils.is.promise(result), "Result is a promise.");
	result.then(function(values){
		assert.ok(true, "Result is a resolved promise.");
		assert.ok(FooUtils.is.array(values), "Result is an array.");
		assert.ok(values[0].status === "fulfilled" && values[0].value === null, "r1 is the expected result.");
		assert.ok(values[1].status === "fulfilled" && values[1].value === false, "r2 is the expected result.");
		assert.ok(values[2].status === "fulfilled" && values[2].value === "success-1", "r3 is the expected result.");
		assert.ok(values[3].status === "rejected" && values[3].reason === "failed", "r4 is the expected result.");
		assert.ok(values[4].status === "fulfilled" && values[4].value === "string", "r5 is the expected result.");
		assert.ok(values[5].status === "rejected" && values[5].reason.length === 2 && values[5].reason[0] === "failed-2" && values[5].reason[1] === "second-arg", "r6 is the expected result.");
		assert.ok(values[6].status === "fulfilled" && values[6].value.length === 2 && values[6].value[0] === "success-2" && values[6].value[1] === "second-arg", "r7 is the expected result.");
	}, function(){
		assert.ok(false, "Result is a rejected promise.");
	}).always(function(){
		done();
	});

});