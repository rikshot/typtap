import { test, Typtap } from 'test';

test('no message', (c) => {
    c.assert(true, true);
});

test('true', (c) => {
    c.assert(true, true, 'check true');
});

test('false', (c) => {
    c.assert(false, false, 'check false');
});

test('empty array', (c) => {
    c.assert([], [], 'check empty array');
});

test('array', (c) => {
    c.assert([true, false, null, [], {}, undefined], [true, false, null, [], {}, undefined], 'check array');
    c.assert([], [true], 'check array length');
    c.assert([true], [false], 'check not equal array');
    c.assert({}, [], 'check not array');
});

test('date', (c) => {
    c.assert(new Date(), new Date(), 'check date');
    c.assert(new Date(), {}, 'check inequal date');
});

test('regexp', (c) => {
    c.assert(new RegExp(''), new RegExp(''), 'check regexp');
    c.assert(new RegExp(''), {}, 'check not regexp');
});

test('object', (c) => {
    c.assert({value: true}, {value: true}, 'check object');
    c.assert({value: true}, {foo: true, bar: false}, 'check object keys');
    c.assert({value: true}, {foo: false}, 'check object keys');
    c.assert({value: true}, {value: false}, 'check inequal object');
});

test('non equal', (c) => {
    c.assert(NaN, NaN, 'check NaN');
});

test('throw error', (c) => {
    throw new Error('error');
});

test('throw string', (c) => {
    throw 'error';
});

test('timeout', (c) => {
    c.test('should timeout', () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 100);
        });
    }, {timeout: 50});
    c.test('should not timeout', () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 50);
        });
    }, {timeout: 100});
});

test('filter', (c) => {
    Typtap.Default.filter = /foobar/;
    c.test('foobar', (cc) => {
        cc.assert(true, true, 'check filter');
    });
});
