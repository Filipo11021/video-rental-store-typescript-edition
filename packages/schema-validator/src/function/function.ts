/**
 * Returns the value it receives, unchanged.
 *
 * Why would you use this?
 * - Some APIs or libraries require you to provide a function, even if you want to keep the value as-is.
 * - Instead of writing `(value) => value` every time, you can use `identity` for clarity and to avoid repetition.
 * - This makes it clear that you intentionally want "no change".
 *
 * Example:
 *   // A function that takes a transform function
 *   function process<T>(value: T, transform: (v: T) => T) {
 *     return transform(value);
 *   }
 *   // If you want no change:
 *   process(123, identity); // returns 123
 *
 *   // In React:
 *   setState(identity); // leaves state unchanged, but triggers a re-render
 */
export const identity = <A>(a: A): A => a;

/**
 * A function that delays computation and returns a value of type T.
 *
 * Useful for:
 *
 * - Lazy evaluation
 * - Returning constant values
 * - Providing default or placeholder behaviors
 *
 * ### Example
 *
 * ```ts
 * const getRandomNumber: LazyValue<number> = () => Math.random();
 * const randomValue = getRandomNumber();
 * ```
 */
export type LazyValue<T> = () => T;
export const constVoid: LazyValue<void> = () => undefined;
