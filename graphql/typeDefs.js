export const typeDefs = `#graphql
    type Game {
        id: ID!
        title: String!
        platform: [String!]!
        releasedYear: Int!
        genre: [String!]!
        reviews: [Review!]
        createdAt: String!
    }
    type Review {
        id: ID!
        rating: Float!
        content: String!
        upVotes: Int!
        downVotes: Int!
        voters: [ReviewVoter!]
        game: Game
        user: User
        createdAt: String!
    }
    type User {
        id: ID!
        userName: String!
        email: String!
        createdAt: String!
        role: String!
    }
    type UserResponse {
        id: ID!
        userName: String!
        email: String!
        createdAt: String!
        role: String!
        token: String!
    }
    type ReviewVoter {
        userId: ID!
        voteType: VoteType!
    }

    enum Role {
        ADMIN
        USER
        # SUPER_ADMIN
    }

    enum Platform {
        PC
        PS4
        PS5
        XBOX
        XBOX360
        XBOXONE
        NINTENDO
        SWITCH
        MOBILE
    }

    enum Genre {
        ACTION
        ADVENTURE
        RPG
        STRATEGY
        SIMULATION
        SPORTS
        PUZZLE
        HORROR
        FPS
        TPS
        OPEN_WORLD
        MULTIPLAYER
        MMO
        CARD
        PLATFORMER
        FIGHTING
        RACING
        ARCADE
        SURVIVAL
    }

    enum GameSortBy {
        title
        releasedYear
    }

    enum SortOrder {
        ASC
        DESC
    }

    enum VoteType {
        UP
        DOWN
    }

    type Query {
        reviews: [Review]
        reviewById(id: ID!): Review
        getAllGames(search: String, platform: [Platform], genre: [Genre], yearRange: [Int!], sortBy: GameSortBy, sortOrder: SortOrder): [Game]
        getGameById(id: ID!): Game
        getReviewsByUser: [Review]
    }

    type Mutation {
        changeUserRole(email: String!, role: Role!): User
        registerNewUser(newUser: NewUserInput!): UserResponse
        loginUser(userLogin: UserLoginInput!): UserResponse
        addGame(newGame: NewGameInput!): Game
        updateGame(id: ID!, editGame: EditGameInput!): Game
        deleteGame(id: ID!): [Game]
        addReview(gameId: ID! review: NewReviewInput!): Review
        updateReview(id: ID!, review: UpdateReviewInput!): Review
        upVoteReview(reviewId: ID!): Boolean!
        downVoteReview(reviewId: ID!): Boolean!
    }

    input NewUserInput {
        userName: String!
        email: String!
        password: String!
        role: Role
    }

    input NewGameInput {
        title: String!
        platform: [Platform!]!
        releasedYear: Int!
        genre: [Genre!]!
    }

    input EditGameInput {
        title: String
        platform: [Platform!]
        releasedYear: Int
        genre: [Genre!]
    }

    input NewReviewInput {
        rating: Float!
        content: String!
    }

    input UpdateReviewInput {
        rating: Float
        content: String
    }

    input UserLoginInput {
        email: String!
        password: String!
    }
`;