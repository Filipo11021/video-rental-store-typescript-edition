import { ApolloServer } from '@apollo/server';
import { GqlContext } from './gql-context.ts';
import { typeDefs } from './gql-schema.ts';
import { resolvers } from './resolvers.ts';

type Server = ApolloServer<GqlContext>;

export function createServer(): Server {
  return new ApolloServer<GqlContext>({
    typeDefs,
    resolvers,
  });
}
