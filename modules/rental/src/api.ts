import { FilmApiDep } from '@repo/film/api';
import { err, ok, Result } from '@repo/type-safe-errors';
import { createRental } from './rental.ts';
import { RentalRepositoryDep } from './rental-repository.ts';
import { CreateRentDto, CreateReturnDto, RentDto, ReturnDto } from './dto.ts';
import { UserDto } from '@repo/auth/dto';
import { canRentFilm, canReturnFilm } from './rental-permissions.ts';

type Protected = Readonly<{
  currentUser: UserDto;
}>;

type RentalApiDeps = FilmApiDep & RentalRepositoryDep;

export type RentalApi = Readonly<{
  rent: (arg: { data: CreateRentDto } & Protected) => Promise<Result<RentDto, UnauthorizedError | SaveRentalError>>;
  return: (
    arg: { data: CreateReturnDto } & Protected,
  ) => Promise<Result<ReturnDto, UnauthorizedError | UpdateRentalError>>;
}>;
export type RentalApiDep = Readonly<{
  rentalApi: RentalApi;
}>;

type UnauthorizedError = Readonly<{
  type: 'UnauthorizedError';
  message: string;
}>;

type SaveRentalError = Readonly<{
  type: 'SaveRentalError';
  message: string;
}>;

type UpdateRentalError = Readonly<{
  type: 'UpdateRentalError';
  message: string;
}>;

export function createRentalApi(deps: RentalApiDeps): RentalApi {
  return {
    rent: async ({ data, currentUser }) => {
      const filmResult = await deps.filmApi.getFilm(data.filmId);
      if (!filmResult.ok)
        return err({
          type: 'UnauthorizedError',
          message: 'Film not exists',
        });

      if (!canRentFilm(currentUser.id))
        return err({
          type: 'UnauthorizedError',
          message: 'Unauthorized',
        });

      const rentalResult = createRental({
        filmId: data.filmId,
        customerId: currentUser.id,
        status: 'rented',
      });
      if (!rentalResult.ok)
        return err({
          type: 'SaveRentalError',
          message: rentalResult.error.type,
        });

      const savedRentalResult = await deps.rentalRepository.save(rentalResult.value);
      if (!savedRentalResult.ok)
        return err({
          type: 'SaveRentalError',
          message: savedRentalResult.error.type,
        });

      return ok({
        id: savedRentalResult.value.id,
        filmId: savedRentalResult.value.filmId,
        customerId: savedRentalResult.value.customerId,
        createdAt: rentalResult.value.createdAt,
      });
    },
    return: async ({ data, currentUser }) => {
      const rentalResult = await deps.rentalRepository.getById(data.rentalId);
      if (!rentalResult.ok)
        return err({
          type: 'UnauthorizedError',
          message: 'Unauthorized',
        });

      if (
        !canReturnFilm({
          userId: currentUser.id,
          rentalAuthorId: rentalResult.value.customerId,
        })
      )
        return err({
          type: 'UnauthorizedError',
          message: 'Unauthorized',
        });

      const returnRentalResult = await deps.rentalRepository.update({
        ...rentalResult.value,
        status: 'returned',
      });
      if (!returnRentalResult.ok)
        return err({
          type: 'UpdateRentalError',
          message: returnRentalResult.error.type,
        });

      return ok({ rentalId: data.rentalId });
    },
  };
}
