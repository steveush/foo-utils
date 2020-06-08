QUnit.module("Class");

QUnit.test(".extend", function(assert){

	// create a Klass inheriting from the base
	var Klass = FooUtils.Class.extend({
		construct: function(arg1, arg2){
			this.arg1 = arg1;
			this.arg2 = arg2;
		}
	});
	var klass = new Klass("Klass.arg1", "Klass.arg2");

	// make sure the new Klass properly inherits from the base
	assert.ok( klass instanceof FooUtils.Class, "instanceof FooUtils.Class" );
	assert.ok( klass.constructor === Klass, "constructor === Klass" );

	// make sure the static functions are available
	assert.ok( typeof Klass.extend === "function", "Klass.extend === 'function'" );
	assert.ok( typeof Klass.override === "function", "Klass.override === 'function'" );

	// make sure the constructor was called and the props set
	assert.equal( klass.arg1, "Klass.arg1", "klass.arg1 === 'Klass.arg1'" );
	assert.equal( klass.arg2, "Klass.arg2", "klass.arg2 === 'Klass.arg2'" );

	// create a child that inherits from the new Klass and test it as well to ensure the inheritance is working correctly
	var KlassChild = Klass.extend({
		construct: function(arg1, arg2){
			assert.ok( this._super === Klass.prototype.construct, "this._super === Klass.prototype.construct" );
			this._super(arg1 + ":modified", arg2 + ":modified");
		}
	});
	var klassChild = new KlassChild("KlassChild.arg1", "KlassChild.arg2");

	// make sure the new Klass properly inherits from the base
	assert.ok( klassChild instanceof FooUtils.Class, "instanceof FooUtils.Class" );
	assert.ok( klassChild instanceof KlassChild, "instanceof KlassChild" );
	assert.ok( klassChild.constructor === KlassChild, "constructor === KlassChild" );

	// make sure the static functions are available
	assert.ok( typeof KlassChild.extend === "function", "KlassChild.extend === 'function'" );
	assert.ok( typeof KlassChild.override === "function", "KlassChild.override === 'function'" );

	// make sure the constructor and base constructor were called and the props set
	assert.equal( klassChild.arg1, "KlassChild.arg1:modified", "klassChild.arg1 == 'KlassChild.arg1:modified'" );
	assert.equal( klassChild.arg2, "KlassChild.arg2:modified", "klassChild.arg2 == 'KlassChild.arg2:modified'" );

});

QUnit.test(".override", function(assert){

	var original = function(){
		return "original";
	};

	// create a Klass inheriting from the base with a single method to test overriding
	var Klass = FooUtils.Class.extend({
		testString: original
	});
	var klass = new Klass();
	// make sure the original function is returning what we expect
	assert.equal( klass.testString(), "original", "klass.testString() == 'original'" );

	// override the original function
	Klass.override("testString", function(){
		assert.ok( this._super === original, "this._super === original" );
		return this._super() + ":modified";
	});

	// make sure the original was overridden and is available as _super
	assert.equal( klass.testString(), "original:modified", "klass.testString() == 'original:modified'" );

});

QUnit.test(".bases", function(assert){

	var Klass1 = FooUtils.Class.extend({});
	var bases1 = Klass1.bases();
	assert.equal(bases1.length, 1, "bases.length === 1");
	assert.equal(bases1[0], FooUtils.Class, "bases[0] === FooUtils.Class");

	var Klass2 = Klass1.extend({});
	var bases2 = Klass2.bases();
	assert.equal(bases2.length, 2, "bases.length === 2");
	assert.equal(bases2[0], FooUtils.Class, "bases[0] === FooUtils.Class");
	assert.equal(bases2[1], Klass1, "bases[1] === Klass1");

});