import { describe, it, expect, assert } from 'vitest';
import { createServer } from './server.ts';
import { filmModule, rentalModule } from './api.ts';

describe('server', () => {
  const testServer = createServer();
  const baseContext = {
    filmApi: filmModule.api,
    rentalApi: rentalModule.api,
    currentUser: { id: '1', name: 'John Doe' },
  };

  it('can rent and return a film', async () => {
    const createFilmResponse = await testServer.executeOperation(
      {
        query: 'mutation { createFilm(input: { title: "The Matrix" }) { id } }',
      },
      {
        contextValue: baseContext,
      },
    );

    assert(createFilmResponse.body.kind === 'single');
    expect(createFilmResponse.body.singleResult.errors).toBeUndefined();

    // @ts-expect-error - createFilm returns unknown, so we check if id exists
    const filmId = createFilmResponse.body.singleResult.data?.createFilm?.id;
    expect(filmId).toBeDefined();

    const rentFilmResponse = await testServer.executeOperation(
      {
        query: 'mutation RentFilm($filmId: ID!) { rentFilm(input: { filmId: $filmId }) { id } }',
        variables: { filmId: filmId },
      },
      { contextValue: baseContext },
    );

    assert(rentFilmResponse.body.kind === 'single');
    expect(rentFilmResponse.body.singleResult.errors).toBeUndefined();

    // @ts-expect-error - rentFilm returns unknown, so we check if id exists
    const rentalId = rentFilmResponse.body.singleResult.data?.rentFilm?.id;
    expect(rentalId).toBeDefined();

    const returnFilmResponse = await testServer.executeOperation(
      {
        query: 'mutation ReturnFilm($rentalId: ID!) { returnFilm(input: { rentalId: $rentalId }) }',
        variables: { rentalId: rentalId },
      },
      { contextValue: baseContext },
    );

    assert(returnFilmResponse.body.kind === 'single');
    expect(returnFilmResponse.body.singleResult.errors).toBeUndefined();

    expect(returnFilmResponse.body.singleResult.data?.returnFilm).toBe(true);
  });
});
