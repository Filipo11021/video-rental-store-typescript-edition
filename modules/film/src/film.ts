import { literal, maxLength, minLength, object, String, union, brand, Date as DateType } from '@repo/schema-validator';
import { randomUUID } from 'node:crypto';
import { CreateFilmDto, FilmDto } from './film-dto.ts';
import { err, ok, Result } from '@repo/type-safe-errors';

export const filmId = brand('FilmId', String);
export const createFilmId = () => filmId.from(randomUUID().toString());

export type FilmId = typeof filmId.Type;
export const film = object({
  id: filmId,
  title: maxLength(255)(minLength(2)(String)),
  type: union(literal('old'), literal('new'), literal('regular')),
  createdAt: DateType,
});

export type Film = typeof film.Type;

type FilmError =
  | { type: 'InvalidFilm'; reason: typeof film.Errors.reason; value: unknown }
  | { type: 'InvalidFilmId'; value: unknown };

export function createFilm(data: CreateFilmDto): Result<Film, FilmError> {
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
    createdAt: new Date(),
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

export function filmToDto(film: Film): FilmDto {
  return {
    id: film.id,
    title: film.title,
    type: film.type,
  };
}
