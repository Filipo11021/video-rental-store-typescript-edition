import { literal, maxLength, minLength, object, String, union, Date as DateType } from '@repo/schema-validator';
import { filmId } from './film-id.ts';

export const film = object({
  id: filmId,
  title: maxLength(255)(minLength(2)(String)),
  type: union(literal('old'), literal('new'), literal('regular')),
  createdAt: DateType,
});

export type Film = typeof film.Type;
