import equal from 'fast-deep-equal';
import { ITyptapReporter, Tap } from './tap';

export interface ITestOptions {
    timeout?: number;
}

export type ITestRunner = (context: ITestContext) => void | Promise<void>;

export type ITestFunction =
    (description: string, runner: ITestRunner, options?: ITestOptions) => void;

export interface ITestContext {
    test: ITestFunction;
    pass: (message?: string) => void;
    fail: (message?: string) => void;
    equal: (actual: any, expected: any, message?: string) => void;
    notEqual: (actual: any, expected: any, message?: string) => void;
}

export interface IPendingTest {
    description: string;
    runner: () => Promise<void>;
}

export interface ITestResult {
    id: number;
    description: string;
    passed: boolean;
    error?: Error;
}

export interface ITestReport {
    passed: number;
    failed: number;
    errored: number;
}

export class Typtap {

    public static Default = new Typtap(new Tap());

    public single = false;

    /** @type {RegExp|undefined} */
    public include?: RegExp = undefined;
    /** @type {RegExp|undefined} */
    public exclude?: RegExp = undefined;

    private passed = 0;
    private failed = 0;
    private errored = 0;
    private counter = 0;

    private readonly reporter?: ITyptapReporter;
    private readonly context: ITestContext;

    private readonly tests: IPendingTest[] = [];

    constructor(reporter?: ITyptapReporter) {
        this.reporter = reporter;
        this.context = {
            equal: (actual: any, expected: any, message?: string) => this.report(equal(actual, expected), message),
            fail: (message?: string) => this.report(false, message),
            notEqual: (actual: any, expected: any, message?: string) => this.report(!equal(actual, expected), message),
            pass: (message?: string) => this.report(true, message),
            test: (description: string, runner: ITestRunner, options?: ITestOptions) => this.test(description, runner, options),
        };
    }

    /** @param {Object=} options */
    public test(description: string, runner: ITestRunner, options?: ITestOptions) {
        this.tests.push({
            description,
            runner: async () => {
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
                    } else {
                        await runner(this.context);
                    }
                } catch (error) {
                    ++this.errored;
                    if (this.reporter) {
                        this.reporter.error(error);
                    }
                }
            },
        });
    }

    public async run(): Promise<ITestReport> {
        if (this.reporter) {
            this.reporter.start();
        }
        let tests = this.tests;
        if (this.single && this.tests.length > 0) {
            tests = [this.tests[0]];
        }
        if (this.include) {
            tests = tests.filter(({ description }) => this.include!.test(description));
        }
        if (this.exclude) {
            tests = tests.filter(({ description }) => !this.exclude!.test(description));
        }
        for (const { runner } of tests) {
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

    private report(passed: boolean, message?: string) {
        if (passed) {
            ++this.passed;
        } else {
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

export const test: ITestFunction =
    (description: string, runner: ITestRunner, options?: ITestOptions) => {
        Typtap.Default.test(description, runner);
    };
