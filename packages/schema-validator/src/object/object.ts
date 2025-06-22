/**
 * Checks if a value is a plain object (e.g., created with `{}` or `Object`).
 *
 * ### Example
 *
 * ```ts
 * isPlainObject({}); // true
 * isPlainObject(new Date()); // false
 * isPlainObject([]); // false
 * isPlainObject(null); // false
 * ```
 */
export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';
