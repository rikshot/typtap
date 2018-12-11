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
                if(!value) {
                    throw new Error(message);
                } 
            }
        };
    }

    public async test(description: string, runner: (context: ITestContext) => void) {
        if(this._counter === 0) {
            this._reporter.start();
        }
        ++this._counter;
        const result = await new Promise<ITestResult>(resolve => {
            const result: ITestResult = {
                id: this._counter,
                description,
                passed: true
            };
            try {
                runner(this._context);
                ++this._passed;
                resolve(result);
            } catch(error) {
                ++this._failed;
                result.passed = false;
                result.error = error;
                resolve(result);
            }
        });
        this._reporter.test(result);
        if(--this._counter === 0) {
            this._reporter.end(this._passed, this._failed);
        }
    }

}

export const test = (description: string, runner: (context: ITestContext) => void) => {
    Typtap.Default.test(description, runner);
}
