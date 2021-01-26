QUnit.module("ClassRegistry");

function ClassRepository_isRegisteredObject(value){
    return '[object Object]' === Object.prototype.toString.call(value) && typeof value !== 'undefined' && value !== null
        && value.hasOwnProperty('name') && value.hasOwnProperty('ctor') && value.hasOwnProperty('config') && value.hasOwnProperty('priority');
}

QUnit.test("construct()", function(assert){

    var registry = new FooUtils.ClassRegistry();
    assert.equal(registry.opt.allowBase, true, "allowBase === true");
    assert.equal(Object.keys(registry.registered).length, 0, "registered.keys.length === 0");

});

QUnit.test("construct(options)", function(assert){

    var registry = new FooUtils.ClassRegistry({custom: "custom"});
    assert.equal(registry.opt.allowBase, true, "allowBase === true");
    assert.equal(registry.opt.beforeCreate, null, "beforeCreate === null");
    assert.equal(registry.opt.custom, "custom", "custom === 'custom'");
    assert.equal(Object.keys(registry.registered).length, 0, "registered.keys.length === 0");

    var registry2 = new FooUtils.ClassRegistry({allowBase: false, custom: "custom"});
    assert.equal(registry2.opt.allowBase, false, "allowBase === false");
    assert.equal(registry2.opt.beforeCreate, null, "beforeCreate === null");
    assert.equal(registry2.opt.custom, "custom", "custom === 'custom'");
    assert.equal(Object.keys(registry2.registered).length, 0, "registered.keys.length === 0");

});

QUnit.test("register():invalid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var result = registry.register();
    assert.equal(result, false, "register === false");
    assert.equal(Object.keys(registry.registered).length, 0, "registered.keys.length === 0");

});

QUnit.test("register(null, klass):invalid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var result = registry.register(null, FooUtils.Class);
    assert.equal(result, false, "register === false");
    assert.equal(Object.keys(registry.registered).length, 0, "registered.keys.length === 0");

});

QUnit.test("register(name, false):invalid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var result = registry.register("test", false);
    assert.equal(result, false, "register === false");
    assert.equal(Object.keys(registry.registered).length, 0, "registered.keys.length === 0");

});

QUnit.test("register(name, klass):valid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend({
        construct: function(name, config, arg1, arg2){
            this.name;
            this.config = config;
            this.arg1 = arg1;
            this.arg2 = arg2;
        }
    });

    var result = registry.register('test', TestClass);
    assert.equal(result, true, "Valid registration: register === true");

    var keys = Object.keys(registry.registered);
    assert.equal(keys.length, 1, "registered contains a single key");
    assert.equal(keys[0], "test", "registered contains the 'test' key");

    var reg = registry.registered[ keys[0] ];
    assert.equal(reg.name, "test", "registered.name === 'test'");
    assert.equal(reg.ctor, TestClass, "registered.ctor === TestClass");
    assert.equal(Object.keys(reg.config).length, 0, "registered.config.keys.length === 0");
    assert.equal(reg.priority, 0, "registered.priority === 0");

});

QUnit.test("register(name, klass, config):valid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();

    var result = registry.register('test', TestClass, {someOption: "optionValue"});
    assert.equal(result, true, "Valid registration: register === true");

    var keys = Object.keys(registry.registered);
    assert.equal(keys.length, 1, "registered contains a single key");
    assert.equal(keys[0], "test", "registered contains the 'test' key");

    var reg = registry.registered[ keys[0] ];
    assert.equal(reg.name, "test", "registered.name === 'test'");
    assert.equal(reg.ctor, TestClass, "registered.ctor === TestClass");
    assert.propEqual(reg.config, {someOption: "optionValue"}, "registered.config === {someOption: 'optionValue'}");
    assert.equal(reg.priority, 0, "registered.priority === 0");

});

