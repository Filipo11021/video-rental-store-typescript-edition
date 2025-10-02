import { Time, createTime } from './index.ts';
import { expect, test } from 'vitest';

/**
 * Creates a {@link Time} that returns a monotonically increasing number based on
 * a queueMicrotask.
 */
const createTestTime = (): Time => {
  let now = 0;
  return {
    now: () => {
      const current = now;
      queueMicrotask(() => {
        now++;
      });
      return current;
    },
  };
};

test('createTime returns current time', () => {
  const time = createTime();
  const now = Date.now();
  // Allow small difference due to execution time
  expect(time.now()).toBeGreaterThanOrEqual(now - 5);
  expect(time.now()).toBeLessThanOrEqual(now + 5);
});

test('createTestTime returns monotonically increasing values', async () => {
  const time = createTestTime();
  const first = time.now();

  // Need to await microtask queue to let the increment happen
  await new Promise((resolve) => {
    queueMicrotask(() => {
      resolve(undefined);
    });
  });

  const second = time.now();

  await new Promise((resolve) => {
    queueMicrotask(() => {
      resolve(undefined);
    });
  });

  const third = time.now();

  // First call should be 0
  expect(first).toBe(0);
  // Second call should be 1 after microtask queue has processed
  expect(second).toBe(1);
  // Third call should be 2 after another microtask queue cycle
  expect(third).toBe(2);
});
