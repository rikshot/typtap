import { test } from 'test';

test('true', c => {
    c.assert(true, 'check true');
});

test('false', c => {
    c.assert(false, 'check false');
});
