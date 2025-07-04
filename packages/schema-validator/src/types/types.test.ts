import { expectTypeOf, test } from 'vitest';
import { Brand, WidenLiteral } from './types.ts';

test('Brand', () => {
  type UserId = string & Brand<'UserId'>;
  type ProductId = number & Brand<'ProductId'>;

  const validUserId: UserId = 'user123' as UserId;
  expectTypeOf(validUserId).toEqualTypeOf<string & Brand<'UserId'>>();

  const validProductId: ProductId = 42 as ProductId;
  expectTypeOf(validProductId).toEqualTypeOf<number & Brand<'ProductId'>>();

  // Invalid assignment (string to ProductId)
  // @ts-expect-error - Should not allow a string to be assigned to ProductId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const invalidProductId: ProductId = 'not-a-number';

  // Invalid assignment (unbranded string to UserId)
  // @ts-expect-error - Should not allow unbranded string to be assigned to UserId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const invalidUserId: UserId = 'user123';

  // Invalid assignment (mixing different brands)
  // @ts-expect-error - Should not allow assigning a ProductId to a UserId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mismatchedId: UserId = validProductId;
});

test('Brand - multiple brands', () => {
  type Min1 = string & Brand<'Min1'>;
  type Max100 = string & Brand<'Max100'>;
  type Min1Max100 = string & Brand<'Min1' | 'Max100'>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const requiresMin1 = (_value: Min1) => undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const requiresMax100 = (_value: Max100) => undefined;

  const min1Value: Min1 = 'hello' as Min1;
  const max100Value: Max100 = 'world' as Max100;
  const min1Max100Value: Min1Max100 = 'typescript' as Min1Max100;

  requiresMin1(min1Value);
  requiresMax100(max100Value);
  requiresMin1(min1Max100Value);
  requiresMax100(min1Max100Value);

  // @ts-expect-error: brands works
  requiresMin1('hello');
  // @ts-expect-error: brands works
  requiresMin1(max100Value);
  // @ts-expect-error: brands works
  requiresMax100('world');
  // @ts-expect-error: brands works
  requiresMax100(min1Value);
});

test('WidenLiteral', () => {
  expectTypeOf<WidenLiteral<'foo'>>().toEqualTypeOf<string>();
  expectTypeOf<WidenLiteral<42>>().toEqualTypeOf<number>();
  expectTypeOf<WidenLiteral<42n>>().toEqualTypeOf<bigint>();
  expectTypeOf<WidenLiteral<true>>().toEqualTypeOf<boolean>();
  expectTypeOf<WidenLiteral<undefined>>().toEqualTypeOf<undefined>();
  expectTypeOf<WidenLiteral<null>>().toEqualTypeOf<null>();
});
