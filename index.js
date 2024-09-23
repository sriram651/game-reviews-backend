import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

// Server setup
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    }
});

console.log(`Server ready at ${url}`);