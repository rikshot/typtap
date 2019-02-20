var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;

var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (arrA != arrB) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    var keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length)
      return false;

    for (i = length; i-- !== 0;)
      if (!hasProp.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return a!==a && b!==b;
};

class Tap {
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

class Typtap {
    constructor(reporter) {
        this.single = false;
        this.passed = 0;
        this.failed = 0;
        this.errored = 0;
        this.counter = 0;
        this.tests = [];
        this.reporter = reporter;
        this.context = {
            equal: (actual, expected, message) => this.report(fastDeepEqual(actual, expected), message),
            fail: (message) => this.report(false, message),
            notEqual: (actual, expected, message) => this.report(!fastDeepEqual(actual, expected), message),
            pass: (message) => this.report(true, message),
            test: (description, runner, options) => this.test(description, runner, options),
        };
    }
    test(description, runner, options) {
        if (this.single && this.tests.length > 0) {
            return;
        }
        if (this.include && !this.include.test(description)) {
            return;
        }
        if (this.exclude && this.exclude.test(description)) {
            return;
        }
        this.tests.push(async () => {
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
                }
                else {
                    await runner(this.context);
                }
            }
            catch (error) {
                ++this.errored;
                if (this.reporter) {
                    this.reporter.error(error);
                }
            }
        });
    }
    async run() {
        if (this.reporter) {
            this.reporter.start();
        }
        for (const runner of this.tests) {
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
    report(passed, message) {
        if (passed) {
            ++this.passed;
        }
        else {
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
Typtap.Default = new Typtap(new Tap());
const test = (description, runner, options) => {
    Typtap.Default.test(description, runner);
};

export { Typtap, test };

if(typeof window !== 'undefined') {
    window['Typtap'] = Typtap;
    window['Tap'] = Tap;
    window['test'] = test;
}
