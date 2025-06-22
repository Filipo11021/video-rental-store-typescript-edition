/**
 * 🚨
 *
 * This module provides assertion utilities to prevent invalid states from
 * propagating through the system by halting execution when a condition fails,
 * improving reliability and debuggability.
 *
 * **Warning**: Do not use this instead of Schema Validator. Assertions are intended
 * for conditions that are logically guaranteed but not statically known by
 * TypeScript, or for catching and signaling developer mistakes eagerly (e.g.,
 * invalid configuration).
 *
 */

/**
 * Ensures a condition is true, throwing an error with the provided message if
 * not.
 *
 * Prevents invalid states from propagating through the system by halting
 * execution when a condition fails, improving reliability and debuggability.
 *
 * **Warning**: Do not use this instead of Schema Validator. Assertions are intended
 * for conditions that are logically guaranteed but not statically known by
 * TypeScript, or for catching and signaling developer mistakes eagerly (e.g.,
 * invalid configuration).
 *
 * ### Example
 *
 * ```ts
 * assert(true, "true is not true"); // no-op
 * assert(false, "true is not true"); // throws Error
 *
 * const length = buffer.getLength();
 * // We know length is logically non-negative, but TypeScript doesn't
 * assert(
 *   NonNegativeInt.is(length),
 *   "buffer length should be non-negative",
 * );
 * ```
 */
export const assert: (condition: unknown, message: string) => asserts condition = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};