QUnit.test("register(name, klass, config, priority):valid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();

    var result = registry.register('test', TestClass, {someOption: "optionValue"}, 11);
    assert.equal(result, true, "Valid registration: register === true");

    var keys = Object.keys(registry.registered);
    assert.equal(keys.length, 1, "registered contains a single key");
    assert.equal(keys[0], "test", "registered contains the 'test' key");

    var reg = registry.registered[ keys[0] ];
    assert.equal(reg.name, "test", "registered.name === 'test'");
    assert.equal(reg.ctor, TestClass, "registered.ctor === TestClass");
    assert.propEqual(reg.config, {someOption: "optionValue"}, "registered.config === {someOption: 'optionValue'}");
    assert.equal(reg.priority, 11, "registered.priority === 11");

});

QUnit.test("each(callback)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // we should be iterating 3 times with 2 assertions per loop so:
    assert.expect(9);

    var expected_index = 0;
    function callback(registered, index){
        assert.deepEqual(this, callback, 'this === callback');
        assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
        assert.equal(index, expected_index, 'index === expected_index');
        expected_index++;
    }

    registry.each(callback);

});

QUnit.test("each(callback, prioritize)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // we should be iterating 3 times with 4 assertions per loop so:
    assert.expect(12);

    var expected_index = 0;
    function callback(registered, index){
        assert.deepEqual(this, callback, 'this === callback');
        assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
        assert.equal(index, expected_index, 'index === expected_index');
        expected_index++;
        switch (index){
            case 0:
                assert.equal(test2.name, registered.name, "test2.name === registered.name");
                break;
            case 1:
                assert.equal(test.name, registered.name, "test.name === registered.name");
                break;
            case 2:
                assert.equal(test3.name, registered.name, "test3.name === registered.name");
                break;
            default:
                assert.ok(false, 'unexpected index iterated');
                break;
        }
    }

    registry.each(callback, true);

});

QUnit.test("each(callback, prioritize, thisArg)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    var ctx = {custom: true};

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // we should be iterating 3 times with 4 assertions per loop so:
    assert.expect(12);

    var expected_index = 0;
    function callback(registered, index){
        assert.deepEqual(this, ctx, 'this === ctx');
        assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
        assert.equal(index, expected_index, 'index === expected_index');
        expected_index++;
        switch (index){
            case 0:
                assert.equal(test2.name, registered.name, "test2.name === registered.name");
                break;
            case 1:
                assert.equal(test.name, registered.name, "test.name === registered.name");
                break;
            case 2:
                assert.equal(test3.name, registered.name, "test3.name === registered.name");
                break;
            default:
                assert.ok(false, 'unexpected index iterated');
                break;
        }
    }

    registry.each(callback, true, ctx);

});

QUnit.test("find(callback):invalid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // we should be iterating 3 times with 3 assertions per loop + 1 for the final result check so:
    assert.expect(10);

    var expected_index = 0;
    function callback(registered, index){
        assert.deepEqual(this, callback, 'this === callback');
        assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
        assert.equal(index, expected_index, 'index === expected_index');
        expected_index++;
        return registered.name === 'does-not-exist';
    }

    var found = registry.find(callback);

    assert.equal(found, null, 'found === null');

});

QUnit.test("find(callback):valid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // without prioritization we cannot guarantee the order and so cannot check for a
    // certain number of iterations using assert.expect

    var found = registry.find(function(registered){
        return registered.name === 'test2';
    });

    // so simply check the result is the expected result

    assert.equal(found.name, test2.name, 'found.name === test2.name');
    assert.equal(found.ctor, test2.ctor, 'found.ctor === test2.ctor');
    assert.propEqual(found.config, test2.config, 'found.config === test2.config');
    assert.equal(found.priority, test2.priority, 'found.priority === test2.priority');

});

