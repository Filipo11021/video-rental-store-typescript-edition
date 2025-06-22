import { brand, Date as DateType, literal, object, String, union } from '@repo/schema-validator';
import { randomUUID } from 'node:crypto';
import { CreateRentalDto } from './dto.ts';
import { err, ok, Result } from '@repo/type-safe-errors';

export const rentalId = brand('RentalId', String);
export type RentalId = typeof rentalId.Type;

export const createRentalId = () => rentalId.from(randomUUID());

const customerId = brand('CustomerId', String);
export type CustomerId = typeof customerId.Type;

const filmId = brand('FilmId', String);
export type FilmId = typeof filmId.Type;

export const rental = object({
  id: rentalId,
  filmId: filmId,
  customerId: customerId,
  createdAt: DateType,
  status: union(literal('rented'), literal('returned')),
});

export type Rental = typeof rental.Type;

type RentalError = { type: 'InvalidRentalId' } | { type: 'InvalidRental' };

export function createRental(data: CreateRentalDto): Result<Rental, RentalError> {
  const rentalIdResult = createRentalId();
  if (!rentalIdResult.ok) return err({ type: 'InvalidRentalId' });

  const rentalResult = rental.from({
    id: rentalIdResult.value,
    filmId: data.filmId,
    customerId: data.customerId,
    createdAt: new Date(),
    status: data.status,
  });
  if (!rentalResult.ok) return err({ type: 'InvalidRental' });

  return ok({
    id: rentalResult.value.id,
    filmId: rentalResult.value.filmId,
    customerId: rentalResult.value.customerId,
    createdAt: rentalResult.value.createdAt,
    status: rentalResult.value.status,
  });
}
