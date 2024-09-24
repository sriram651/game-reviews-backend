export const typeDefs = `#graphql
    type Game {
        id: ID!
        title: String!
        platform: [String!]!
        reviews: [Review!]
        createdAt: String!
    }
    type Review {
        id: ID!
        rating: Float!
        content: String!
        game: Game
        author: Author
        createdAt: String!
    }
    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        createdAt: String!
    }
    type User {
        id: ID!
        userName: String!
        email: String!
        createdAt: String!
        token: String!
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
        registerNewUser(newUser: NewUserInput!): User
        addGame(newGame: NewGameInput!): Game
        updateGame(id: ID!, editGame: EditGameInput!): Game
        deleteGame(id: ID!): [Game]
        addAuthor(author: NewAuthorInput!): Author
        updateAuthor(id: ID!, editAuthor: EditAuthorInput!): Author
        addReview(gameId: ID!, authorId: ID!, review: NewReviewInput!): Review
    }

    input NewUserInput {
        userName: String!
        email: String!
        password: String!
    }

    input NewGameInput {
        title: String!
        platform: [String!]!
    }

    input EditGameInput {
        title: String
        platform: [String!]
    }

    input NewAuthorInput {
        name: String!
        verified: Boolean!
    }

    input EditAuthorInput {
        name: String
        verified: Boolean
    }

    input NewReviewInput {
        rating: Float!
        content: String!
    }
`;