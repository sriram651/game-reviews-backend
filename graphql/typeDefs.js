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
        registerNewUser(newUser: NewUser!): User
        addGame(newGame: NewGame!): Game
        updateGame(id: ID!, editGame: EditGame!): Game
        deleteGame(id: ID!): [Game]
        addAuthor(author: NewAuthor!): Author
        updateAuthor(id: ID!, editAuthor: EditAuthor!): Author
        addReview(gameId: ID!, authorId: ID!, review: NewReview!): Review
    }

    input NewUser {
        userName: String!
        email: String!
        password: String!
    }

    input NewGame {
        title: String!
        platform: [String!]!
    }

    input EditGame {
        title: String
        platform: [String!]
    }

    input NewAuthor {
        name: String!
        verified: Boolean!
    }

    input EditAuthor {
        name: String
        verified: Boolean
    }

    input NewReview {
        rating: Float!
        content: String!
    }
`;