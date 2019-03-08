import { Tap } from './tap';
import { test, Typtap } from './test';

export {
    test,
    Typtap,
    Tap,
};

if (typeof window !== 'undefined') {
    // @ts-ignore
    window.typtap = {
        test,
        Typtap,
        Tap,
    };
}
