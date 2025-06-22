import { createFilmApi } from './api.ts';
import { createFilmRepository } from './film-repository.ts';

export function createFilmModule() {
  const filmRepository = createFilmRepository();
  const filmApi = createFilmApi({ filmRepository });
  return {
    api: filmApi,
  };
}
