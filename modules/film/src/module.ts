import { ok, Result } from '@repo/type-safe-errors';
import { createFilmApi, FilmApi } from './api.ts';
import { createFilmRepository } from './film-repository.ts';
import { createTime } from '@repo/time';

type FilmModule = Readonly<{
  api: FilmApi;
}>;

export async function createFilmModule(): Promise<Result<FilmModule, string>> {
  const filmRepository = createFilmRepository();
  const time = createTime();

  const filmApi = createFilmApi({ filmRepository, time });
  return ok({
    api: filmApi,
  });
}
