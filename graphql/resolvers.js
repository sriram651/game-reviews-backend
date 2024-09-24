import { GraphQLError } from 'graphql';
import db from '../_db.js';
import Game from '../models/Game.js';

export const resolvers = {
    Query: {
        games: async () => {
            let allGames = await Game.find({});

            return allGames;
        },
        gameById: async (_, args) => {
            let game = await Game.findById(args.id);

            if (game === undefined || game === null) {
                throw new GraphQLError('Game not found', {
                    path: 'gameById',
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 401,
                        },
                    }
                });
            }

            return game;
        },
        authors() {
            return db.authors;
        },
        authorById(_, args) {
            let author = db.authors.find((author) => author.id == args.id);

            if (author === undefined || author === null) {
                throw new GraphQLError('Author not found', {
                    path: 'authorById',
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 401,
                        },
                    }
                });
            }

            return author;
        },
        reviews() {
            return db.reviews;
        },
        reviewById(_, args) {
            let review = db.reviews.find((review) => review.id === args.id);

            if (review === undefined || review === null) {
                throw new GraphQLError('Review not found', {
                    path: 'reviewById',
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 401,
                        },
                    }
                });
            }

            return review;
        },
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id);
        }
    },
    Review: {
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id);
        },
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id);
        }
    },
    Mutation: {
        deleteGame: async (_, args) => {
            let game = await Game.findById(args.id);

            if (game === undefined || game === null) {
                throw new GraphQLError(`Game not found!`, {
                    path: 'deleteGame',
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 401,
                        },
                    }
                });
            }

            await Game.deleteOne({ _id: args.id });

            return await Game.find({});
        },
        addGame: async (_, args) => {
            try {
                let newGame = await Game.create(
                    {
                        title: args.newGame.title,
                        platform: args.newGame.platform
                    }
                );

                await newGame.save();

                return newGame;
            } catch (error) {
                throw new GraphQLError('Error adding game', {
                    path: 'addGame',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    }
                });
            }
        },
        updateGame: async (_, args) => {
            try {
                let game = await Game.findById(args.id);

                if (game === undefined || game === null) {
                    throw new GraphQLError(`Game not found!`, {
                        path: 'updateGame',
                        extensions: {
                            code: "NOT_FOUND",
                            http: {
                                status: 401,
                            },
                        }
                    });
                }

                game.title = args.editGame.title;
                game.platform = args.editGame.platform;

                await game.save();

                return game;
            } catch (error) {
                throw new GraphQLError('Error updating game', {
                    path: 'updateGame',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                    originalError: error
                });
            }
        }
    }
};
