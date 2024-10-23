import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoose from "mongoose";
import "dotenv/config";
import authenticate from "./middleware/auth.js";

let mongoUri = process.env.MONGODB_URI;

// Server setup
const server = new ApolloServer({
    introspection: true,
    typeDefs: typeDefs,
    resolvers: resolvers,
});

await mongoose.connect(mongoUri);

console.log(`Connected to MongoDB - ${mongoUri}`);

mongoose.set('debug', true);

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    },
    context: async ({ req }) => {
        const user = await authenticate(req);

        if (!user) {
            return { user: null };
        }

        return { user };
    }
});

console.log(`Server ready at ${url}`);