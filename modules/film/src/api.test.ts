import { createInMemoryFilmRepository } from './film-repository.ts';
import { createFilmApi } from './api.ts';
import { describe, expect, test } from 'vitest';

describe('Film API', () => {
  const filmRepository = createInMemoryFilmRepository();
  const filmApi = createFilmApi({ filmRepository });

  const mockUser = {
    id: '1',
    name: 'John Doe',
  };

  test('should show created film', async () => {
    const createFilmResult = await filmApi.createFilm({
      data: { title: 'The Godfather', type: 'old' },
      currentUser: mockUser,
    });
    if (!createFilmResult.ok) throw new Error('Failed to create film');

    const filmResult = await filmApi.getFilm(createFilmResult.value.id);
    if (!filmResult.ok) throw new Error('Failed to get film');
    expect(filmResult.value).toEqual(createFilmResult.value);
  });
});
