import { Result, tryAsync } from '@repo/type-safe-errors';
import { Film } from './film/film.ts';
import { FilmId } from './film/film-id.ts';

type FilmRepositorySaveError = Readonly<{
  type: 'FilmRepositorySaveError';
  message: string;
}>;

type FilmRepositoryNotFoundError = Readonly<{
  type: 'FilmRepositoryNotFoundError';
  message: string;
}>;

type UnknownError = Readonly<{
  type: 'UnknownError';
  message: string;
}>;

type FilmRepository = Readonly<{
  save: (film: Film) => Promise<Result<Film, FilmRepositorySaveError>>;
  findById: (id: FilmId) => Promise<Result<Film, FilmRepositoryNotFoundError>>;
  findAll: () => Promise<Result<Film[], UnknownError>>;
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
    async save(film: Film): Promise<Result<Film, FilmRepositorySaveError>> {
      return tryAsync(
        async () => {
          films.set(film.id, film);
          return film;
        },
        (error) => {
          return {
            type: 'FilmRepositorySaveError',
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
    async findAll() {
      return tryAsync(
        async () => {
          return Array.from(films.values());
        },
        (error) => {
          return {
            type: 'UnknownError',
            message: error instanceof Error ? error.message : 'Unknown error',
          } as const;
        },
      );
    },
  };
}
