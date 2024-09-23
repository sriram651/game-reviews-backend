import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoose from "mongoose";

// Server setup
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

await mongoose.connect(process.env.MONGODB_URI);

console.log("Connected to MongoDB");

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    }
});

console.log(`Server ready at ${url}`);