QUnit.module('animation', {
	before: function () {
		var css = ".animatable {";
		css +=		"-webkit-animation: test-animation 1s 1;";
		css +=		"-moz-animation: test-animation 1s 1;";
		css +=		"-ms-animation: test-animation 1s 1;";
		css +=		"animation: test-animation 1s 1;";
		css +=		"animation-play-state: paused;";
		css +=		"}";
		css +=		"@keyframes test-animation {";
		css +=		"0% { opacity: 0; }";
		css +=		"100% { opacity: 1; }";
		css +=		"}";
		css +=		".start-animation {";
		css +=		"animation-play-state: running;";
		css +=		"}";
		css +=		".duration-test-1 {";
		css +=		"-webkit-animation: test-animation 0.5s 1;";
		css +=		"-moz-animation: test-animation 0.5s 1;";
		css +=		"-ms-animation: test-animation 0.5s 1;";
		css +=		"animation: test-animation 0.5s 1;";
		css +=		"}";
		css +=		".duration-test-2 {";
		css +=		"-webkit-animation: test-animation 500ms 1;";
		css +=		"-moz-animation: test-animation 500ms 1;";
		css +=		"-ms-animation: test-animation 500ms 1;";
		css +=		"animation: test-animation 500ms 1;";
		css +=		"}";
		css +=		".duration-test-3 {";
		css +=		"-webkit-animation: test-animation 0.75s 1;";
		css +=		"-moz-animation: test-animation 0.75s 1;";
		css +=		"-ms-animation: test-animation 0.75s 1;";
		css +=		"animation: test-animation 0.75s 1;";
		css +=		"}";
		css +=		".duration-test-4 {";
		css +=		"-webkit-animation-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"-moz-animation-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"-ms-animation-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"animation-duration: 0.5s, 0.75s, 300ms, 800ms;";
		css +=		"}";
		css +=		".iterations-test-1 {";
		css +=		"-webkit-animation: test-animation 0.5s 1;";
		css +=		"-moz-animation: test-animation 0.5s 1;";
		css +=		"-ms-animation: test-animation 0.5s 1;";
		css +=		"animation: test-animation 0.5s 1;";
		css +=		"}";
		css +=		".iterations-test-2 {";
		css +=		"-webkit-animation: test-animation 0.5s 3;";
		css +=		"-moz-animation: test-animation 0.5s 3;";
		css +=		"-ms-animation: test-animation 0.5s 3;";
		css +=		"animation: test-animation 0.5s 3;";
		css +=		"}";
		css +=		".iterations-test-3 {";
		css +=		"-webkit-animation: test-animation 0.5s infinite;";
		css +=		"-moz-animation: test-animation 0.5s infinite;";
		css +=		"-ms-animation: test-animation 0.5s infinite;";
		css +=		"animation: test-animation 0.5s infinite;";
		css +=		"}";
		css +=		".iterations-test-4 {";
		css +=		"-webkit-animation-iteration-count: 1, 0, 2;";
		css +=		"-moz-animation-iteration-count: 1, 0, 2;";
		css +=		"-ms-animation-iteration-count: 1, 0, 2;";
		css +=		"animation-iteration-count: 1, 0, 2;";
		css +=		"}";
		css +=		".iterations-test-5 {";
		css +=		"-webkit-animation-iteration-count: 1, 0, 2, infinite;";
		css +=		"-moz-animation-iteration-count: 1, 0, 2, infinite;";
		css +=		"-ms-animation-iteration-count: 1, 0, 2, infinite;";
		css +=		"animation-iteration-count: 1, 0, 2, infinite;";
		css +=		"}";
		$('head').append($('<style/>', {id: 'animation-styles', text: css}));
		$('#qunit-fixture').empty();
	},
	after: function () {
		$('#animation-styles').remove();
		$('#qunit-fixture').empty();
	},
	beforeEach: function () {
		$('#qunit-fixture').append(
			$('<div/>', {'class': 'animatable trans-1'}),
			$('<div/>', {'class': 'animatable trans-2'}),
			$('<div/>', {'class': 'duration-test-1'}),
			$('<div/>', {'class': 'duration-test-2'}),
			$('<div/>', {'class': 'duration-test-3'}),
			$('<div/>', {'class': 'duration-test-4'}),
			$('<div/>', {'class': 'iterations-test-1'}),
			$('<div/>', {'class': 'iterations-test-2'}),
			$('<div/>', {'class': 'iterations-test-3'}),
			$('<div/>', {'class': 'iterations-test-4'}),
			$('<div/>', {'class': 'iterations-test-5'})
		);
	},
	afterEach: function () {
		$('#qunit-fixture').empty();
	}
});

QUnit.test('duration', function (assert) {

	assert.equal( FooUtils.animation.duration($('.duration-test-1')), FooUtils.animation.supported ? 500 : 0 );
	assert.equal( FooUtils.animation.duration($('.duration-test-2')), FooUtils.animation.supported ? 500 : 0 );
	assert.equal( FooUtils.animation.duration($('.duration-test-3')), FooUtils.animation.supported ? 750 : 0 );
	assert.equal( FooUtils.animation.duration($('.duration-test-4')), FooUtils.animation.supported ? 800 : 0 );
	assert.equal( FooUtils.animation.duration($()), 0 );
	assert.equal( FooUtils.animation.duration(null), 0 );

});

QUnit.test('iterations', function (assert) {

	assert.equal( FooUtils.animation.iterations($('.iterations-test-1')), FooUtils.animation.supported ? 1 : 1 );
	assert.equal( FooUtils.animation.iterations($('.iterations-test-2')), FooUtils.animation.supported ? 3 : 1 );
	assert.equal( FooUtils.animation.iterations($('.iterations-test-3')), FooUtils.animation.supported ? Infinity : 1 );
	assert.equal( FooUtils.animation.iterations($('.iterations-test-4')), FooUtils.animation.supported ? 2 : 1 );
	assert.equal( FooUtils.animation.iterations($('.iterations-test-5')), FooUtils.animation.supported ? Infinity : 1 );
	assert.equal( FooUtils.animation.iterations($()), 1 );
	assert.equal( FooUtils.animation.iterations(null), 1 );

});

QUnit.test('start', function (assert) {

	assert.expect(2);
	var done = assert.async(), wait = [];

	var a1 = FooUtils.animation.start( $('.trans-1'), 'start-animation', true ).then(function(){
		assert.ok(true, "Class triggered animation.");
	});
	wait.push(a1);

	var a2 = FooUtils.animation.start( $('.trans-2'), function($el){
		$el.css("animation", "test-animation 1s 1");
	} ).then(function(){
		assert.ok(true, "Function triggered animation.");
	});
	wait.push(a2);

	jQuery.when.apply($, wait).then(function(){
		done();
	});

});