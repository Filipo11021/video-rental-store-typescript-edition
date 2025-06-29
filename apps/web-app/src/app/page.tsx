import { filmApi, rentalApi } from '@/lib/api';
import { revalidatePath } from 'next/cache';

const user = { id: '1', name: 'John Doe' };

export default async function Home() {
  const [filmsResult, rentalsResult] = await Promise.all([
    filmApi.getFilms(),
    rentalApi.getRentals({ currentUser: user }),
  ]);
  if (!filmsResult.ok) return <div>Error: {filmsResult.error.message}</div>;
  if (!rentalsResult.ok) return <div>Error: {rentalsResult.error.message}</div>;

  return (
    <div className="flex flex-col gap-8 p-12 max-w-xl mx-auto">
      <h1>Film Rental App</h1>

      <div>
        <h2>Create Film</h2>
        <form
          action={async (formData) => {
            'use server';
            await filmApi.createFilm({
              data: { title: formData.get('title') as string, type: 'new' },
              currentUser: user,
            });
            revalidatePath('/');
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="title">Title</label>
          <input className="border border-gray-300 rounded-md p-2" type="text" name="title" />
          <button className="cursor-pointer bg-blue-500 text-white p-2 rounded-md" type="submit">
            Create Film
          </button>
        </form>
      </div>

      <div>
        <h2>Rent Film</h2>
        <form
          action={async (formData) => {
            'use server';
            await rentalApi.rent({
              data: { filmId: formData.get('filmId') as string },
              currentUser: user,
            });
            revalidatePath('/');
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="filmId">Film ID</label>
          <input className="border border-gray-300 rounded-md p-2" type="text" name="filmId" />
          <button className="cursor-pointer bg-blue-500 text-white p-2 rounded-md" type="submit">
            Rent Film
          </button>
        </form>
      </div>

      <div>
        <h2>Return Film</h2>
        <form
          action={async (formData) => {
            'use server';
            await rentalApi.return({ data: { rentalId: formData.get('rentalId') as string }, currentUser: user });
            revalidatePath('/');
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="rentalId">Rental ID</label>
          <input className="border border-gray-300 rounded-md p-2" type="text" name="rentalId" />
          <button className="cursor-pointer bg-blue-500 text-white p-2 rounded-md" type="submit">
            Return Film
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Rentals</h2>
        <ul>
          {rentalsResult.value.map((rental) => (
            <li key={rental.id}>
              {rental.id} - {rental.status}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Films</h2>
        <ul className="flex flex-col gap-2">
          {filmsResult.value.map((film) => (
            <li key={film.id}>
              {film.title} - {film.type} filmId: {film.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
