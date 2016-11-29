QUnit.module('Throttle');

QUnit.test('construct', function (assert) {

	assert.expect(11);

	var done = assert.async();

	var throttle = new FooUtils.Throttle(100);

	assert.ok(throttle instanceof FooUtils.Throttle);
	assert.equal(throttle.id, null);
	assert.equal(throttle.idle, 100);
	assert.equal(throttle.active, false);

	var started = Date.now();
	throttle.limit(function () {

		// this is probably never going to be 100ms exactly but it should be a value that is fairly close, I've given it a .025ms buffer to allow for some additional time for execution
		var finished = Date.now() - started;
		assert.ok(finished >= 100 && finished < 125);
		assert.equal(throttle.id, null);
		assert.equal(throttle.idle, 100);
		assert.equal(throttle.active, false);

		done();

	});
	assert.ok(typeof throttle.id === 'number');
	assert.equal(throttle.idle, 100);
	assert.equal(throttle.active, true);
});


QUnit.test('limit', function (assert) {

	assert.expect(1);

	var done = assert.async();

	// create a new throttle
	var throttle = new FooUtils.Throttle( 50 );
	// this `for` loop represents something like the window resize event that could call your handler multiple times a second
	for (var i = 0, max = 5; i < max; i++){
		throttle.limit( function(){
			assert.ok(true, "Should only ever be called once.");
			done();
		} );
	}

});

QUnit.test('clear', function (assert) {

	assert.expect(0);

	var done = assert.async();

	// create a new throttle
	var throttle = new FooUtils.Throttle( 50 );
	// this `for` loop represents something like the window resize event that could call your handler multiple times a second
	for (var i = 0, max = 5; i < max; i++){
		throttle.limit( function(){
			assert.ok(false, "Should never be called.");
		} );
	}
	// cancel the current throttle timer
	throttle.clear();

	// wait longer than the idle limit before ending the test to make sure the callback is never actually called
	setTimeout(function () {
		done();
	}, 100);

});