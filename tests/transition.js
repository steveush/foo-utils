QUnit.module('transition', {
	before: function () {
		var css = ".transitionable {";
		css +=		"-webkit-transition: opacity 0.5s ease;";
		css +=		"-moz-transition: opacity 0.5s ease;";
		css +=		"-ms-transition: opacity 0.5s ease;";
		css +=		"transition: opacity 0.5s ease;";
		css +=		"opacity: 0;";
		css +=		"}";
		css +=		".start-transition {";
		css +=		"opacity: 1;";
		css +=		"}";
		css +=		".duration-test-1 {";
		css +=		"-webkit-transition: opacity 0.5s ease;";
		css +=		"-moz-transition: opacity 0.5s ease;";
		css +=		"-ms-transition: opacity 0.5s ease;";
		css +=		"transition: opacity 0.5s ease;";
		css +=		"}";
		css +=		".duration-test-2 {";
		css +=		"-webkit-transition: opacity 500ms ease;";
		css +=		"-moz-transition: opacity 500ms ease;";
		css +=		"-ms-transition: opacity 500ms ease;";
		css +=		"transition: opacity 500ms ease;";
		css +=		"}";
		css +=		".duration-test-3 {";
		css +=		"-webkit-transition-duration: 0.75s;";
		css +=		"-moz-transition-duration: 0.75s;";
		css +=		"-ms-transition-duration: 0.75s;";
		css +=		"transition-duration: 0.75s;";
		css +=		"}";
		css +=		".duration-test-4 {";
		css +=		"-webkit-transition-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"-moz-transition-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"-ms-transition-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"transition-duration: 0.5s, 0.75s, 300ms, 800ms;";
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
			$('<div/>', {'class': 'transitionable trans-1'}),
			$('<div/>', {'class': 'transitionable trans-2'}),
			$('<div/>', {'class': 'duration-test-1'}),
			$('<div/>', {'class': 'duration-test-2'}),
			$('<div/>', {'class': 'duration-test-3'}),
			$('<div/>', {'class': 'duration-test-4'})
		);
	},
	afterEach: function () {
		$('#qunit-fixture').empty();
	}
});

QUnit.test('duration', function (assert) {

	assert.equal( FooUtils.transition.duration($('.duration-test-1')), FooUtils.transition.supported ? 500 : 0 );
	assert.equal( FooUtils.transition.duration($('.duration-test-2')), FooUtils.transition.supported ? 500 : 0 );
	assert.equal( FooUtils.transition.duration($('.duration-test-3')), FooUtils.transition.supported ? 750 : 0 );
	assert.equal( FooUtils.transition.duration($('.duration-test-4')), FooUtils.transition.supported ? 800 : 0 );
	assert.equal( FooUtils.transition.duration($()), 0 );
	assert.equal( FooUtils.transition.duration(null), 0 );

});

QUnit.test('start', function (assert) {

	assert.expect(2);
	var done = assert.async(), wait = [];

	var t1 = FooUtils.transition.start( $('.trans-1'), 'start-transition', true ).then(function(){
		assert.ok(true, "Class triggered transition.");
	});
	wait.push(t1);

	var t2 = FooUtils.transition.start( $('.trans-2'), function($el){
		$el.css("opacity", 1);
	} ).then(function(){
		assert.ok(true, "Function triggered transition.");
	});
	wait.push(t2);

	jQuery.when.apply($, wait).then(function(){
		done();
	});

});