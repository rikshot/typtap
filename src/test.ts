import { ITyptapReporter, Tap } from 'tap';
import { equal } from './assert';

export type ITestFunction = (description: string, runner: (context: ITestContext) => void | Promise<void>) => void;

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
            assert: (actual: any, expected: any, message?: string) => {
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
            test: (description: string, runner: (context: ITestContext) => void | Promise<void>) => {
                this.test(description, runner);
            },
        };
    }

    public test(description: string, runner: (context: ITestContext) => void | Promise<void>) {
        if (this.filter && !this.filter.test(description)) {
            return;
        }
        ++this.counter;
        this.tests.push(async () => {
            this.reporter.label(description);
            try {
                await runner(this.context);
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

}

export const test: ITestFunction = (description: string, runner: (context: ITestContext) => void | Promise<void>) => {
    Typtap.Default.test(description, runner);
};
