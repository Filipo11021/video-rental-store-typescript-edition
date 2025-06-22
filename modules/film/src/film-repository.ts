import { Result, tryAsync } from '@repo/type-safe-errors';
import { Film, FilmId } from './film.ts';

type FilmRepositoryCreateError = Readonly<{
  type: 'FilmRepositoryCreateError';
  message: string;
}>;

type FilmRepositoryNotFoundError = Readonly<{
  type: 'FilmRepositoryNotFoundError';
  message: string;
}>;

type FilmRepository = Readonly<{
  create: (film: Film) => Promise<Result<Film, FilmRepositoryCreateError>>;
  findById: (id: FilmId) => Promise<Result<Film, FilmRepositoryNotFoundError>>;
}>;

export type FilmRepositoryDep = Readonly<{
  filmRepository: FilmRepository;
}>;

export function createFilmRepository(): FilmRepository {
  return createInMemoryFilmRepository();
}

export function createInMemoryFilmRepository(): FilmRepository {
  const films = new Map<string, Film>();

  return {
    async create(film: Film): Promise<Result<Film, FilmRepositoryCreateError>> {
      return tryAsync(
        async () => {
          films.set(film.id, film);
          return film;
        },
        (error) => {
          return {
            type: 'FilmRepositoryCreateError',
            message: error instanceof Error ? error.message : 'Unknown error',
          } as const;
        },
      );
    },
    async findById(id) {
      return tryAsync(
        async () => {
          const film = films.get(id);
          if (!film) {
            throw new Error('Film not found');
          }
          return film;
        },
        (error) => {
          return {
            type: 'FilmRepositoryNotFoundError',
            message: error instanceof Error ? error.message : 'Unknown error',
          } as const;
        },
      );
    },
  };
}
