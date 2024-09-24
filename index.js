import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoose from "mongoose";
import "dotenv/config";

let mongoUri = process.env.MONGODB_URI;

// Server setup
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

await mongoose.connect(mongoUri);

console.log(`Connected to MongoDB - ${mongoUri}`);

mongoose.set('debug', true);

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    }
});

console.log(`Server ready at ${url}`);