QUnit.module("Event");

QUnit.test('.parse', function (assert) {

    var empty = {namespaced: false, type: null, namespace: null};
    assert.deepEqual(FooUtils.Event.parse(), empty);
    assert.deepEqual(FooUtils.Event.parse(false), empty);
    assert.deepEqual(FooUtils.Event.parse(null), empty);
    assert.deepEqual(FooUtils.Event.parse(""), empty);
    assert.deepEqual(FooUtils.Event.parse("test"), {namespaced: false, type: "test", namespace: null});
    assert.deepEqual(FooUtils.Event.parse("test.namespace"), {namespaced: true, type: "test", namespace: "namespace"});
    assert.deepEqual(FooUtils.Event.parse(".namespace"), {namespaced: true, type: null, namespace: "namespace"});

});

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
    assert.ok(FooUtils.is.hash(obj.events), "Object.events is not an object.");
    assert.ok(FooUtils.is.empty(obj.events), "Object.events is not empty.");

});

QUnit.test('addListener', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.addListener("test", handler);
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 1, "Object.events['test'] does not contain the first handler.");
    assert.equal(obj.events["test"][0].thisArg, obj, "Object.events['test'][0].thisArg is incorrect.");

    var thisArg = {testObject: true};
    obj.addListener("test", handler, thisArg);
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 2, "Object.events['test'] does not contain the second handler.");
    assert.equal(obj.events["test"][obj.events["test"].length - 1].thisArg, thisArg, "Object.events['test'][1].thisArg is incorrect.");

    obj.addListener("test2", handler);
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 1, "Object.events['test2'] does not contain the handler.");
    assert.equal(obj.events["test2"][obj.events["test2"].length - 1].thisArg, obj, "Object.events['test2'][0].thisArg is incorrect.");

});

QUnit.test('addListener:namespaced', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.addListener("test.namespaced", function(){});
    obj.addListener("test", function(){});
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 2, "Object.events['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"][0].namespace === "namespaced", "Object.events['test'][0].namespace is not set correctly.");

    obj.addListener("test2.namespaced", function(){});
    obj.addListener("test2", function(){});
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 2, "Object.events['test2'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"][0].namespace === "namespaced", "Object.events['test2'][0].namespace is not set correctly.");

});

QUnit.test('removeListener', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.addListener("test", handler);
    obj.removeListener("test", handler);
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.addListener("test", handler);
    obj.removeListener("test");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.addListener("test", handler);
    obj.addListener("test2", handler);
    obj.removeListener("test", handler);
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.removeListener("test2", handler);
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

});

QUnit.test('removeListener:namespaced', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.addListener("test.namespaced", function(){});
    obj.removeListener("test", function(){});
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.removeListener("test.namespaced");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.addListener("test.namespaced", function(){});
    obj.addListener("test2.namespaced", function(){});
    obj.removeListener(".namespaced");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.addListener("test.namespaced", function(){});
    obj.addListener("test2", function(){});
    obj.removeListener(".namespaced");
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.removeListener("test2");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

});

QUnit.test('emit', function(assert){

    var obj = new FooUtils.EventClass();
    obj.addListener("test", function(e){
        assert.ok(e instanceof FooUtils.Event, "Object is not instance of Event.");
        assert.equal(e.type, "test", "Event.type is incorrect.");
    });
    obj.emit(new FooUtils.Event("test"));

});

QUnit.test('emit:custom', function(assert){

    var CustomEvent = FooUtils.Event.extend({
        construct: function(){
            this._super("custom-event");
        }
    });

    var obj = new FooUtils.EventClass();
    obj.addListener("custom-event", function(e){
        assert.ok(e instanceof FooUtils.Event, "Object is not instance of Event.");
        assert.ok(e instanceof CustomEvent, "Object is not instance of CustomEvent.");
        assert.equal(e.type, "custom-event", "Event.type is incorrect.");
    });
    obj.emit(new CustomEvent());

});

