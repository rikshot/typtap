import { Tap } from 'tap';
import { test } from 'test';

test('offset', (c) => {
    const reporter = new Tap();
    c.equal(reporter.print('test', 4), '    test', 'check offset matches');
});

test('stack', (c) => {
    const reporter = new Tap();
    reporter.error(new Error('test'));
});

test('string error', (c) => {
    const reporter = new Tap();
    reporter.error('test');
});