QUnit.test("find(callback, prioritize)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // we should be iterating once due to prioritization with 4 assertions + 4 more for the final result check so:
    assert.expect(8);

    var expected_index = 0;
    function callback(registered, index){
        assert.deepEqual(this, callback, 'this === callback');
        assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
        assert.equal(index, expected_index, 'index === expected_index');
        assert.equal(registered.name, test2.name, 'registered.name === test2.name');
        expected_index++;
        return registered.name === 'test2';
    }

    var found = registry.find(callback, true);

    assert.equal(found.name, test2.name, 'found.name === test2.name');
    assert.equal(found.ctor, test2.ctor, 'found.ctor === test2.ctor');
    assert.propEqual(found.config, test2.config, 'found.config === test2.config');
    assert.equal(found.priority, test2.priority, 'found.priority === test2.priority');

});

QUnit.test("find(callback, prioritize, thisArg)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    var ctx = {custom: true};

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    // we should be iterating once due to prioritization with 4 assertions + 4 more for the final result check so:
    assert.expect(8);

    var expected_index = 0;
    function callback(registered, index){
        assert.deepEqual(this, ctx, 'this === callback');
        assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
        assert.equal(index, expected_index, 'index === expected_index');
        assert.equal(registered.name, test2.name, 'registered.name === test2.name');
        expected_index++;
        return registered.name === 'test2';
    }

    var found = registry.find(callback, true, ctx);

    assert.equal(found.name, test2.name, 'found.name === test2.name');
    assert.equal(found.ctor, test2.ctor, 'found.ctor === test2.ctor');
    assert.propEqual(found.config, test2.config, 'found.config === test2.config');
    assert.equal(found.priority, test2.priority, 'found.priority === test2.priority');

});

QUnit.test("fromType(type):invalid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    // don't register the TestClass2 so we can check for failure
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    var found = registry.fromType(TestClass2);

    assert.equal(found, null, 'found === null');

});

QUnit.test("fromType(type):valid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 2
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    var found = registry.fromType(TestClass2);

    assert.equal(found.name, test2.name, 'found.name === test2.name');
    assert.equal(found.ctor, test2.ctor, 'found.ctor === test2.ctor');
    assert.propEqual(found.config, test2.config, 'found.config === test2.config');
    assert.equal(found.priority, test2.priority, 'found.priority === test2.priority');

});

QUnit.test("getBaseClass():invalid", function(assert){

    // to register a base class it needs a priority < 0 so here we register no base class

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = FooUtils.Class.extend();
    var TestClass3 = FooUtils.Class.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 2
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 1
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    var base = registry.getBaseClass();
    assert.equal(base, null, 'base === null');

});

QUnit.test("getBaseClass():valid", function(assert){

    // here we make the TestClass the base class for all others,
    // this is intended to be used in conjunction with the allowBase option
    // to create a sort of abstract base class that can be registered with
    // it's own config to allow for inheritance but not creation of specific
    // classes.

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = TestClass.extend();
    var TestClass3 = TestClass2.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: -1
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 1
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 0
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    var base = registry.getBaseClass();
    assert.equal(base.ctor, TestClass, 'base.ctor === TestClass');

});

QUnit.test("getBaseClasses(name)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = TestClass.extend();
    var TestClass3 = TestClass2.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 2
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {someOption: "test2"},
        priority: 3
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {someOption: "test3"},
        priority: 1
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    var nonExistant = registry.getBaseClasses("does-not-exist");
    assert.equal(nonExistant.length, 0, 'nonExistant.length as expected');

    var bases = registry.getBaseClasses("test");
    assert.equal(bases.length, 0, 'bases.length as expected');

    var bases2 = registry.getBaseClasses("test2");
    assert.equal(bases2.length, 1, 'bases2.length as expected');
    assert.equal(bases2[0].name, "test", 'bases2[0].name as expected');

    var bases3 = registry.getBaseClasses("test3");
    assert.equal(bases3.length, 2, 'bases3.length as expected');
    assert.equal(bases3[0].name, "test", 'bases3[0].name as expected');
    assert.equal(bases3[1].name, "test2", 'bases3[1].name as expected');

});

