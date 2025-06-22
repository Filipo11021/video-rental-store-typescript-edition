import { expect, test } from 'vitest';
import { assert } from './assert.ts';

test('assert', () => {
  // Should not throw when the condition is true
  assert(true, 'Should not throw');

  // Should throw when the condition is false
  expect(() => {
    assert(false, 'Condition failed');
  }).toThrowError('Condition failed');
});
