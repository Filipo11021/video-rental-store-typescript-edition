export type CreateRentalDto = Readonly<{
  filmId: string;
  customerId: string;
  status: 'rented' | 'returned';
}>;

export type CreateRentDto = Readonly<{
  filmId: string;
  customerId: string;
}>;

export type RentDto = Readonly<{
  id: string;
  filmId: string;
  customerId: string;
  createdAt: Date;
}>;

export type ReturnDto = Readonly<{
  rentalId: string;
}>;

export type CreateReturnDto = Readonly<{
  rentalId: string;
}>;
