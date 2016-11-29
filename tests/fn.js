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

QUnit.test(".check", function(assert){

	// a simple `api` with a `testString` function
	window.api = {
		testString: function(){
			return this.context( "window.api.testString" );
		},
		child: {
			api: {
				testString: function(){
					return this.context( "window.api.child.api.testString" );
				}
			}
		}
	};

	// a default function to use in case the check fails
	var def = function(){
		return this.context( "default" );
	};

	// an object to use as the `this` object within the scope of the checked functions
	var thisArg = {
		context: function( message ){
			return "ctx:" + message;
		}
	};
	var thisArg2 = {
		context: function( message ){
			return "ctx2:" + message;
		}
	};

	// check the value and return a wrapped function ensuring the correct context.
	var fn = FooUtils.fn.check( thisArg, null, def );
	assert.equal( fn(), "ctx:default" );
	fn = FooUtils.fn.check( thisArg, "api.doesNotExist", def );
	assert.equal( fn(), "ctx:default" );
	fn = FooUtils.fn.check( thisArg, api.testString, def );
	assert.equal( fn(), "ctx:window.api.testString" );
	fn = FooUtils.fn.check( thisArg2, "api.testString", def );
	assert.equal( fn(), "ctx2:window.api.testString" );
	fn = FooUtils.fn.check( thisArg2, "api.testString", def, window.api.child );
	assert.equal( fn(), "ctx2:window.api.child.api.testString" );
});

QUnit.test(".fetch", function (assert) {

	// a simple `api` with a `testString` function
	window.api = {
		testString: function () {
			return this.context("window.api.testString");
		}
	};

	// the below shows 3 different ways to fetch the `sendMessage` function
	var send1 = FooUtils.fn.fetch( "api.testString" );
	var send2 = FooUtils.fn.fetch( "api.testString", window );
	var send3 = FooUtils.fn.fetch( "testString", window.api );
	var send4 = FooUtils.fn.fetch( "doesNotExist" );

	// all the retrieved methods should be the same except send4 which does not exist
	assert.ok( send1 === send2 && send2 === send3 && send3 === window.api.testString, "send1 === send2 === send3 === window.api.testString" );
	assert.equal( send4, null, "send4 === null" );

});

QUnit.test(".enqueue", function(assert){

	assert.expect(6);

	var done = assert.async();

	var executed = {
		obj1: false,
		obj2: false,
		obj3: false
	};

	// create some dummy objects that implement the same members or methods.
	var obj1 = {
		"name": "obj1",
		"appendName": function(str){
			assert.ok(true, "obj1.appendName executed.");
			executed.obj1 = true;
			return str + this.name;
		}
	};
	// this objects `appendName` method returns a promise
	var obj2 = {
		"name": "obj2",
		"appendName": function(str){
			assert.ok(executed.obj1, "obj1.appendName executed prior to obj2.appendName.");
			assert.ok(true, "obj2.appendName executed.");
			var self = this;
			return $.Deferred(function(def){
				// use a setTimeout to delay execution
				setTimeout(function(){
					executed.obj2 = true;
					def.resolve(str + self.name);
				}, 300);
			});
		}
	};
	// this objects `appendName` method is only executed once obj2's promise is resolved
	var obj3 = {
		"name": "obj3",
		"appendName": function(str){
			assert.ok(executed.obj2, "obj2.appendName executed prior to obj3.appendName.");
			assert.ok(true, "obj3.appendName executed.");
			return str + this.name;
		}
	};
	FooUtils.fn.enqueue( [obj1, obj2, obj3], "appendName", "modified_by:" ).then(function(results){
		assert.deepEqual( results, [ [ "modified_by:obj1" ], [ "modified_by:obj2" ], [ "modified_by:obj3" ] ], "Results returned from all executed methods in the correct order." );
		done();
	});

});

QUnit.test(".enqueue:failure", function (assert) {

	assert.expect(12);

	var done = assert.async();

	// create some dummy objects that implement the same members or methods.
	var obj1 = {
		"name": "obj1",
		"last": null,
		"appendName": function(str){
			assert.ok(true, "obj1.appendName executed.");
			return this.last = str + this.name;
		},
		"rollback": function(){
			assert.ok(true, "obj1.rollback executed.");
			this.last = null;
		}
	};
	// this objects `appendName` method throws an error
	var obj2 = {
		"name": "obj2",
		"last": null,
		"appendName": function(str){
			assert.ok(true, "obj2.appendName executed.");
			var self = this;
			return $.Deferred(function(def){
				// use a setTimeout to delay execution
				setTimeout(function(){
					self.last = str + self.name;
					def.reject(Error("Oops, something broke."));
				}, 300);
			});
		},
		"rollback": function(){
			assert.ok(true, "obj2.rollback executed.");
			this.last = null;
		}
	};
// this objects `appendName` and `rollback` methods are never executed
	var obj3 = {
		"name": "obj3",
		"last": null,
		"appendName": function(str){
			assert.ok(false, "obj3.appendName should not be executed.");
			return this.last = str + this.name;
		},
		"rollback": function(){
			assert.ok(false, "obj3.rollback should not be executed.");
			this.last = null;
		}
	};
	FooUtils.fn.enqueue( [obj1, obj2, obj3], "appendName", "modified_by:" ).fail(function(err, run){
		assert.equal( err.message, "Oops, something broke.", "Error is passed to .fail correctly." );
		assert.ok(run instanceof Array, "Run array is supplied as last parameter.");
		assert.equal( run.length, 2, "Only obj1 and obj2 should have been run." );
		assert.equal( run[1].name, "obj2", "The last obj run should be obj2 as it threw the error." );
		assert.equal(run[0].last, "modified_by:obj1", "obj1.last is set.");
		assert.equal(run[1].last, "modified_by:obj2", "obj2.last is set but dirty.");
		run.reverse(); // reverse execution when rolling back to avoid dependency issues
		return FooUtils.fn.enqueue( run, "rollback" ).then(function(){
			assert.equal(run[0].last, null, "obj2.last reset to null after rollback");
			assert.equal(run[1].last, null, "obj1.last reset to null after rollback");
			done();
		});
	});

});