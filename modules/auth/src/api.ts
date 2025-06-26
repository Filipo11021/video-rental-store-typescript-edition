import { err, ok, Result } from '@repo/type-safe-errors';
import { createUser } from './user.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepositoryDep } from './user-repository.ts';
import { UserDto } from './dto.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export type AuthApi = Readonly<{
  login: (
    name: string,
    password: string,
  ) => Promise<Result<{ accessToken: string }, UnknownError | UserNotFoundError | InvalidPassword>>;
  authorize: (accessToken: string) => Promise<Result<UserDto, UnknownError>>;
  register: (name: string, password: string) => Promise<Result<UserDto, UnknownError | UserAlreadyExistsError>>;
}>;

export type AuthApiDeps = UserRepositoryDep;

export type AuthApiDep = Readonly<{
  authApi: AuthApi;
}>;

type UserNotFoundError = Readonly<{
  type: 'UserNotFoundError';
  message: string;
}>;

type UserAlreadyExistsError = Readonly<{
  type: 'UserAlreadyExistsError';
  message: string;
}>;

type InvalidPassword = Readonly<{
  type: 'InvalidPassword';
  message: string;
}>;

type UnknownError = Readonly<{
  type: 'UnknownError';
  message: string;
}>;

export function createAuthApi(deps: AuthApiDeps): AuthApi {
  const { userRepository } = deps;

  return {
    async register(name: string, password: string) {
      try {
        // Find user by name
        const userResult = await userRepository.findByName(name);
        if (userResult.ok) {
          return err({
            type: 'UserAlreadyExistsError',
            message: 'User already exists',
          });
        }

        // Create user
        const user = createUser({ name, password });
        if (!user.ok) {
          return err({
            type: 'UnknownError',
            message: user.error,
          });
        }

        // Save user
        const savedUserResult = await userRepository.save(user.value);
        if (!savedUserResult.ok) {
          return err({
            type: 'UnknownError',
            message: savedUserResult.error.message,
          });
        }

        return ok({
          id: savedUserResult.value.id,
          name: savedUserResult.value.name,
        });
      } catch (error) {
        console.error('Register error:', error);
        return err({
          type: 'UnknownError',
          message: 'Register failed',
        });
      }
    },
    async login(name: string, password: string) {
      try {
        // Find user by name
        const userResult = await userRepository.findByName(name);
        if (!userResult.ok) {
          return err({
            type: 'UnknownError',
            message: userResult.error.message,
          });
        }

        const user = userResult.value;

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return err({
            type: 'InvalidPassword',
            message: 'Invalid password',
          });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return ok({ accessToken: token });
      } catch (error) {
        console.error('Login error:', error);
        return err({
          type: 'UnknownError',
          message: 'Login failed',
        });
      }
    },

    async authorize(accessToken: string) {
      try {
        if (!accessToken) {
          return err({
            type: 'UnknownError',
            message: 'No token provided',
          });
        }

        // Remove 'Bearer ' prefix if present
        const token = accessToken.startsWith('Bearer ') ? accessToken.split(' ')[1] : accessToken;

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'string') {
          return err({
            type: 'UnknownError',
            message: 'Invalid token',
          });
        }

        // Get user from database
        const userResult = await userRepository.findById(decoded.userId);
        if (!userResult.ok) {
          return err({
            type: 'UnknownError',
            message: 'User not found',
          });
        }

        return ok({
          id: userResult.value.id,
          name: userResult.value.name,
        });
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return err({
            type: 'UnknownError',
            message: 'Token expired',
          });
        }
        if (error instanceof jwt.JsonWebTokenError) {
          return err({
            type: 'UnknownError',
            message: 'Invalid token',
          });
        }
        console.error('Authorization error:', error);
        return err({
          type: 'UnknownError',
          message: 'Authorization failed',
        });
      }
    },
  };
}
