import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoose from "mongoose";

let MONGODB_URI = `mongodb+srv://sriram_venkatesh:RN7KDBpASPUSm7gT@cluster0.8moomsn.mongodb.net/serverDB?retryWrites=true&w=majority&appName=Cluster0`;

// Server setup
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

await mongoose.connect(MONGODB_URI);

console.log(`Connected to MongoDB - ${MONGODB_URI}`);

mongoose.set('debug', true);

const { url } = await startStandaloneServer(server, {
    listen: {
        port: 4000,
    }
});

console.log(`Server ready at ${url}`);