import equal from 'fast-deep-equal';
import { ITyptapReporter, Tap } from 'tap';

export interface ITestOptions {
    timeout?: number;
}

export type ITestFunction =
    (description: string, runner: (context: ITestContext) => void | Promise<void>, options?: ITestOptions) => void;

export interface ITestContext {
    test: ITestFunction;
    pass: (message?: string) => void;
    fail: (message?: string) => void;
    equal: (actual: any, expected: any, message?: string) => void;
    notEqual: (actual: any, expected: any, message?: string) => void;
}

export interface ITestResult {
    id: number;
    description: string;
    passed: boolean;
    error?: Error;
}

export class Typtap {

    public static Default = new Typtap(new Tap());

    public filter?: RegExp;

    private passed = 0;
    private failed = 0;
    private counter = 0;

    private readonly reporter: ITyptapReporter;
    private readonly context: ITestContext;

    private readonly tests: Array<() => Promise<void>> = [];

    private constructor(reporter: ITyptapReporter) {
        this.reporter = reporter;

        this.context = {
            equal: (actual: any, expected: any, message?: string) => this.report(equal(actual, expected), message),
            fail: (message?: string) => this.report(false, message),
            notEqual: (actual: any, expected: any, message?: string) => this.report(!equal(actual, expected), message),
            pass: (message?: string) => this.report(true, message),
            test: (description: string, runner: (context: ITestContext) => void | Promise<void>, options?: ITestOptions) => this.test(description, runner, options),
        };
    }

    public test(description: string, runner: (context: ITestContext) => void | Promise<void>, options?: ITestOptions) {
        if (this.filter && !this.filter.test(description)) {
            return;
        }
        ++this.counter;
        this.tests.push(async () => {
            this.reporter.label(description);
            try {
                if (options && typeof options.timeout === 'number') {
                    await Promise.race([
                        runner(this.context),
                        new Promise((resolve, reject) => {
                            setTimeout(() => reject(new Error('Timeout')), options.timeout);
                        }),
                    ]);
                } else {
                    await runner(this.context);
                }
            } catch (error) {
                this.reporter.error(error);
            }
        });
    }

    public async run() {
        this.reporter.start();
        for (const runner of this.tests) {
            await runner();
        }
        this.reporter.end(this.passed, this.failed);
        return {passed: this.passed, failed: this.failed};
    }

    private report(passed: boolean, message?: string) {
        if (passed) {
            ++this.passed;
        } else {
            ++this.failed;
        }
        this.reporter.test({
            description: message ? message : '',
            id: this.counter,
            passed,
        });
    }

}

export const test: ITestFunction =
    (description: string, runner: (context: ITestContext) => void | Promise<void>, options?: ITestOptions) => {
        Typtap.Default.test(description, runner);
    };
