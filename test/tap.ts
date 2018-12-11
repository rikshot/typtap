import { test } from 'test';
import { Tap } from 'tap';

test('offset', c => {
    const reporter = new Tap();
    c.assert(reporter.print('test', 4) === '    test');
});
