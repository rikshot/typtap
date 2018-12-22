import { ITestResult } from 'test';

export interface ITyptapReporter {
    start(): void;
    label(label: string): void;
    test(result: ITestResult): void;
    end(passed: number, failed: number): void;
    print(message: string, offset?: number): void;
}

export class Tap implements ITyptapReporter {

    private _buffer: string[] = [];

    /** @param {number=} offset */
    public print(message: string, offset?: number) {
        message = typeof offset === 'number' ? (new Array(offset + 1)).join(' ') + message : message;
        this._buffer.push(message);
        return message;
    }

    public start() {
        this.print('TAP version 13');
    }

    public label(label: string) {
        this.print('# ' + label);
    }

    public test(result: ITestResult) {
        this.print(`${result.passed ? 'ok' : 'not ok'} ${result.id} ${result.description}`);
    }

    public end(passed: number, failed: number) {
        const count = passed + failed;
        this.print('1..' + count);
        this.flush();
    }

    private flush() {
        console.log(this._buffer.join('\n'));
        this._buffer = [];
    }

}
