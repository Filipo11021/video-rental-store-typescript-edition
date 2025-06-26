import { FilmApiDep } from '@repo/film/api';
import { err, ok, Result } from '@repo/type-safe-errors';
import { createRental } from './rental.ts';
import { RentalRepositoryDep } from './rental-repository.ts';
import { CreateRentDto, CreateReturnDto, RentDto, ReturnDto } from './dto.ts';
import { UserDto } from '@repo/auth/dto';
import { canRentFilm, canReturnFilm } from './rental-permissions.ts';

type RentalApiDeps = FilmApiDep & RentalRepositoryDep;

export type RentalApi = Readonly<{
  rent: (data: CreateRentDto, customer: UserDto) => Promise<Result<RentDto, string>>;
  return: (data: CreateReturnDto, customer: UserDto) => Promise<Result<ReturnDto, string>>;
}>;
export type RentalApiDep = Readonly<{
  rentalApi: RentalApi;
}>;

export function createRentalApi(deps: RentalApiDeps): RentalApi {
  return {
    rent: async (data, customer) => {
      const filmResult = await deps.filmApi.getFilm(data.filmId);
      if (!filmResult.ok) return err('Film not exists');

      if (!canRentFilm(customer.id)) return err('Unauthorized');

      const rentalResult = createRental({
        filmId: data.filmId,
        customerId: customer.id,
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
    return: async (data, currentUser: UserDto) => {
      const rentalResult = await deps.rentalRepository.getById(data.rentalId);
      if (!rentalResult.ok) return err(rentalResult.error);

      if (
        !canReturnFilm({
          userId: currentUser.id,
          rentalAuthorId: rentalResult.value.customerId,
        })
      )
        return err('Unauthorized');

      const returnRentalResult = await deps.rentalRepository.update({
        ...rentalResult.value,
        status: 'returned',
      });
      if (!returnRentalResult.ok) return err(returnRentalResult.error);

      return ok({ rentalId: data.rentalId });
    },
  };
}
