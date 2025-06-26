import { describe, expect, test } from 'vitest';
import { createAuthApi } from './api.ts';
import { createUserRepository } from './user-repository.ts';

describe('Auth API', () => {
  test('should register and login a user', async () => {
    const authApi = createAuthApi({
      userRepository: createUserRepository(),
    });
    const registerResult = await authApi.register('Filip', 'password');
    if (!registerResult.ok) throw new Error(registerResult.error.message);

    const loginResult = await authApi.login('Filip', 'password');
    if (!loginResult.ok) throw new Error(loginResult.error.message);

    const authorizeResult = await authApi.authorize(loginResult.value.accessToken);
    if (!authorizeResult.ok) throw new Error(authorizeResult.error.message);

    expect(authorizeResult.value.name).toBe('Filip');
  });
});
