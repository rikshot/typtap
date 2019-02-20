export class Tap {
    constructor() {
        this.buffer = [];
    }
    /** @param {number=} offset */
    print(message, offset) {
        message = typeof offset === 'number' ? (new Array(offset + 1)).join(' ') + message : message;
        this.buffer.push(message);
        return message;
    }
    start() {
        this.print('TAP version 13');
    }
    label(label) {
        this.print('# ' + label);
    }
    test(result) {
        this.print(`${result.passed ? 'ok' : 'not ok'} ${result.id} ${result.description}`);
    }
    error(error) {
        this.print('---', 2);
        if (error instanceof Error) {
            this.print(`name: ${error.name}`, 4);
            this.print(`message: ${error.message}`, 4);
            this.print(`stack: |-\n${this.indentStack(error.stack, 6)}`, 4);
        }
        else {
            this.print(`error: ${JSON.stringify(error)}`, 4);
        }
        this.print('...', 2);
    }
    end(passed, failed) {
        const count = passed + failed;
        this.print('1..' + count);
        this.flush();
    }
    flush() {
        console.log(this.buffer.join('\n'));
        this.buffer = [];
    }
    indentStack(stack, offset) {
        stack = stack ? stack : '';
        return stack.split('\n').map((line) => (new Array(offset + 1)).join(' ') + line).join('\n');
    }
}
//# sourceMappingURL=tap.js.map