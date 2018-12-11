class Tap {
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

class Typtap {
    constructor(reporter) {
        this._passed = 0;
        this._failed = 0;
        this._counter = 0;
        this._reporter = reporter;
        this._context = {
            test: this.test,
            assert: (value, message) => {
                if (!value) {
                    throw new Error(message);
                }
            }
        };
    }
    async test(description, runner) {
        if (this._counter === 0) {
            this._reporter.start();
        }
        ++this._counter;
        const result = await new Promise(resolve => {
            const result = {
                id: this._counter,
                description,
                passed: true
            };
            try {
                runner(this._context);
                ++this._passed;
                resolve(result);
            }
            catch (error) {
                ++this._failed;
                result.passed = false;
                result.error = error;
                resolve(result);
            }
        });
        this._reporter.test(result);
        if (--this._counter === 0) {
            this._reporter.end(this._passed, this._failed);
        }
    }
}
Typtap.Default = new Typtap(new Tap());
const test = (description, runner) => {
    Typtap.Default.test(description, runner);
};

export { Typtap, test };
