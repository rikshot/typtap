export class Tap {
    constructor() {
        this._buffer = [];
    }
    /** @param {number=} offset */
    print(message, offset) {
        message = typeof offset === 'number' ? (new Array(offset + 1)).join(' ') + message : message;
        this._buffer.push(message);
        return message;
    }
    start() {
        this.print('TAP version 13');
    }
    test(result) {
        this.print('# ' + result.description);
        this.print(`${result.passed ? 'ok' : 'not ok'} ${result.id} ${result.description}`);
    }
    end(passed, failed) {
        const count = passed + failed;
        this.print('1..' + count);
        this.flush();
    }
    flush() {
        console.log(this._buffer.join('\n'));
        this._buffer = [];
    }
}
