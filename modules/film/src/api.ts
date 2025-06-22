import { CreateFilmDto, FilmDto, filmToDto } from './film-dto.ts';
import { FilmRepositoryDep } from './film-repository.ts';
import { createFilm, filmId } from './film.ts';
import { err, ok, Result } from '@repo/type-safe-errors';

type FilmApiDeps = FilmRepositoryDep;

export type FilmApi = Readonly<{
  createFilm: (film: CreateFilmDto) => Promise<Result<FilmDto, string>>;
  getFilm: (id: string) => Promise<Result<FilmDto, string>>;
}>;
export type FilmApiDep = Readonly<{
  filmApi: FilmApi;
}>;

export function createFilmApi(deps: FilmApiDeps): FilmApi {
  return {
    async createFilm(data: CreateFilmDto) {
      const filmResult = createFilm(data);

      if (!filmResult.ok) return err(filmResult.error.type);

      const createFilmResult = await deps.filmRepository.create(filmResult.value);
      if (!createFilmResult.ok) return err(createFilmResult.error.message);

      return ok(filmToDto(filmResult.value));
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
