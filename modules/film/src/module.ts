import { ok, Result } from '@repo/type-safe-errors';
import { createFilmApi, FilmApi } from './api.ts';
import { createFilmRepository } from './film-repository.ts';

type FilmModule = Readonly<{
  api: FilmApi;
}>;

export async function createFilmModule(): Promise<Result<FilmModule, string>> {
  const filmRepository = createFilmRepository();
  const filmApi = createFilmApi({ filmRepository });
  return ok({
    api: filmApi,
  });
}
