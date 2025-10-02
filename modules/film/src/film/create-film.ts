import { TimeDep } from '@repo/time';
import { CreateFilmDto } from '../film-dto.ts';
import { err, ok, Result } from '@repo/type-safe-errors';
import { film, Film } from './film.ts';
import { createFilmId } from './film-id.ts';

export type CreateFilmDep = TimeDep;

type FilmError =
  | { type: 'InvalidFilm'; reason: typeof film.Errors.reason; value: unknown }
  | { type: 'InvalidFilmId'; value: unknown };

export function createFilm(data: CreateFilmDto, deps: CreateFilmDep): Result<Film, FilmError> {
  const filmIdResult = createFilmId();
  if (!filmIdResult.ok)
    return err({
      type: 'InvalidFilmId',
      value: filmIdResult.error.value,
    });

  const filmResult = film.from({
    id: filmIdResult.value,
    title: data.title,
    type: data.type,
    createdAt: new Date(deps.time.now()),
  });

  if (!filmResult.ok) {
    return err({
      type: 'InvalidFilm',
      reason: filmResult.error.reason,
      value: filmResult.error.value,
    });
  }

  return ok(filmResult.value);
}
