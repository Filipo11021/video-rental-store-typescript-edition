import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './gql-schema.ts';
import { resolvers } from './resolvers.ts';
import { createGqlContext, GqlContext } from './gql-context.ts';

type Server = ApolloServer<GqlContext>;

function createServer(): Server {
  return new ApolloServer<GqlContext>({
    typeDefs,
    resolvers,
  });
}

const { url } = await startStandaloneServer(createServer(), {
  listen: { port: 4000 },
  context: createGqlContext,
});

console.log(`🚀  Server ready at: ${url}`);