QUnit.test("mergeConfigurations(name, config)", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();
    var TestClass2 = TestClass.extend();
    var TestClass3 = TestClass2.extend();

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {
            fromTest: true,
            overriddenByInheritance: "test",
            overriddenByParam: "test"
        },
        priority: 2
    };
    var test2 = {
        name: 'test2',
        ctor: TestClass2,
        config: {
            fromTest2: true,
            overriddenByInheritance: "test2",
            overriddenByParam: "test2"
        },
        priority: 3
    };
    var test3 = {
        name: 'test3',
        ctor: TestClass3,
        config: {
            fromTest3: true,
            overriddenByInheritance: "test3",
            overriddenByParam: "test3"
        },
        priority: 1
    };

    registry.register(test.name, test.ctor, test.config, test.priority);
    registry.register(test2.name, test2.ctor, test2.config, test2.priority);
    registry.register(test3.name, test3.ctor, test3.config, test3.priority);

    var expected = {
        fromTest: true,
        overriddenByInheritance: "test",
        overriddenByParam: "param",
        setByParam: "param"
    };
    var result = registry.mergeConfigurations(test.name, {overriddenByParam: "param", setByParam: "param"});

    assert.propEqual(result, expected, "result === expected");

    var expected2 = {
        fromTest: true, // from inheritence
        fromTest2: true,
        overriddenByInheritance: "test2",
        overriddenByParam: "param",
        setByParam: "param"
    };
    var result2 = registry.mergeConfigurations(test2.name, {overriddenByParam: "param", setByParam: "param"});

    assert.propEqual(result2, expected2, "result2 === expected2");

    var expected3 = {
        fromTest: true, // from inheritence
        fromTest2: true, // from inheritence
        fromTest3: true,
        overriddenByInheritance: "test3",
        overriddenByParam: "param",
        setByParam: "param"
    };
    var result3 = registry.mergeConfigurations(test3.name, {overriddenByParam: "param", setByParam: "param"});

    assert.propEqual(result3, expected3, "result3 === expected3");

});

QUnit.test("create():invalid", function(assert){

    var registry = new FooUtils.ClassRegistry();
    var TestClass = FooUtils.Class.extend();

    registry.register('test', TestClass);

    var result = registry.create();
    assert.equal(result, null, "result === null");

    var result2 = registry.create(null);
    assert.equal(result2, null, "result2 === null");

    var result3 = registry.create(false);
    assert.equal(result3, null, "result3 === null");

    var result4 = registry.create("does-not-exist");
    assert.equal(result4, null, "result4 === null");

});

QUnit.test("create(name)", function(assert){

    var registry = new FooUtils.ClassRegistry();

    var TestClass = FooUtils.Class.extend({
        construct: function(name, config){
            this.name = name;
            this.config = config;
        }
    });

    registry.register('test', TestClass, {baseOption: "test"}, 0);

    var result = registry.create('test');

    assert.ok(result instanceof TestClass, "result instanceof TestClass");
    assert.equal(result.name, 'test', "result.name === 'test'");
    assert.propEqual(result.config, {baseOption: "test"}, 'result.config === {baseOption: "test"}');

});

QUnit.test("create(name, config)", function(assert){

    var registry = new FooUtils.ClassRegistry();

    var TestClass = FooUtils.Class.extend({
        construct: function(name, config){
            this.name = name;
            this.config = config;
        }
    });

    registry.register('test', TestClass, {baseOption: "test", overriddenOption: "test"}, 0);

    var result = registry.create('test', {overriddenOption: "param", newOption: "param"});

    var expected = {baseOption: "test",overriddenOption: "param", newOption: "param"};

    assert.ok(result instanceof TestClass, "result instanceof TestClass");
    assert.equal(result.name, 'test', "result.name === 'test'");
    assert.propEqual(result.config, expected, 'result.config === expected');

});

