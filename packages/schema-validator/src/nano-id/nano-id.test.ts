import { expect, test } from 'vitest';
import { createNanoIdLib } from './nano-id.ts';

test('createNanoIdLib', () => {
  const nanoIdLib = createNanoIdLib();
  expect(nanoIdLib.nanoid()).toBeDefined();
});

test('generate a nano id', () => {
  const nanoIdLib = createNanoIdLib();
  const nanoId = nanoIdLib.nanoid(21);
  expect(nanoId).toBeDefined();
  expect(nanoId.length).toBe(21);
});
