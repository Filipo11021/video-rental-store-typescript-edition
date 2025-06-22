# 🧩 Validation, Parsing, and Transformation

## Intro

You probably know [Zod](https://zod.dev). Evolu has `Type`.

Evolu Type exists because no existing validation/parsing/transformation library fully met our needs:

- **Result-based error handling**: Leveraging `Result` instead of throwing exceptions.
- **Consistent constraints**: Enforcing `Brand` for all constraints.
- **Typed errors with decoupled formatters**: Avoiding coupling error messages with validators.
- **No user-land chaining**: Designed with ES pipe operator in mind.
- **Selective validation/transformation**: Skipping parent Type validations and transformations when TypeScript's type system can be relied upon.
- **Bidirectional transformations**: Supporting transformations in both directions.
- **Minimal and transparent code**: No runtime dependencies or hidden magic.

**Note**: A proper quickstart guide is on the way. In the meantime, each type includes its own usage example, and you can (and should) check the tests for practical demonstrations of the API. Or dang, just read the code. It's simple.

## About Evolu `Type`

Evolu `Type` is:

- A TypeScript type with a `Brand` whenever it's possible.
- A function to create a value of that type, which may fail.
- A function to transform value back to its original representation, which cannot fail.

Types are chainable. The chain starts with a Base Type that refines an unknown value into something and can continue with further refinements or transformations. For example, `NonEmptyTrimmedString100` chain looks like this:

`Unknown` → `String` → `TrimmedString` → `NonEmptyTrimmedString100`

For `NonEmptyTrimmedString100`, the parent Type is `TrimmedString`. For `TrimmedString`, the parent Type is `String`.

The parent of the `String` Type is the `String` Type itself. All Base Types `fromParent` functions are just a typed alias to `fromUnknown` to ensure that `fromParent` and `toParent` can be called on any Type.

## Parent Functions

Speaking of `fromParent` and `toParent`, those functions exist to bypass parent Types when we can rely on TypeScript types.

## Transformation Rules

`Type` transformations should be reversible. If you need an irreversible transformation, such as `TrimString` (trimming is not reversible as `untrim` can't know what has been trimmed), you can do that, but note in JSDoc that `to` will not restore the original representation. You can also use `assert`: `assert(false, "Untrim is not possible")`.

### Tip

If necessary, write `globalThis.String` instead of `String` to avoid naming clashes with Base Types.

## Design Decision

While the `from` function can fail, the `to` function cannot. This simplifies the model by ensuring that every valid input has a corresponding valid output, eliminating the risk of edge cases caused by irreversible operations.
