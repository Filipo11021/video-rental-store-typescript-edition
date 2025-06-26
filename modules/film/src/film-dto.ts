export type FilmTypeDto = 'old' | 'new' | 'regular';

export type FilmDto = Readonly<{
  id: string;
  title: string;
  type: FilmTypeDto;
}>;

export type CreateFilmDto = Readonly<{
  title: string;
  type: FilmTypeDto;
}>;
