QUnit.module('transition', {
	before: function () {
		var css = ".transitionable {";
		css +=		"-webkit-transition: opacity 0.5s ease, width 1s linear;";
		css +=		"-moz-transition: opacity 0.5s ease, width 1s linear;";
		css +=		"-ms-transition: opacity 0.5s ease, width 1s linear;";
		css +=		"transition: opacity 0.5s ease, width 1s linear;";
		css +=		"opacity: 0;";
		css +=		"width: 0;";
		css +=		"}";
		css +=		".start-transition {";
		css +=		"opacity: 1;";
		css +=		"width: 100px;";
		css +=		"}";
		css +=		"}";
		$('head').append($('<style/>', {id: 'transition-styles', text: css}));
		$('#qunit-fixture').empty();
	},
	after: function () {
		$('#transition-styles').remove();
		$('#qunit-fixture').empty();
	},
	beforeEach: function () {
		$('#qunit-fixture').append(
			$('<div/>', {'class': 'transitionable'})
		);
	},
	afterEach: function () {
		$('#qunit-fixture').empty();
	}
});

QUnit.test('modify', function (assert) {

	assert.expect(1);
	assert.timeout(600);
	var done = assert.async(), start = Date.now();

	FooUtils.transition.modify($('.transitionable'), function($el){
		$el.addClass('start-transition');
	}).then(function(){
		assert.ok(true, "Class triggered transition.");
	}).always(function(){
		var duration = Date.now() - start;
		if (duration < 450){
			assert.ok(false, "Elapsed time too short.");
		}
		done();
	});

});

QUnit.test('modify:immediate', function (assert) {

	assert.expect(1);
	assert.timeout(100);
	var done = assert.async();

	FooUtils.transition.modify($('.transitionable'), function($el){
		$el.addClass('start-transition');
	}, true).then(function(){
		assert.ok(true, "Class triggered transition.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:addClass', function (assert) {

	assert.expect(1);
	var done = assert.async();

	FooUtils.transition.start($('.transitionable'), function($el){
		$el.addClass('start-transition');
	}).then(function(){
		assert.ok(true, "Class triggered transition.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:css', function (assert) {

	assert.expect(1);
	var done = assert.async();

	FooUtils.transition.start($('.transitionable'), function($el){
		$el.css('opacity', 1);
	}).then(function(){
		assert.ok(true, "Style triggered transition.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:propertyName=opacity', function (assert) {

	assert.expect(1);
	assert.timeout(600);

	var done = assert.async();

	FooUtils.transition.start($('.transitionable'), function($el){
		$el.addClass('start-transition');
	}, 'opacity').then(function(){
		assert.ok(true, "Class triggered opacity transitionend before 600ms.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:propertyName=width', function (assert) {

	assert.expect(1);
	assert.timeout(1100);

	var done = assert.async();

	FooUtils.transition.start($('.transitionable'), function($el){
		$el.addClass('start-transition');
	}, 'width').then(function(){
		assert.ok(true, "Class triggered width transitionend before 1100ms.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:timeout-global', function (assert) {

	assert.expect(2);
	assert.timeout(FooUtils.transition.timeout + 100); // use the default + 100ms leeway
	var done = assert.async();

	FooUtils.transition.start($('.transitionable'), function($el){
		// do nothing so the global timeout value is reached
	}).catch(function(err){
		assert.ok(true, "Safety timeout elapsed.");
		assert.ok(err.message === "Transition safety timeout triggered.", "Safety timeout error message set.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:timeout-specific', function (assert) {

	assert.expect(2);
	assert.timeout(500); // we define the timeout below as 400ms so add 100ms leeway
	var done = assert.async();

	FooUtils.transition.start($('.transitionable'), function($el){
		// do nothing so the global timeout value is reached
	}, null, 400).catch(function(err){
		assert.ok(true, "Safety timeout elapsed.");
		assert.ok(err.message === "Transition safety timeout triggered.", "Safety timeout error message set.");
	}).always(function(){
		done();
	});

});

QUnit.test('start:multiple', function (assert) {

	assert.expect(4);
	var done = assert.async(), $transitionable = $('.transitionable'), wait = [];

	wait.push(FooUtils.transition.start($transitionable, function($el){
		$el.addClass('start-transition');
	}));

	// simulate a double click that quickly starts a transition, cancels it and then starts another transition.
	setTimeout(function(){
		wait.push(FooUtils.transition.start($transitionable, function($el){
			$el.removeClass('start-transition');
		}));

		FooUtils.fn.allSettled(wait).then(function(values){
			assert.equal(values[0].status, "rejected", "values[0].status is not rejected.");
			assert.ok(values[0].reason instanceof Error && values[0].reason.message === "Transition cancelled.", "values[0].reason is not the expected error.");

			assert.equal(values[1].status, "fulfilled", "values[1].status is not fulfilled.");
			assert.ok(values[1].value === $transitionable, "values[1].value is not the expected jQuery object.");
			done();
		});
	}, 10);
});
