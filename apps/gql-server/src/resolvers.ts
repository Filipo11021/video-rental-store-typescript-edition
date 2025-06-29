import { GqlContext } from './gql-context.ts';

export const resolvers = {
  Query: {
    films: async (_: unknown, __: unknown, ctx: GqlContext) => {
      const filmsResult = await ctx.filmApi.getFilms();
      if (!filmsResult.ok) {
        throw new Error(filmsResult.error.type);
      }
      return filmsResult.value;
    },
  },
  Mutation: {
    rentFilm: async (_: unknown, { input }: { input: { filmId: string } }, ctx: GqlContext) => {
      const rentFilmResult = await ctx.rentalApi.rent({
        data: { filmId: input.filmId },
        currentUser: ctx.currentUser,
      });

      if (!rentFilmResult.ok) {
        throw new Error(rentFilmResult.error.type);
      }

      return {
        id: rentFilmResult.value.id,
      };
    },

    returnFilm: async (_: unknown, { input }: { input: { rentalId: string } }, ctx: GqlContext) => {
      const returnFilmResult = await ctx.rentalApi.return({
        data: { rentalId: input.rentalId },
        currentUser: ctx.currentUser,
      });

      if (!returnFilmResult.ok) {
        throw new Error(returnFilmResult.error.type);
      }

      return true;
    },

    createFilm: async (_: unknown, { input }: { input: { title: string } }, ctx: GqlContext) => {
      const createFilmResult = await ctx.filmApi.createFilm({
        data: { title: input.title, type: 'new' },
        currentUser: ctx.currentUser,
      });

      if (!createFilmResult.ok) {
        throw new Error(createFilmResult.error.type);
      }

      return createFilmResult.value;
    },
  },
};
