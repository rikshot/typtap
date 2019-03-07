import { ITestResult } from './test';
export interface ITyptapReporter {
    start(): void;
    label(label: string): void;
    test(result: ITestResult): void;
    error(error: any): void;
    end(passed: number, failed: number): void;
    print(message: string, offset?: number): void;
}
export declare class Tap implements ITyptapReporter {
    private buffer;
    /** @param {number=} offset */
    print(message: string, offset?: number): string;
    start(): void;
    label(label: string): void;
    test(result: ITestResult): void;
    error(error: unknown): void;
    end(passed: number, failed: number): void;
    private flush;
    private indentStack;
}
