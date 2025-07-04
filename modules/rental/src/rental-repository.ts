import { err, ok, Result } from '@repo/type-safe-errors';
import { Rental } from './rental.ts';

type RentalRepository = Readonly<{
  save: (rental: Rental) => Promise<Result<Rental, RentalRepositorySaveError>>;
  update: (rental: Rental) => Promise<Result<Rental, RentalRepositoryNotFoundError>>;
  getById: (id: string) => Promise<Result<Rental, RentalRepositoryNotFoundError>>;
  getAll: () => Promise<Result<Rental[], RentalRepositoryNotFoundError>>;
}>;

export type RentalRepositoryDep = Readonly<{
  rentalRepository: RentalRepository;
}>;

type RentalRepositorySaveError = Readonly<{
  type: 'RentalRepositorySaveError';
  message: string;
}>;

type RentalRepositoryNotFoundError = Readonly<{
  type: 'RentalRepositoryNotFoundError';
  message: string;
}>;

export function createInMemoryRentalRepository(): RentalRepository {
  const rentals: Rental[] = [];
  return {
    save: async (rental: Rental) => {
      rentals.push(rental);
      return ok(rental);
    },
    update: async (rental: Rental) => {
      const index = rentals.findIndex((r) => r.id === rental.id);
      if (index === -1)
        return err({
          type: 'RentalRepositoryNotFoundError',
          message: 'Rental not found',
        });
      rentals[index] = rental;
      return ok(rental);
    },
    getById: async (id: string) => {
      const rental = rentals.find((r) => r.id === id);
      if (!rental)
        return err({
          type: 'RentalRepositoryNotFoundError',
          message: 'Rental not found',
        });
      return ok(rental);
    },
    getAll: async () => {
      return ok(rentals);
    },
  };
}

export function createRentalRepository(): RentalRepository {
  return createInMemoryRentalRepository();
}
