import { ITyptapReporter } from './tap';
export interface ITestOptions {
    timeout?: number;
}
export declare type ITestRunner = (context: ITestContext) => void | Promise<void>;
export declare type ITestFunction = (description: string, runner: ITestRunner, options?: ITestOptions) => void;
export interface ITestContext {
    test: ITestFunction;
    pass: (message?: string) => void;
    fail: (message?: string) => void;
    equal: (actual: any, expected: any, message?: string) => void;
    notEqual: (actual: any, expected: any, message?: string) => void;
}
export interface IPendingTest {
    description: string;
    runner: () => Promise<void>;
}
export interface ITestResult {
    id: number;
    description: string;
    passed: boolean;
    error?: Error;
}
export interface ITestReport {
    passed: number;
    failed: number;
    errored: number;
}
export declare class Typtap {
    static Default: Typtap;
    single: boolean;
    /** @type {RegExp|undefined} */
    include?: RegExp;
    /** @type {RegExp|undefined} */
    exclude?: RegExp;
    private passed;
    private failed;
    private errored;
    private counter;
    private readonly reporter?;
    private readonly context;
    private readonly tests;
    constructor(reporter?: ITyptapReporter);
    /** @param {Object=} options */
    test(description: string, runner: ITestRunner, options?: ITestOptions): void;
    run(): Promise<ITestReport>;
    private report;
}
export declare const test: ITestFunction;
