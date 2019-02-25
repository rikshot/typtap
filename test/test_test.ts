import { test, Typtap } from 'test';

test('no message', (c) => {
    c.equal(true, true);
});

test('true', (c) => {
    c.equal(true, true, 'check true');
});

test('false', (c) => {
    c.equal(false, false, 'check false');
});

test('empty array', (c) => {
    c.equal([], [], 'check empty array');
});

test('array', (c) => {
    c.equal([true, false, null, [], {}, undefined], [true, false, null, [], {}, undefined], 'check array');
    c.notEqual([], [true], 'check array length');
    c.notEqual([true], [false], 'check not equal array');
    c.notEqual({}, [], 'check not array');
});

test('date', (c) => {
    c.equal(new Date(), new Date(), 'check date');
    c.notEqual(new Date(), {}, 'check inequal date');
});

test('regexp', (c) => {
    c.equal(new RegExp(''), new RegExp(''), 'check regexp');
    c.notEqual(new RegExp(''), {}, 'check not regexp');
});

test('object', (c) => {
    c.equal({value: true}, {value: true}, 'check object');
    c.notEqual({value: true}, {foo: true, bar: false}, 'check object keys');
    c.notEqual({value: true}, {foo: false}, 'check object keys');
    c.notEqual({value: true}, {value: false}, 'check inequal object');
});

test('non equal', (c) => {
    c.equal(NaN, NaN, 'check NaN');
});

test('throw error', (c) => {
    try {
        throw new Error('error');
        c.fail('did not throw');
    } catch (e) {
        c.pass('did throw');
    }
});

test('throw string', (c) => {
    try {
        throw 'error';
        c.fail('did not throw');
    } catch (e) {
        c.pass('did throw');
    }
});

test('timeout', async (c) => {
    const typtap = new Typtap();
    typtap.test('should timeout', () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 100);
        });
    }, {timeout: 50});
    typtap.test('should not timeout', () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 50);
        });
    }, {timeout: 100});
    const { errored } = await typtap.run();
    c.equal(errored, 1, 'did timeout');
});

test('include filter', (c) => {
    const typtap = new Typtap();
    typtap.test('foobar', () => {
        c.pass('check filter');
    });
    typtap.test('asdasd', () => {
        c.fail('should not run');
    });
    typtap.include = /foobar/;
    typtap.run();
});

test('exclude filter', (c) => {
    const typtap = new Typtap();
    typtap.test('foobar', () => {
        c.pass('check filter');
    });
    typtap.test('foobar_not', () => {
        c.fail('should not run');
    });
    typtap.exclude = /not/;
    typtap.run();
});

test('combined filters', (c) => {
    const typtap = new Typtap();
    typtap.test('foobar', () => {
        c.pass('check filter');
    });
    typtap.test('foobar_not', () => {
        c.fail('should not run');
    });
    typtap.include = /foobar/;
    typtap.exclude = /not/;
    typtap.run();
});

test('single mode', (c) => {
    const typtap = new Typtap();
    typtap.test('should work', () => {
        c.pass('worked');
    });
    typtap.test('should not work', () => {
        c.fail('failed');
    });
    typtap.single = true;
    typtap.run();
});
