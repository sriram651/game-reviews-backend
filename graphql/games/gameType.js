export const gameType = `#graphql
    type Game {
        _id: ID!
        title: String!
        description: String!
        platform: [String!]!
        releasedYear: Int!
        coverImage: String!
        genre: [String!]!
        reviews: [Review!]
        releaseDate: String!
        manufacturerName: String!
        developer: String!
        createdAt: String
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

    enum SortOrder {
        ASC
        DESC
    }
`;

export const gameQueries = `#graphql
    getAllGames(search: String, platform: [Platform], genre: [Genre], yearRange: [Int!], sortBy: GameSortBy, sortOrder: SortOrder): [Game]
    getGameById(id: ID!): Game
`;

export const gameMutations = `#graphql
    addGame(newGame: NewGameInput!): Game
    updateGame(id: ID!, editGame: EditGameInput!): Game
    deleteGame(id: ID!): [Game]
`;