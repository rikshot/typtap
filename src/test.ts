import { ITyptapReporter, Tap } from 'tap';

export interface ITestFunction {
    (description: string, runner: (context: ITestContext) => void): void;
}

export interface ITestContext {
    test: ITestFunction;
    assert: (value: boolean, message?: string) => void;
}

export interface ITestResult {
    id: number;
    description: string;
    passed: boolean;
    error?: Error;
}

export class Typtap {

    public static Default = new Typtap(new Tap());

    private _passed = 0;
    private _failed = 0;
    private _counter = 0;

    private readonly _reporter: ITyptapReporter;
    private readonly _context: ITestContext;

    private readonly _tests: Promise<void>[] = [];

    private constructor(reporter: ITyptapReporter) {
        this._reporter = reporter;
        this._context = {
            test: this.test,
            assert: (value: boolean, message?: string) => {
                if(value) {
                    ++this._passed;
                } else {
                    ++this._failed;
                }
                this._reporter.test({
                    id: this._counter,
                    description: message ? message : '',
                    passed: value,
                });
            }
        };
    }

    public test(description: string, runner: (context: ITestContext) => void) {
        ++this._counter;
        this._tests.push(new Promise(resolve => {
            this._reporter.label(description);
            try {
                runner(this._context);
                resolve();
            } catch(error) {
                this._reporter.error(error);
                resolve();
            }
        }));
    }

    public async run() {
        this._reporter.start();
        await Promise.all(this._tests);
        this._reporter.end(this._passed, this._failed);
        return { passed: this._passed, failed: this._failed };
    }

}

export const test = (description: string, runner: (context: ITestContext) => void) => {
    Typtap.Default.test(description, runner);
}
