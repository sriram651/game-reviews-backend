export const typeDefs = `#graphql
    type Game {
        id: ID!,
        title: String!,
        platform: [String!]!
        reviews: [Review!]
    }
    type Review {
        id: ID!,
        rating: Int!,
        content: String!,
        game: Game!
        author: Author! 
    }
    type Author {
        id: ID!,
        name: String!,
        verified: Boolean!,
    }

    type Query {
        reviews: [Review]
        reviewById(id: ID!): Review
        games: [Game]
        gameById(id: ID!): Game
        authors: [Author]
        authorById(id: ID!): Author
    }

    type Mutation {
        addGame(newGame: NewGame!): Game
        updateGame(id: ID!, editGame: EditGame!): Game
        deleteGame(id: ID!): [Game]
    }

    input NewGame {
        title: String!
        platform: [String!]!
    }

    input EditGame {
        title: String
        platform: [String!]
    }
`;