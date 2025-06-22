import { expect, test } from 'vitest';
import { safelyStringifyUnknownValue } from './string.ts';

test('safelyStringifyUnknownValue', () => {
  expect(safelyStringifyUnknownValue(null)).toBe('null');
  expect(safelyStringifyUnknownValue(undefined)).toBe('undefined');
  expect(safelyStringifyUnknownValue('string')).toBe('"string"');
  expect(safelyStringifyUnknownValue({})).toBe('{}');
  expect(safelyStringifyUnknownValue([])).toBe('[]');
});
