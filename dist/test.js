import equal from 'fast-deep-equal';
import { Tap } from './tap';
export class Typtap {
    constructor(reporter) {
        this.single = false;
        this.passed = 0;
        this.failed = 0;
        this.errored = 0;
        this.counter = 0;
        this.tests = [];
        this.reporter = reporter;
        this.context = {
            equal: (actual, expected, message) => this.report(equal(actual, expected), message),
            fail: (message) => this.report(false, message),
            notEqual: (actual, expected, message) => this.report(!equal(actual, expected), message),
            pass: (message) => this.report(true, message),
            test: (description, runner, options) => this.test(description, runner, options),
        };
    }
    test(description, runner, options) {
        if (this.single && this.tests.length > 0) {
            return;
        }
        if (this.include && !this.include.test(description)) {
            return;
        }
        if (this.exclude && this.exclude.test(description)) {
            return;
        }
        this.tests.push(async () => {
            if (this.reporter) {
                this.reporter.label(description);
            }
            try {
                if (options && typeof options.timeout === 'number') {
                    await Promise.race([
                        runner(this.context),
                        new Promise((resolve, reject) => {
                            setTimeout(() => reject(new Error('Timeout')), options.timeout);
                        }),
                    ]);
                }
                else {
                    await runner(this.context);
                }
            }
            catch (error) {
                ++this.errored;
                if (this.reporter) {
                    this.reporter.error(error);
                }
            }
        });
    }
    async run() {
        if (this.reporter) {
            this.reporter.start();
        }
        for (const runner of this.tests) {
            await runner();
        }
        if (this.reporter) {
            this.reporter.end(this.passed, this.failed);
        }
        return {
            passed: this.passed,
            failed: this.failed,
            errored: this.errored,
        };
    }
    report(passed, message) {
        if (passed) {
            ++this.passed;
        }
        else {
            ++this.failed;
        }
        if (this.reporter) {
            this.reporter.test({
                description: message ? message : '',
                id: ++this.counter,
                passed,
            });
        }
    }
}
Typtap.Default = new Typtap(new Tap());
export const test = (description, runner, options) => {
    Typtap.Default.test(description, runner);
};
//# sourceMappingURL=test.js.map