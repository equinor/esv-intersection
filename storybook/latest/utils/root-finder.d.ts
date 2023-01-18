declare type fx = (n: number) => number;
export declare class RootFinder {
    /**
     * Find root using newthons method
     * @param {Number} func f(x)
     * @param {Number} precision Accuracy of result
     * @param {Number} maxIterations Max number of iterations to use
     * @param {Number} start Starting position
     * @param {Number} minLimit Min limit of result
     * @param {Number} maxLimit Max limit of result
     */
    static newton(func: fx, precision?: number, maxIterations?: number, start?: number, minLimit?: number, maxLimit?: number): number;
    /**
     * Find root using bisect method
     * @param {Number} func f(x)
     * @param {Number} precision Accuracy of result
     * @param {Number} maxIterations Max number of iterations to use
     * @param {Number} start Starting position
     * @param {Number} minLimit Min limit of result
     * @param {Number} maxLimit Max limit of result
     */
    static bisect(func: fx, precision?: number, maxIterations?: number, start?: number, minLimit?: number, maxLimit?: number): number;
    /**
     * Find root by trying available methods
     * @param {Number} func f(x)
     * @param {Number} precision Accuracy of result
     * @param {Number} maxIterations Max number of iterations to use
     * @param {Number} start Starting position
     * @param {Number} minLimit Min limit of result
     * @param {Number} maxLimit Max limit of result
     */
    static findRoot(func: fx, precision?: number, maxIterations?: number, start?: number, minLimit?: number, maxLimit?: number): number;
}
export {};
