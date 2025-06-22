import { test, expect } from 'vitest';
import { identity } from './function.ts';

test('identity', () => {
  expect(identity(1)).toBe(1); // 1
  expect(identity('hello')).toBe('hello'); // "hello"
  expect(identity(true)).toBe(true); // true
  expect(identity(false)).toBe(false); // false
  expect(identity(null)).toBe(null); // null
  expect(identity(undefined)).toBe(undefined); // undefined
  expect(identity({ a: 1 })).toEqual({ a: 1 }); // { a: 1 }
});
