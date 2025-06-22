import { expect, test } from 'vitest';
import { isPlainObject } from './object.ts';

test('isPlainObject', () => {
  expect(isPlainObject({})).toBe(true);
  expect(isPlainObject(new Date())).toBe(false);
  expect(isPlainObject([])).toBe(false);
  expect(isPlainObject(null)).toBe(false);
});
