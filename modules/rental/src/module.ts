import { FilmApiDep } from '@repo/film/api';
import { createRentalApi } from './api.ts';
import { createRentalRepository } from './rental-repository.ts';

export type RentalModuleDeps = FilmApiDep;

export function createRentalModule(deps: RentalModuleDeps) {
  const rentalRepository = createRentalRepository();
  const rentalApi = createRentalApi({
    filmApi: deps.filmApi,
    rentalRepository,
  });
  return {
    api: rentalApi,
  };
}
