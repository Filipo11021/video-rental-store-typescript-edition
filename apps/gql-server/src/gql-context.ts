import { FilmApi } from '@repo/film/api';
import { RentalApi } from '@repo/rental/api';
import { UserDto } from '@repo/auth/dto';
import { filmModule, rentalModule } from './api.ts';

export type GqlContext = {
  filmApi: FilmApi;
  rentalApi: RentalApi;
  currentUser: UserDto;
};

export async function createGqlContext(): Promise<GqlContext> {
  return {
    filmApi: filmModule.api,
    rentalApi: rentalModule.api,
    currentUser: { id: '1', name: 'John Doe' },
  };
}
