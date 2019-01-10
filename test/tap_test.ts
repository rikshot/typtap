import { Tap } from 'tap';
import { test } from 'test';

test('offset', (c) => {
    const reporter = new Tap();
    c.assert(reporter.print('test', 4), '    test', 'check offset matches');
});
