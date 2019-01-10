import { ITyptapReporter, Tap } from 'tap';
import { equal } from './assert';

export type ITestFunction = (description: string, runner: (context: ITestContext) => void) => void;

export interface ITestContext {
    test: ITestFunction;
    assert: (actual: any, expected: any, message?: string) => void;
}

export interface ITestResult {
    id: number;
    description: string;
    passed: boolean;
    error?: Error;
}

export class Typtap {

    public static Default = new Typtap(new Tap());

    private passed = 0;
    private failed = 0;
    private counter = 0;

    private readonly reporter: ITyptapReporter;
    private readonly context: ITestContext;

    private readonly tests: Array<Promise<void>> = [];

    private constructor(reporter: ITyptapReporter) {
        this.reporter = reporter;
        this.context = {
            assert: (actual: unknown, expected: unknown, message?: string) => {
                const passed = equal(actual, expected);
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
            },
            test: this.test,
        };
    }

    public test(description: string, runner: (context: ITestContext) => void) {
        ++this.counter;
        this.tests.push(new Promise((resolve) => {
            this.reporter.label(description);
            try {
                runner(this.context);
                resolve();
            } catch (error) {
                this.reporter.error(error);
                resolve();
            }
        }));
    }

    public async run() {
        this.reporter.start();
        await Promise.all(this.tests);
        this.reporter.end(this.passed, this.failed);
        return {passed: this.passed, failed: this.failed};
    }

}

export const test = (description: string, runner: (context: ITestContext) => void) => {
    Typtap.Default.test(description, runner);
};
