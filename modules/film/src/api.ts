import type { UserDto } from '@repo/auth/dto';
import { CreateFilmDto, FilmDto, filmToDto } from './film-dto.ts';
import { FilmRepositoryDep } from './film-repository.ts';
import { createFilm, filmId } from './film.ts';
import { err, ok, Result } from '@repo/type-safe-errors';

type FilmApiDeps = FilmRepositoryDep;

export type FilmApi = Readonly<{
  createFilm: (film: CreateFilmDto, user: UserDto) => Promise<Result<FilmDto, string>>;
  getFilm: (id: string) => Promise<Result<FilmDto, string>>;
}>;
export type FilmApiDep = Readonly<{
  filmApi: FilmApi;
}>;

export function createFilmApi(deps: FilmApiDeps): FilmApi {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createFilm(data: CreateFilmDto, _user: UserDto) {
      const filmResult = createFilm(data);

      if (!filmResult.ok) return err(filmResult.error.type);

      const savedFilmResult = await deps.filmRepository.save(filmResult.value);
      if (!savedFilmResult.ok) return err(savedFilmResult.error.message);

      return ok(filmToDto(savedFilmResult.value));
    },
    getFilm: async (id: string): Promise<Result<FilmDto, string>> => {
      const filmIdResult = filmId.from(id);
      if (!filmIdResult.ok) return err(filmIdResult.error.type);

      const filmResult = await deps.filmRepository.findById(filmIdResult.value);
      if (!filmResult.ok) return err(filmResult.error.message);

      return ok(filmToDto(filmResult.value));
    },
  };
}
