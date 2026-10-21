type fx = (n: number) => number;
interface RootFinder {
    newton: (func: fx, precision?: number, maxIterations?: number, start?: number, minLimit?: number, maxLimit?: number) => number | undefined;
    bisect: (func: fx, precision?: number, maxIterations?: number, start?: number, minLimit?: number, maxLimit?: number) => number;
    findRoot: (func: fx, precision?: number, maxIterations?: number, start?: number, minLimit?: number, maxLimit?: number) => number;
}
export declare const RootFinder: RootFinder;
export {};
//# sourceMappingURL=root-finder.d.ts.map