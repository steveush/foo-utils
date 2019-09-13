QUnit.module("Event");

QUnit.test('construct', function (assert) {

    var obj = new FooUtils.Event("test");
    assert.equal(obj.type, "test", "Event type is not correct.");
    assert.equal(obj.namespace, null, "Event namespace is not correct.");
    assert.notOk(obj.defaultPrevented, "Event defaultPrevented is true");
    assert.equal(obj.target, null, "Event target is not correct.");

});

QUnit.test('construct:error', function (assert) {

    try {
        new FooUtils.Event();
        assert.ok(false, "Should never reach this assertion.");
    } catch(err){
        assert.ok(err instanceof SyntaxError, "Unexpected error returned from constructor.");
    }

});

QUnit.test('construct:namespaced', function (assert) {

    var obj = new FooUtils.Event("test.named");
    assert.equal(obj.type, "test", "Event type is not correct.");
    assert.equal(obj.namespace, "named", "Event namespace is not correct.");
    assert.notOk(obj.defaultPrevented, "Event defaultPrevented is true");
    assert.equal(obj.target, null, "Event target is not correct.");

});

QUnit.test('preventDefault', function (assert) {

    var obj = new FooUtils.Event("test");
    obj.preventDefault();
    assert.ok(obj.defaultPrevented, "Event.defaultPrevented not set.");
    assert.ok(obj.isDefaultPrevented(), "Event.defaultPrevented not set.");

});

QUnit.module("EventClass");

QUnit.test('construct', function (assert) {

    var obj = new FooUtils.EventClass();
    assert.ok(FooUtils.is.hash(obj.__handlers), "Object.__handlers is not an object.");
    assert.ok(FooUtils.is.empty(obj.__handlers), "Object.__handlers is not empty.");

});

QUnit.test('on', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.on("test", handler);
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"].length === 1, "Object.__handlers['test'] does not contain the first handler.");
    assert.equal(obj.__handlers["test"][0].thisArg, obj, "Object.__handlers['test'][0].thisArg is incorrect.");

    var thisArg = {testObject: true};
    obj.on("test", handler, thisArg);
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"].length === 2, "Object.__handlers['test'] does not contain the second handler.");
    assert.equal(obj.__handlers["test"][obj.__handlers["test"].length - 1].thisArg, thisArg, "Object.__handlers['test'][1].thisArg is incorrect.");

    obj.on("test2", handler);
    assert.equal(Object.keys(obj.__handlers).length, 2, "Object.__handlers.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.__handlers["test2"]) && obj.__handlers["test2"].length === 1, "Object.__handlers['test2'] does not contain the handler.");
    assert.equal(obj.__handlers["test2"][obj.__handlers["test2"].length - 1].thisArg, obj, "Object.__handlers['test2'][0].thisArg is incorrect.");

});

QUnit.test('on:namespaced', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test.namespaced", function(){});
    obj.on("test", function(){});
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"].length === 2, "Object.__handlers['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"][0].namespace === "namespaced", "Object.__handlers['test'][0].namespace is not set correctly.");

    obj.on("test2.namespaced", function(){});
    obj.on("test2", function(){});
    assert.equal(Object.keys(obj.__handlers).length, 2, "Object.__handlers.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.__handlers["test2"]) && obj.__handlers["test2"].length === 2, "Object.__handlers['test2'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.__handlers["test2"]) && obj.__handlers["test2"][0].namespace === "namespaced", "Object.__handlers['test2'][0].namespace is not set correctly.");

});

QUnit.test('on:anonymous', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test", function(){});
    obj.on("test", function(){});
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"].length === 2, "Object.__handlers['test'] does not contain all the handlers.");

    obj.on("test2", function(){});
    obj.on("test2", function(){});
    assert.equal(Object.keys(obj.__handlers).length, 2, "Object.__handlers.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.__handlers["test2"]) && obj.__handlers["test2"].length === 2, "Object.__handlers['test2'] does not contain all the handlers.");

});

