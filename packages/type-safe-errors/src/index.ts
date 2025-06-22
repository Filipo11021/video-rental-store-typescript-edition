/**
 * A `Result` can be either {@link Ok} (success) or {@link Err} (error).
 *
 * Use {@link ok} to create a successful result and {@link err} to create an error
 * result.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/** A successful {@link Result}. */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * An error {@link Result}.
 *
 * The `error` property can be any type that describes the error. For normal
 * business logic, use a plain object. This allows us to structure errors with
 * custom fields (e.g., `{ type: "MyError", code: 123 }`). Messages for users
 * belong to translations, not to error objects.
 *
 * If you need a stacktrace for debugging, use an `Error` instance or a custom
 * error class to include additional metadata.
 *
 * ### Examples
 *
 * #### Business Logic Error (Plain Object, Recommended)
 *
 * ```ts
 * const failure = err({
 *   type: "ParseJsonError",
 *   code: 1001,
 *   input: "foo",
 * });
 * ```
 *
 * #### Debugging with Stack Trace (Error Instance)
 *
 * ```ts
 * const failure = err(new Error("Something went wrong"));
 * ```
 *
 * #### Custom Error Class
 *
 * ```ts
 * class MyCustomError extends Error {
 *   constructor(
 *     public code: number,
 *     public input: string,
 *   ) {
 *     super(`Error ${code} on input: ${input}`);
 *     this.name = "MyCustomError";
 *   }
 * }
 * const failure = err(new MyCustomError(404, "bad-input"));
 * ```
 */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

/**
 * Creates an {@link Ok} result.
 *
 * - `ok()` creates an `Ok<void>` for operations that succeed without producing a
 *   value.
 * - `ok(value)` creates an `Ok<T>` containing the specified value.
 *
 * ### Example
 *
 * ```ts
 * const noValue = ok();
 * console.log(noValue); // { ok: true, value: undefined }
 *
 * const success = ok(42);
 * console.log(success); // { ok: true, value: 42 }
 * ```
 */
export function ok(): Ok<void>;
/** Creates an {@link Ok} result with a specified value. */
export function ok<T>(value: T): Ok<T>;
export function ok<T>(value = undefined): Ok<T> {
  return { ok: true, value: value as T };
}

/**
 * Creates an {@link Err} result.
 *
 * ### Example
 *
 * ```ts
 * const failure = err("Something went wrong");
 * console.log(failure); // { ok: false, error: "Something went wrong" }
 * ```
 */
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

/**
 * Extracts the value from a {@link Result} if it is an `Ok`, or throws an error
 * if it is an `Err`.
 *
 * **Intended usage:**
 *
 * - For critical code paths (e.g., app startup, config values) where failure
 *   should crash the app.
 * - Not recommended for general error handling in application logic—prefer
 *   explicit checks.
 *
 * ### Example
 *
 * ```ts
 * // At app startup, crash if config is invalid:
 * const config = getOrThrow(loadConfig());
 * // Safe to use config here
 * ```
 */
export const getOrThrow = <T, E>(result: Result<T, E>): T => {
  if (result.ok) {
    return result.value;
  } else {
    throw new Error(`Result error: ${JSON.stringify(result.error)}`);
  }
};

/**
 * Wraps synchronous functions that may throw exceptions, returning a
 * {@link Result}.
 *
 * The `trySync` function is designed to handle synchronous code safely by
 * wrapping the execution in a try-catch block. If the function succeeds, it
 * returns an `Ok` result. If an exception is thrown, it maps the error to a
 * custom type and returns an `Err` result.
 *
 * ### Example
 *
 * ```ts
 * interface ParseJsonError {
 *   readonly type: "ParseJsonError";
 *   readonly message: string;
 * }
 *
 * const parseJson = (value: string): Result<unknown, ParseJsonError> =>
 *   trySync(
 *     () => JSON.parse(value) as unknown,
 *     (error) => ({ type: "ParseJsonError", message: String(error) }),
 *   );
 * ```
 */
export const trySync = <T, E>(fn: () => T, mapError: (error: unknown) => E): Result<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    return err(mapError(error));
  }
};

/**
 * Wraps async functions or any operation returning a promise, returning a
 * {@link Result}.
 *
 * The `tryAsync` function provides a way to handle asynchronous code safely by
 * catching any rejected promises and mapping errors to a custom type. If the
 * promise resolves, it returns an `Ok` result. If the promise rejects, it maps
 * the error and returns an `Err` result.
 *
 * ### Example
 *
 * ```ts
 * interface FetchError {
 *   readonly type: "FetchError";
 *   readonly message: string;
 * }
 *
 * const tryFetch = async (
 *   url: string,
 * ): Promise<Result<unknown, FetchError>> =>
 *   tryAsync(
 *     async () => {
 *       const response = await fetch(url);
 *       if (!response.ok) {
 *         throw new Error(`Request failed with status ${response.status}`);
 *       }
 *       return response.json();
 *     },
 *     (error) => ({
 *       type: "FetchError",
 *       message: String(error),
 *     }),
 *   );
 *
 * const result = await tryFetch(
 *   "https://jsonplaceholder.typicode.com/posts/1",
 * );
 * if (result.ok) {
 *   console.log("Data:", result.value);
 * } else {
 *   console.error("Error:", result.error);
 * }
 * ```
 */
export const tryAsync = async <T, E>(
  promiseFn: () => Promise<T>,
  mapError: (error: unknown) => E,
): Promise<Result<T, E>> =>
  promiseFn().then(
    (value) => ok(value),
    (error: unknown) => err(mapError(error)),
  );
