import { err, ok, Result } from '@repo/type-safe-errors';
import { Rental } from './rental.ts';

export type RentalRepositoryDep = Readonly<{
  rentalRepository: RentalRepository;
}>;

type RentalRepository = Readonly<{
  save: (rental: Rental) => Promise<Result<Rental, string>>;
  update: (rental: Rental) => Promise<Result<Rental, string>>;
  getById: (id: string) => Promise<Result<Rental, string>>;
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
      if (index === -1) return err('Rental not found');
      rentals[index] = rental;
      return ok(rental);
    },
    getById: async (id: string) => {
      const rental = rentals.find((r) => r.id === id);
      if (!rental) return err('Rental not found');
      return ok(rental);
    },
  };
}

export function createRentalRepository(): RentalRepository {
  return createInMemoryRentalRepository();
}
