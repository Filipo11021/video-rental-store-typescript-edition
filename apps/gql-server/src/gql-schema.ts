export const typeDefs = `#graphql
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