QUnit.test("create(name, config, argN)", function(assert){

    var registry = new FooUtils.ClassRegistry();

    var TestClass = FooUtils.Class.extend({
        construct: function(name, config, arg1, arg2, argN){
            this.name = name;
            this.config = config;
            this.arg1 = arg1;
            this.arg2 = arg2;
            this.argN = argN;
        }
    });

    registry.register('test', TestClass, {baseOption: "test", overriddenOption: "test"}, 0);

    var result = registry.create('test', {overriddenOption: "param", newOption: "param"}, true, "string", {name:"object"});

    var expected = {baseOption: "test",overriddenOption: "param", newOption: "param"};

    assert.ok(result instanceof TestClass, "result instanceof TestClass");
    assert.equal(result.name, 'test', "result.name === 'test'");
    assert.propEqual(result.config, expected, 'result.config === expected');
    assert.equal(result.arg1, true, "result.arg1 === true");
    assert.equal(result.arg2, "string", "result.arg2 === 'string'");
    assert.propEqual(result.argN, {name:"object"}, "result.argN === {name:\"object\"}");

});

QUnit.test("construct(options):allowBase", function(assert){

    var registry = new FooUtils.ClassRegistry({allowBase: false});
    var TestClass = FooUtils.Class.extend({
        construct: function(name, config){
            this.name = name;
            this.config = config;
        }
    });
    var TestClass2 = TestClass.extend();

    registry.register('test', TestClass, {fromBase:"test"}, -1);
    registry.register('test2', TestClass2, {fromSelf:"test2"});

    var result = registry.create('test');
    assert.equal(result, null, "result === null");

    var result2 = registry.create('test2');
    var expected = {fromBase:"test",fromSelf:"test2"};

    assert.ok(result2 instanceof TestClass2, "result2 instanceof TestClass2");
    assert.equal(result2.name, 'test2', "result2.name === 'test2'");
    assert.propEqual(result2.config, expected, "result2.config === expected");

});

QUnit.test("construct(options):beforeCreate", function(assert){

    var TestClass = FooUtils.Class.extend({
        construct: function(name, config, fromParam, fromBeforeCreate){
            this.name = name;
            this.config = config;
            this.fromParam = fromParam;
            this.fromBeforeCreate = fromBeforeCreate;
        }
    });

    var test = {
        name: 'test',
        ctor: TestClass,
        config: {someOption: "test"},
        priority: 0
    };

    var registry = new FooUtils.ClassRegistry({
        beforeCreate: function(registered, args){
            // first check we got the expected args supplied
            assert.ok(this instanceof FooUtils.ClassRegistry, "this instanceof FooUtils.ClassRegistry");
            assert.ok(ClassRepository_isRegisteredObject(registered), 'isRegisteredObject(registered) === true');
            assert.equal(registered.name, test.name, "registered.name === test.name");
            assert.equal(args.length, 3, "args.length === 3");
            assert.equal(args[0], test.name, "args[0] === test.name");
            assert.propEqual(args[1], test.config, "args[1] === test.config");
            assert.equal(args[2], true, "args[2] === true");

            // now change some of the values and add a 4th
            args[1].someOption = "changed";
            args[2] = false;

            args.push("bc_param");

            return args;
        }
    });

    registry.register(test.name, test.ctor, test.config, test.priority);

    var result = registry.create(test.name, {}, true);

    var expected = {someOption:"changed"};

    assert.ok(result instanceof TestClass, "result instanceof TestClass");
    assert.equal(result.name, 'test', "result.name === 'test'");
    assert.propEqual(result.config, expected, 'result.config === expected');
    assert.equal(result.fromParam, false, "result.fromParam === true");
    assert.equal(result.fromBeforeCreate, "bc_param", "result.fromBeforeCreate === 'bc_param'");

});
