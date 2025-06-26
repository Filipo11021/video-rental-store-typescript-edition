import { err, ok, Result } from '@repo/type-safe-errors';
import { User } from './user.ts';

type UserRepositorySaveError = Readonly<{
  type: 'UserRepositorySaveError';
  message: string;
}>;

type UserRepositoryNotFoundError = Readonly<{
  type: 'UserRepositoryNotFoundError';
  message: string;
}>;

type UserRepository = Readonly<{
  save: (user: User) => Promise<Result<User, UserRepositorySaveError>>;
  findById: (id: string) => Promise<Result<User, UserRepositoryNotFoundError>>;
  findByName: (name: string) => Promise<Result<User, UserRepositoryNotFoundError>>;
}>;

export type UserRepositoryDep = Readonly<{
  userRepository: UserRepository;
}>;

export function createUserRepository(): UserRepository {
  return createInMemoryUserRepository();
}

export function createInMemoryUserRepository(): UserRepository {
  const users: User[] = [];

  return {
    async save(user: User) {
      const existingUserIndex = users.findIndex((u) => u.id === user.id);
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }
      return ok(user);
    },
    async findById(id: string) {
      const user = users.find((u) => u.id === id);
      if (!user) {
        return err({
          type: 'UserRepositoryNotFoundError',
          message: `User with id ${id} not found`,
        });
      }
      return ok(user);
    },
    async findByName(name: string) {
      const user = users.find((u) => u.name === name);
      if (!user) {
        return err({
          type: 'UserRepositoryNotFoundError',
          message: `User with name ${name} not found`,
        });
      }
      return ok(user);
    },
  };
}
