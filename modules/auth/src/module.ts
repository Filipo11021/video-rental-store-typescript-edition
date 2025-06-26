import { AuthApi, createAuthApi } from './api.ts';
import { createUserRepository } from './user-repository.ts';
import { ok, Result } from '@repo/type-safe-errors';

type AuthModule = Readonly<{
  api: AuthApi;
}>;

export function createAuthModule(): Result<AuthModule, string> {
  const userRepository = createUserRepository();
  const authApi = createAuthApi({ userRepository });

  return ok({ api: authApi });
}
