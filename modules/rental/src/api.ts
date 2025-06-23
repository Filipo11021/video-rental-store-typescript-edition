import { FilmApiDep } from '@repo/film/api';
import { err, ok, Result } from '@repo/type-safe-errors';
import { createRental } from './rental.ts';
import { RentalRepositoryDep } from './rental-repository.ts';
import { CreateRentDto, CreateReturnDto, RentDto, ReturnDto } from './dto.ts';

type RentalApiDeps = FilmApiDep & RentalRepositoryDep;

type RentalApi = Readonly<{
  rent: (data: CreateRentDto) => Promise<Result<RentDto, string>>;
  return: (data: CreateReturnDto) => Promise<Result<ReturnDto, string>>;
}>;
export type RentalApiDep = Readonly<{
  rentalApi: RentalApi;
}>;

export function createRentalApi(deps: RentalApiDeps): RentalApi {
  return {
    rent: async (data) => {
      const filmResult = await deps.filmApi.getFilm(data.filmId);
      if (!filmResult.ok) return err('Film not exists');

      const rentalResult = createRental({
        filmId: data.filmId,
        customerId: data.customerId,
        status: 'rented',
      });
      if (!rentalResult.ok) return err(rentalResult.error.type);

      const savedRentalResult = await deps.rentalRepository.save(rentalResult.value);
      if (!savedRentalResult.ok) return err(savedRentalResult.error);

      return ok({
        id: savedRentalResult.value.id,
        filmId: savedRentalResult.value.filmId,
        customerId: savedRentalResult.value.customerId,
        createdAt: rentalResult.value.createdAt,
      });
    },
    return: async (data) => {
      const rentalResult = await deps.rentalRepository.getById(data.rentalId);
      if (!rentalResult.ok) return err(rentalResult.error);

      const returnRentalResult = await deps.rentalRepository.update({
        ...rentalResult.value,
        status: 'returned',
      });
      if (!returnRentalResult.ok) return err(returnRentalResult.error);

      return ok({ rentalId: data.rentalId });
    },
  };
}
