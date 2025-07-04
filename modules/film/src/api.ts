import type { UserDto } from '@repo/auth/dto';
import { CreateFilmDto, FilmDto } from './film-dto.ts';
import { FilmRepositoryDep } from './film-repository.ts';
import { createFilm, filmId, filmToDto } from './film.ts';
import { err, ok, Result } from '@repo/type-safe-errors';

type Protected = Readonly<{
  currentUser: UserDto;
}>;

export type FilmApi = Readonly<{
  createFilm: (arg: { data: CreateFilmDto } & Protected) => Promise<Result<FilmDto, FilmApiCreateFilmError>>;
  getFilm: (id: string) => Promise<Result<FilmDto, FilmApiGetFilmError>>;
  getFilms: () => Promise<Result<FilmDto[], FilmApiGetFilmsError>>;
}>;

export type FilmApiDep = Readonly<{
  filmApi: FilmApi;
}>;

type FilmApiCreateFilmError = Readonly<{
  type: 'FilmApiCreateFilmError';
  message: string;
}>;

type FilmApiGetFilmError = Readonly<{
  type: 'FilmApiGetFilmError';
  message: string;
}>;

type FilmApiGetFilmsError = Readonly<{
  type: 'FilmApiGetFilmsError';
  message: string;
}>;

export function createFilmApi(deps: FilmRepositoryDep): FilmApi {
  return {
    async createFilm({ data }) {
      const filmResult = createFilm(data);

      if (!filmResult.ok)
        return err({
          type: 'FilmApiCreateFilmError',
          message: filmResult.error.type,
        });

      const savedFilmResult = await deps.filmRepository.save(filmResult.value);
      if (!savedFilmResult.ok)
        return err({
          type: 'FilmApiCreateFilmError',
          message: savedFilmResult.error.message,
        });

      return ok(filmToDto(savedFilmResult.value));
    },
    async getFilm(id) {
      const filmIdResult = filmId.from(id);
      if (!filmIdResult.ok)
        return err({
          type: 'FilmApiGetFilmError',
          message: filmIdResult.error.type,
        });

      const filmResult = await deps.filmRepository.findById(filmIdResult.value);
      if (!filmResult.ok)
        return err({
          type: 'FilmApiGetFilmError',
          message: filmResult.error.message,
        });

      return ok(filmToDto(filmResult.value));
    },
    async getFilms() {
      const filmsResult = await deps.filmRepository.findAll();
      if (!filmsResult.ok)
        return err({
          type: 'FilmApiGetFilmsError',
          message: filmsResult.error.message,
        });

      return ok(filmsResult.value.map(filmToDto));
    },
  };
}
