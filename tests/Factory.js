QUnit.module("Factory", {
	beforeEach: function(){
		this.factory = new FooUtils.Factory();

		this.TestClass = FooUtils.Class.extend({
			construct: function(arg1, arg2){
				this.arg1 = arg1;
				this.arg2 = arg2;
			}
		});

		// create some test classes to register and then perform tests with
		this.test1 = {
			name: "test1",
			klass: this.TestClass.extend(),
			priority: 0
		};

		this.test2 = {
			name: "test2",
			klass: this.TestClass.extend(),
			priority: 2
		};

		this.test3 = {
			name: "test3",
			klass: this.TestClass.extend(),
			priority: 1
		};

		// register each of the test classes
		this.factory.register(this.test1.name, this.test1.klass, this.test1.priority);
		this.factory.register(this.test2.name, this.test2.klass, this.test2.priority);
		this.factory.register(this.test3.name, this.test3.klass, this.test3.priority);
	}
});

QUnit.test("#register", function(assert){
	assert.ok( typeof this.factory.registered[this.test1.name] === 'object', "registered['test1'] === 'object'" );
	assert.equal( this.factory.registered[this.test1.name].name, this.test1.name, "registered['test1'].name == 'test1'" );
	assert.ok( this.factory.registered[this.test1.name].klass === this.test1.klass, "registered['test1'].klass == Test1" );
	assert.equal( this.factory.registered[this.test1.name].priority, this.test1.priority, "registered['test1'].priority == 0" );

	assert.ok( typeof this.factory.registered[this.test2.name] === 'object', "registered['test2'] === 'object'" );
	assert.equal( this.factory.registered[this.test2.name].name, this.test2.name, "registered['test2'].name == 'test2'" );
	assert.ok( this.factory.registered[this.test2.name].klass === this.test2.klass, "registered['test2'].klass == Test2" );
	assert.equal( this.factory.registered[this.test2.name].priority, this.test2.priority, "registered['test2'].priority == 0" );

	assert.ok( typeof this.factory.registered[this.test3.name] === 'object', "registered['test3'] === 'object'" );
	assert.equal( this.factory.registered[this.test3.name].name, this.test3.name, "registered['test3'].name == 'test1'" );
	assert.ok( this.factory.registered[this.test3.name].klass === this.test3.klass, "registered['test3'].klass == Test1" );
	assert.equal( this.factory.registered[this.test3.name].priority, this.test3.priority, "registered['test3'].priority == 0" );
});

QUnit.test("#contains", function(assert){

	assert.ok( this.factory.contains(this.test1.name), "contains('test1')" );
	assert.ok( this.factory.contains(this.test2.name), "contains('test2')" );
	assert.ok( this.factory.contains(this.test3.name), "contains('test3')" );
	assert.ok( !this.factory.contains("does-not-exist"), "!contains('does-not-exist')" );
	assert.ok( !this.factory.contains(null), "!contains(null)" );
	assert.ok( !this.factory.contains(), "!contains()" );

});

QUnit.test("#names", function(assert){

	assert.deepEqual( this.factory.names(), [this.test1.name, this.test2.name, this.test3.name], "names()" );
	assert.deepEqual( this.factory.names(true), [this.test2.name, this.test3.name, this.test1.name], "names(true):prioritized" );

});

QUnit.test("#make", function (assert) {

	var test1 = this.factory.make(this.test1.name, "arg1", "arg2");

	// make sure the new class properly inherits from the base
	assert.ok( test1 instanceof this.test1.klass, "instanceof Test1" );
	assert.ok( test1.constructor === this.test1.klass, "constructor === Test1" );

	// make sure the constructor was called and the props set
	assert.equal( test1.arg1, "arg1", "test1.arg1 === 'arg1'" );
	assert.equal( test1.arg2, "arg2", "test1.arg2 === 'arg2'" );

});

QUnit.test("#load", function(assert){

	var loaded = this.factory.load(null, "arg1", "arg2");

	// make sure all 3 test classes are loaded
	assert.equal( loaded.length, 3, "loaded.length == 3" );

	// make sure each test class was loaded according to priority and with the given arguments
	assert.ok( loaded[0] instanceof this.test2.klass, "loaded[0] instanceof Test2" );
	assert.equal( loaded[0].arg1, "arg1", "loaded[0].arg1 == 'arg1'" );
	assert.equal( loaded[0].arg2, "arg2", "loaded[0].arg2 == 'arg2'" );

	assert.ok( loaded[1] instanceof this.test3.klass, "loaded[1] instanceof Test3" );
	assert.equal( loaded[1].arg1, "arg1", "loaded[1].arg1 == 'arg1'" );
	assert.equal( loaded[1].arg2, "arg2", "loaded[1].arg2 == 'arg2'" );

	assert.ok( loaded[2] instanceof this.test1.klass, "loaded[2] instanceof Test1" );
	assert.equal( loaded[2].arg1, "arg1", "loaded[2].arg1 == 'arg1'" );
	assert.equal( loaded[2].arg2, "arg2", "loaded[2].arg2 == 'arg2'" );

});

QUnit.test("#load:overrides", function(assert){

	var Override = this.TestClass.extend({
		construct: function (arg1, arg2) {
			this._super(arg1, arg2);
			this.newProp = true;
		}
	});

	var loaded = this.factory.load({
		"test3": Override
	}, "arg1", "arg2");

	// make sure all 3 test classes are loaded
	assert.equal( loaded.length, 3, "loaded.length == 3" );

	// make sure each test class was loaded according to priority and with the given arguments
	assert.ok( loaded[0] instanceof this.test2.klass, "loaded[0] instanceof Test2" );
	assert.equal( loaded[0].arg1, "arg1", "loaded[0].arg1 == 'arg1'" );
	assert.equal( loaded[0].arg2, "arg2", "loaded[0].arg2 == 'arg2'" );

	assert.ok( loaded[1] instanceof Override, "loaded[1] instanceof Override" );
	assert.equal( loaded[1].arg1, "arg1", "loaded[1].arg1 == 'arg1'" );
	assert.equal( loaded[1].arg2, "arg2", "loaded[1].arg2 == 'arg2'" );
	assert.ok( loaded[1].newProp, "loaded[1].newProp == true" );

	assert.ok( loaded[2] instanceof this.test1.klass, "loaded[2] instanceof Test1" );
	assert.equal( loaded[2].arg1, "arg1", "loaded[2].arg1 == 'arg1'" );
	assert.equal( loaded[2].arg2, "arg2", "loaded[2].arg2 == 'arg2'" );

});