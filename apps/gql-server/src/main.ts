import { startStandaloneServer } from '@apollo/server/standalone';
import { createGqlContext } from './gql-context.ts';
import { createServer } from './server.ts';

const { url } = await startStandaloneServer(createServer(), {
  listen: { port: 4000 },
  context: createGqlContext,
});

console.log(`🚀  Server ready at: ${url}`);