QUnit.test('on', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.on("test", handler);
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 1, "Object.events['test'] does not contain the first handler.");
    assert.equal(obj.events["test"][0].thisArg, obj, "Object.events['test'][0].thisArg is incorrect.");

    var thisArg = {testObject: true};
    obj.on("test", handler, thisArg);
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 2, "Object.events['test'] does not contain the second handler.");
    assert.equal(obj.events["test"][obj.events["test"].length - 1].thisArg, thisArg, "Object.events['test'][1].thisArg is incorrect.");

    obj.on("test2", handler);
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 1, "Object.events['test2'] does not contain the handler.");
    assert.equal(obj.events["test2"][obj.events["test2"].length - 1].thisArg, obj, "Object.events['test2'][0].thisArg is incorrect.");

});

QUnit.test('on:namespaced', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test.namespaced", function(){});
    obj.on("test", function(){});
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 2, "Object.events['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"][0].namespace === "namespaced", "Object.events['test'][0].namespace is not set correctly.");

    obj.on("test2.namespaced", function(){});
    obj.on("test2", function(){});
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 2, "Object.events['test2'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"][0].namespace === "namespaced", "Object.events['test2'][0].namespace is not set correctly.");

});

QUnit.test('on:anonymous', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test", function(){});
    obj.on("test", function(){});
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 2, "Object.events['test'] does not contain all the handlers.");

    obj.on("test2", function(){});
    obj.on("test2", function(){});
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 2, "Object.events['test2'] does not contain all the handlers.");

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
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 2, "Object.events['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 2, "Object.events['test2'] does not contain all the handlers.");

    obj.on({
        "test test2": function() {}
    });
    assert.equal(Object.keys(obj.events).length, 2, "Object.events.keys length is not 2.");
    assert.ok(FooUtils.is.array(obj.events["test"]) && obj.events["test"].length === 3, "Object.events['test'] does not contain all the handlers.");
    assert.ok(FooUtils.is.array(obj.events["test2"]) && obj.events["test2"].length === 3, "Object.events['test2'] does not contain all the handlers.");

});

QUnit.test('off', function (assert) {

    var obj = new FooUtils.EventClass(), handler = function(){};
    obj.on("test", handler);
    obj.off("test", handler);
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on("test", handler);
    obj.off("test");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on("test", handler);
    obj.on("test2", handler);
    obj.off("test", handler);
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.off("test2", handler);
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

});

QUnit.test('off:namespaced', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test.namespaced", function(){});
    obj.off("test", function(){});
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.off("test.namespaced");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on("test.namespaced", function(){});
    obj.on("test2.namespaced", function(){});
    obj.off(".namespaced");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on("test.namespaced", function(){});
    obj.on("test2", function(){});
    obj.off(".namespaced");
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.off("test2");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

});

QUnit.test('off:anonymous', function (assert) {

    var obj = new FooUtils.EventClass();
    obj.on("test", function(){});
    obj.off("test", function(){});
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.off("test");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on("test", function(){});
    obj.on("test2", function(){});
    obj.off("test");
    assert.equal(Object.keys(obj.events).length, 1, "Object.events.keys length is not 1.");

    obj.off("test2");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

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
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on({
        "test test2": handler
    });
    obj.off({
        "test": handler,
        "test2": handler
    });
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on({
        "test test2": handler
    });
    obj.off({
        "test test2": handler
    });
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on({
        "test": handler,
        "test2": handler
    });
    obj.off({
        "test test2": handler
    });
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");

    obj.on({
        "test": function() {},
        "test2": function() {}
    });
    obj.off("test test2");
    assert.equal(Object.keys(obj.events).length, 0, "Object.events.keys length is not 0.");


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

QUnit.test('trigger:__all__', function(assert){

    var obj = new FooUtils.EventClass();
    obj.on("__all__", function(e){
        assert.ok(e instanceof FooUtils.Event, "Object is not instance of Event.");
        assert.equal(e.type, "test", "Event.type is incorrect.");
        assert.equal(e.target, obj, "Event.target is incorrect.");
    });
    obj.trigger("test");

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
        assert.ok(e instanceof CustomEvent, "Object is not instance of CustomEvent.");
        assert.equal(e.type, "custom-event", "Event.type is incorrect.");
    });
    obj.trigger(new CustomEvent());

});
