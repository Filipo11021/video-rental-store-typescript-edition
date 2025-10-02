import { FilmDto } from '../film-dto.ts';
import { Film } from './film.ts';

export function filmToDto(film: Film): FilmDto {
  return {
    id: film.id,
    title: film.title,
    type: film.type,
  };
}
