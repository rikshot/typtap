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
    private _reporter: ITyptapReporter;
    private _context: ITestContext;

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

    public async test(description: string, runner: (context: ITestContext) => void) {
        if(this._counter === 0) {
            this._reporter.start();
        }
        ++this._counter;
        this._reporter.label(description);
        await new Promise((resolve, reject) => {
            try {
                runner(this._context);
                resolve();
            } catch(error) {
                console.dir(error);
                reject(error);
            }
        });
        if(--this._counter === 0) {
            this._reporter.end(this._passed, this._failed);
        }
    }

}

export const test = (description: string, runner: (context: ITestContext) => void) => {
    Typtap.Default.test(description, runner);
}
