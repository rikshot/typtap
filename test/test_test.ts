import { test } from 'test';

test('true', c => {
    c.assert(true, 'check true');
});

test('false', c => {
    c.assert(false, 'check false');
});

test('throw error', c => {
    throw new Error('error');
});

test('throw string', c => {
    throw 'error';
});
