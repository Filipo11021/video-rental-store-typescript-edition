import { describe, expect, it, vi } from 'vitest';
import { createRentalApi } from './api.ts';
import { FilmApi } from '@repo/film/api';
import { createInMemoryRentalRepository } from './rental-repository.ts';
import { ok } from '@repo/type-safe-errors';

const mockFilmApi: FilmApi = {
  createFilm: vi.fn(),
  getFilm: vi.fn(),
  getFilms: vi.fn(),
};

describe('rental api', () => {
  const rentalRepository = createInMemoryRentalRepository();
  const rentalApi = createRentalApi({
    filmApi: mockFilmApi,
    rentalRepository,
  });

  const userDto = {
    id: 'mocked-user-id',
    name: 'Mocked User',
  };

  it('should rent a film and return it', async () => {
    const mockedFilm = {
      id: 'mocked-film-id',
      title: 'Mocked Film',
      type: 'old',
      createdAt: new Date(),
    } as const;

    vi.mocked(mockFilmApi.getFilm).mockResolvedValue(ok(mockedFilm));

    const rentalData = {
      filmId: mockedFilm.id,
    };

    const rentResult = await rentalApi.rent({
      data: rentalData,
      currentUser: userDto,
    });

    if (!rentResult.ok) throw new Error('Rent failed');

    expect(rentResult.value.filmId).toBe(mockedFilm.id);
    expect(rentResult.value.customerId).toBe(userDto.id);

    const rentalsResult = await rentalApi.getRentals({ currentUser: userDto });
    if (!rentalsResult.ok) throw new Error('Get rentals failed');
    expect(rentalsResult.value.length).toBe(1);
    expect(rentalsResult.value[0]).toEqual({
      id: rentResult.value.id,
      filmId: mockedFilm.id,
      customerId: userDto.id,
      status: 'rented',
    });

    const returnResult = await rentalApi.return({
      data: { rentalId: rentResult.value.id },
      currentUser: userDto,
    });

    if (!returnResult.ok) throw new Error('Return failed');

    expect(returnResult.value.rentalId).toBe(rentResult.value.id);

    const rentalsAfterReturnResult = await rentalApi.getRentals({ currentUser: userDto });

    if (!rentalsAfterReturnResult.ok) throw new Error('Get rentals failed');
    expect(rentalsAfterReturnResult.value.length).toBe(1);
    expect(rentalsAfterReturnResult.value[0]).toEqual({
      id: rentResult.value.id,
      filmId: mockedFilm.id,
      customerId: userDto.id,
      status: 'returned',
    });
  });

  it('should not rent a film if user is not authorized', async () => {
    const mockedFilm = {
      id: 'mocked-film-id',
      title: 'Mocked Film',
      type: 'old',
      createdAt: new Date(),
    } as const;

    vi.mocked(mockFilmApi.getFilm).mockResolvedValue(ok(mockedFilm));

    const rentalData = {
      filmId: mockedFilm.id,
    };

    const rentResult = await rentalApi.rent({
      data: rentalData,
      currentUser: userDto,
    });

    if (!rentResult.ok) throw new Error('Rent failed');

    expect(rentResult.value.filmId).toBe(mockedFilm.id);
    expect(rentResult.value.customerId).toBe(userDto.id);

    const returnResult = await rentalApi.return({
      data: { rentalId: rentResult.value.id },
      currentUser: {
        id: 'test',
        name: 'Test',
      },
    });

    expect(returnResult.ok).toBe(false);
  });
});
