import { CustomerId } from './rental.ts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canRentFilm(userId: string) {
  return true;
}

export function canReturnFilm({ userId, rentalAuthorId }: { userId: string; rentalAuthorId: CustomerId }) {
  return userId === rentalAuthorId;
}
