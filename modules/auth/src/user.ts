import { brand, object, String } from '@repo/schema-validator';
import { err, ok, Result } from '@repo/type-safe-errors';
import { hashSync } from 'bcryptjs';
import { randomUUID } from 'node:crypto';

const userId = brand('UserId', String);
const createUserId = () => userId.from(randomUUID().toString());

export const user = object({
  id: userId,
  name: String,
  password: String,
});

export type User = typeof user.Type;

export function createUser(data: { name: string; password: string }): Result<User, string> {
  const userIdResult = createUserId();
  if (!userIdResult.ok) return err(userIdResult.error.type);

  const userResult = user.from({
    id: userIdResult.value,
    name: data.name,
    password: hashSync(data.password, 10),
  });

  if (!userResult.ok) return err(userResult.error.type);

  return ok(userResult.value);
}
