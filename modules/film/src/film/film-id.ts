import { brand, String } from '@repo/schema-validator';
import { randomUUID } from 'node:crypto';

export const filmId = brand('FilmId', String);
export const createFilmId = () => filmId.from(randomUUID().toString());

export type FilmId = typeof filmId.Type;
