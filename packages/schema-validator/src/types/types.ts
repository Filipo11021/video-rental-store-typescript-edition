export type IntentionalNever = never;

/**
 * A utility interface for creating branded types.
 *
 * Branded types enhance type safety by differentiating otherwise identical base
 * types, such as `number` or `string`, to enforce stricter type checks.
 *
 * Supports multiple brands, allowing types to act like flags.
 *
 * ### Example 1: Single Brand
 *
 * ```ts
 * // A branded type definition
 * type UserId = number & Brand<"UserId">;
 *
 * // A function that creates `UserId` values.
 * // Casting with `as UserId` is unsafe, so `createUserId` must be unit-tested.
 * const createUserId = (): UserId => {
 *   return 123 as UserId; // Unsafe casting
 * };
 *
 * const userId = createUserId();
 *
 * // A function that accepts only `UserId`.
 * const getUser = (id: UserId) => {
 *   // Implementation
 * };
 *
 * getUser(userId); // ✅ Valid
 * getUser(123); // ❌ TypeScript error
 * getUser("123"); // ❌ TypeScript error
 * ```
 *
 * ### Example 2: Multiple Brands
 *
 * ```ts
 * // Define branded types
 * type Min1 = string & Brand<"Min1">;
 * type Max100 = string & Brand<"Max100">;
 * type Min1Max100 = string & Brand<"Min1" | "Max100">;
 *
 * // Functions requiring specific brands
 * const requiresMin1 = (value: Min1): void => {};
 * const requiresMax100 = (value: Max100): void => {};
 *
 * // Values with single brands
 * const min1Value: Min1 = "hello" as Min1;
 * const max100Value: Max100 = "world" as Max100;
 *
 * // Value with multiple brands
 * const min1Max100Value: Min1Max100 = "typescript" as Min1Max100;
 *
 * // Valid cases
 * requiresMin1(min1Value); // ✅ Valid
 * requiresMax100(max100Value); // ✅ Valid
 * requiresMin1(min1Max100Value); // ✅ Valid: Min1Max100 satisfies Min1
 * requiresMax100(min1Max100Value); // ✅ Valid: Min1Max100 satisfies Max100
 * ```
 */
export interface Brand<B extends string> {
  readonly [__brand]: Readonly<Record<B, true>>;
}

declare const __brand: unique symbol;

/**
 * String | number | bigint | boolean | undefined | null
 *
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types
 */
export type Literal = string | number | bigint | boolean | undefined | null;

/**
 * Infers a broader type from a specific literal value type.
 *
 * Examples:
 *
 * - "foo" -> string
 * - 42 -> number
 * - 42n -> bigint
 * - True -> boolean
 */
export type WidenLiteral<T extends Literal> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T;

/**
 * Simplify an intersection type into a single mapped type.
 *
 * This utility forces TypeScript to "flatten" an intersection type into a
 * single object type so that tooltips and error messages are easier to read.
 *
 * ### Example
 *
 * ```ts
 * type A = { a: string } & { b: number };
 * // Without Simplify, TypeScript may display A as:
 * // { a: string } & { b: number }
 *
 * type B = Simplify<A>;
 * // B is equivalent to:
 * // { a: string; b: number }
 * ```
 */
export type Simplify<T> = { [K in keyof T]: T[K] };
