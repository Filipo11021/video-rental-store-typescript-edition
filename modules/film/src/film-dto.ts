import { Film } from './film.ts';

export type FilmTypeDto = 'old' | 'new' | 'regular';

export type FilmDto = {
  id: string;
  title: string;
  type: FilmTypeDto;
};

export type CreateFilmDto = {
  title: string;
  type: FilmTypeDto;
};

export function filmToDto(film: Film): FilmDto {
  return {
    id: film.id,
    title: film.title,
    type: film.type,
  };
}
