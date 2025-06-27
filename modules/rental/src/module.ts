import { FilmApiDep } from '@repo/film/api';
import { createRentalApi, RentalApi } from './api.ts';
import { createRentalRepository } from './rental-repository.ts';
import { ok, Result } from '@repo/type-safe-errors';

type RentalModule = Readonly<{
  api: RentalApi;
}>;

export async function createRentalModule(deps: FilmApiDep): Promise<Result<RentalModule, string>> {
  const rentalRepository = createRentalRepository();
  const rentalApi = createRentalApi({
    filmApi: deps.filmApi,
    rentalRepository,
  });

  return ok({
    api: rentalApi,
  });
}
