import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { filmModule, rentalModule } from './api.ts';

const typeDefs = `#graphql
  type Film {
    id: ID!
    title: String!
    type: String!
  }

  type RentFilmResponse {
    id: ID!
  }


  input RentFilmInput {
    filmId: ID!
  }


  input ReturnFilmInput {
    rentalId: ID!
  }


  input CreateFilmInput {
    title: String!
  }


  type Query {
    films: [Film!]!
  }


  type Mutation {
    rentFilm(input: RentFilmInput!): RentFilmResponse!
    
    returnFilm(input: ReturnFilmInput!): Boolean!

    createFilm(input: CreateFilmInput!): Film!
  }
  
`;

const resolvers = {
  Query: {
    films: async () => {
      const filmsResult = await filmModule.api.getFilms();
      if (!filmsResult.ok) {
        throw new Error(filmsResult.error.type);
      }
      return filmsResult.value;
    },
  },
  Mutation: {
    rentFilm: async (_: unknown, { input }: { input: { filmId: string } }) => {
      const rentFilmResult = await rentalModule.api.rent({
        data: { filmId: input.filmId },
        currentUser: { id: '1', name: 'John Doe' },
      });

      if (!rentFilmResult.ok) {
        throw new Error(rentFilmResult.error.type);
      }

      return {
        id: rentFilmResult.value.id,
      };
    },

    returnFilm: async (_: unknown, { input }: { input: { rentalId: string } }) => {
      const returnFilmResult = await rentalModule.api.return({
        data: { rentalId: input.rentalId },
        currentUser: { id: '1', name: 'John Doe' },
      });

      if (!returnFilmResult.ok) {
        throw new Error(returnFilmResult.error.type);
      }

      return true;
    },

    createFilm: async (_: unknown, { input }: { input: { title: string } }) => {
      const createFilmResult = await filmModule.api.createFilm({
        data: { title: input.title, type: 'new' },
        currentUser: { id: '1', name: 'John Doe' },
      });

      if (!createFilmResult.ok) {
        throw new Error(createFilmResult.error.type);
      }

      return createFilmResult.value;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
