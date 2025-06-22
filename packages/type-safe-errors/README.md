# 🛡️ Type-safe errors

## Intro

The problem with throwing an exception in JavaScript is that the caught error is always of an unknown type. The unknown type is a problem because we can't be sure all errors have been handled because the TypeScript compiler can't help us.

Some other languages like Rust 🦀 or Haskell 📚 use a type-safe approach to error handling, where errors are explicitly represented as part of the return type, such as Result or Either, allowing the developer to handle all errors safely. ✅

✨ We uses {@link Result}, and it looks like this:

```typescript
type Result<T, E> = Ok<T> | Err<E>;

interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const err = <E>(error: E): Err<E> => ({ ok: false, error });
```

Now let's look at how `Result` can be used for safe JSON parsing:

```typescript
interface ParseJsonError {
  readonly type: 'ParseJsonError';
  readonly message: string;
}

const parseJson = (value: string): Result<unknown, ParseJsonError> => {
  try {
    return ok(JSON.parse(value));
  } catch (error) {
    return err({ type: 'ParseJsonError', message: String(error) });
  }
};

// Result<unknown, ParseJsonError>
const json = parseJson('{"key": "value"}');

// Fail fast to handle errors early.
if (!json.ok) return json; // Err<ParseJsonError>

// Now, we have access to the json.value.
expectTypeOf(json.value).toBeUnknown();
```

Note how we didn't have to use the try/catch, just `if (!json.ok)`, and how the error isn't unknown but has a type.

But we had to use `try/catch` in the `parseJson` function. For such a case, wrapping unsafe code, Evolu provides the {@link trySync} helper:

```typescript
const parseJson = (value: string): Result<unknown, ParseJsonError> =>
  trySync(
    () => JSON.parse(value) as unknown,
    (error) => ({ type: 'ParseJsonError', message: String(error) }),
  );
```

✨ {@link trySync} helper makes unsafe (can throw) synchronous code safe; for unsafe asynchronous code, use {@link tryAsync}.

Let's summarize it:

- For synchronous safe code, use `ok` and `err`.
- For unsafe code, use `trySync` or `tryAsync`.
- For asynchronous safe code, use `Promise` with {@link Result}.

Asynchronous safe (because of a Promise using Result) code is straightforward:

```typescript
const fetchUser = async (userId: string): Promise<Result<User, FetchUserError>> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId === '1') {
        resolve(ok({ id: '1', name: 'Alice' }));
      } else {
        resolve(err({ type: 'FetchUserError', reason: 'user not found' }));
      }
    }, 1000);
  });
};
```

## Examples

### Sequential Operations with Short-Circuiting

When performing a sequence of operations where any failure should stop further processing, use the `Result` type with early returns.

Here's an example of a database reset operation that drops tables, restores a schema, and initializes the database, stopping on the first error:

```typescript
const resetResult = deps.sqlite.transaction(() => {
  const dropAllTablesResult = dropAllTables(deps);
  if (!dropAllTablesResult.ok) return dropAllTablesResult;

  if (message.restore) {
    const dbSchema = getDbSchema(deps)();
    if (!dbSchema.ok) return dbSchema;

    const ensureDbSchemaResult = ensureDbSchema(deps)(message.restore.dbSchema, dbSchema.value);
    if (!ensureDbSchemaResult.ok) return ensureDbSchemaResult;

    const initializeDbResult = initializeDb(deps)(message.restore.mnemonic);
    if (!initializeDbResult.ok) return initializeDbResult;
  }
  return ok();
});

if (!resetResult.ok) {
  deps.postMessage({ type: 'onError', error: resetResult.error });
  return;
}
```

In this pattern:

- Each operation returns a `Result` (e.g., `Result<void, E>` or `Result<T, E>`).
- After each operation, check `if (!result.ok)` and return the `Err` to short-circuit.
- If all operations succeed, return `ok()` (or another value if needed).
- Outside the transaction, handle the final `Result` to report success or failure.

This approach ensures type-safe error handling, avoids nested try/catch blocks, and clearly communicates the control flow.

### A function with two different errors:

```typescript
const example = (value: string): Result<number, FooError | BarError> => {
  const foo = getFoo(value);
  if (!foo.ok) return foo;

  const bar = barize(foo.value);
  if (!bar.ok) return bar;

  return ok(barToNumber(bar.value));
};
```

## FAQ

### What if my function doesn't return a value on success?

If your function performs an operation but doesn't need to return a value on success, you can use `Result<void, E>`. Using `Result<void, E>` is clearer than using `Result<true, E>` or `Result<null, E>` because it communicates that the function doesn't produce a value but can produce errors.

### How do I short-circuit processing of an array on the first error?

If you want to stop processing as soon as an error occurs (short-circuit), you should produce and check each `Result` inside a loop:

```typescript
for (const query of [sql`drop table evolu_owner;`, sql`drop table evolu_message;`]) {
  const result = deps.sqlite.exec(query);
  if (!result.ok) return result;
}
// All queries succeeded
```

### How do I handle an array of operations and short-circuit on the first error?

If you have an array of operations (not results), you should make them _lazy_—that is, represent each operation as a function (see `LazyValue` in `Function.ts`). This way, you only execute each operation as needed, and can stop on the first error:

```typescript
import type { LazyValue } from './Function';

const operations: LazyValue<Result<void, MyError>>[] = [() => doSomething(), () => doSomethingElse()];

for (const op of operations) {
  const result = op();
  if (!result.ok) return result;
}
// All operations succeeded
```

If you already have an array of `Result`s, the processing has already happened, so you can't short-circuit. In that case, you can check for the first error:

```typescript
const firstError = results.find((r) => !r.ok);
if (firstError) return firstError;
// All results are Ok
```

### Why we doesn't provide "handy helpers"?

We intentionally favors imperative patterns (like the `for...of` loop above) over monadic helpers. Imperative code is generally more readable, easier to debug, and more familiar to most JavaScript and TypeScript developers. While monads and functional helpers can be powerful, they often obscure control flow and make debugging harder. This approach keeps error handling explicit and straightforward.