QUnit.test('on:object', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on({
        "test": function() {},
        "test2": function() {}
    });
    obj.on({
        "test": function() {},
        "test2": function() {}
    });
    assert.equal(Object.keys(obj.__handlers).length, 2, "Object.__handlers.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"].length === 2, "Object.__handlers['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.__handlers["test2"]) && obj.__handlers["test2"].length === 2, "Object.__handlers['test2'] does not contain all the handlers.");

    obj.on({
        "test test2": function() {}
    });
    assert.equal(Object.keys(obj.__handlers).length, 2, "Object.__handlers.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.__handlers["test"]) && obj.__handlers["test"].length === 3, "Object.__handlers['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.__handlers["test2"]) && obj.__handlers["test2"].length === 3, "Object.__handlers['test2'] does not contain all the handlers.");

});

QUnit.test('off', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.on("test", handler);
    obj.off("test", handler);
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on("test", handler);
    obj.off("test");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on("test", handler);
    obj.on("test2", handler);
    obj.off("test", handler);
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");

    obj.off("test2", handler);
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

});

QUnit.test('off:namespaced', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test.namespaced", function(){});
    obj.off("test", function(){});
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");

    obj.off("test.namespaced");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on("test.namespaced", function(){});
    obj.on("test2.namespaced", function(){});
    obj.off(".namespaced");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on("test.namespaced", function(){});
    obj.on("test2", function(){});
    obj.off(".namespaced");
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");

    obj.off("test2");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

});

QUnit.test('off:anonymous', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test", function(){});
    obj.off("test", function(){});
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");

    obj.off("test");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on("test", function(){});
    obj.on("test2", function(){});
    obj.off("test");
    assert.equal(Object.keys(obj.__handlers).length, 1, "Object.__handlers.keys length is not 1.");

    obj.off("test2");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

});

QUnit.test('off:object', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.on({
        "test": handler,
        "test2": handler
    });
    obj.off({
        "test": handler,
        "test2": handler
    });
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on({
        "test test2": handler
    });
    obj.off({
        "test": handler,
        "test2": handler
    });
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on({
        "test test2": handler
    });
    obj.off({
        "test test2": handler
    });
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on({
        "test": handler,
        "test2": handler
    });
    obj.off({
        "test test2": handler
    });
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");

    obj.on({
        "test": function() {},
        "test2": function() {}
    });
    obj.off("test test2");
    assert.equal(Object.keys(obj.__handlers).length, 0, "Object.__handlers.keys length is not 0.");


});

QUnit.test('trigger', function(assert){

    var obj = new FooUtils.EventClass();
    obj.on("test", function(e){
        assert.ok(e instanceof FooUtils.Event, "Object is not instance of Event.");
        assert.equal(e.type, "test", "Event.type is incorrect.");
        assert.equal(e.target, obj, "Event.target is incorrect.");
    });
    obj.trigger("test");

});

QUnit.test('trigger:namespaced', function(assert){

    var obj = new FooUtils.EventClass();
    obj.on("test.namespaced", function(e){
        assert.ok(e instanceof FooUtils.Event, "Object is not instance of Event.");
        assert.equal(e.type, "test", "Event.type is incorrect.");
        assert.equal(e.target, obj, "Event.target is incorrect.");
    });
    obj.on("test", function(e){
        assert.notOk(true, "Non namespaced event triggered");
    });
    obj.trigger("test.namespaced");

});

QUnit.test('trigger:preventDefault', function(assert){

    var obj = new FooUtils.EventClass();
    obj.on("test", function(e){
        e.preventDefault();
    });
    var event = obj.trigger("test");
    assert.ok(event.defaultPrevented, "Event.defaultPrevented not set.");
    assert.ok(event.isDefaultPrevented(), "Event.defaultPrevented not set.");

});

QUnit.test('trigger:custom', function(assert){

    var CustomEvent = FooUtils.Event.extend({
        construct: function(){
            this._super("custom-event");
        }
    });

    var obj = new FooUtils.EventClass();
    obj.on("custom-event", function(e){
        assert.ok(e instanceof FooUtils.Event, "Object is not instance of Event.");
        assert.ok(CustomEvent, "Object is not instance of CustomEvent.");
        assert.equal(e.type, "custom-event", "Event.type is incorrect.");
    });
    obj.trigger(new CustomEvent());

});
