import { GraphQLError } from 'graphql';
import db from '../_db.js';

export const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        gameById(_, args) {
            let game = db.games.find((game) => game.id == args.id);

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
    // Author: {
    //     reviews(parent) {
    //         return db.reviews.filter((review) => review.author_id === parent.id);
    //     }
    // },
    Review: {
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id);
        },
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id);
        }
    },
    Mutation: {
        deleteGame(_, args) {
            let deleteGame = db.games.find((game) => game.id === args.id);
            if (deleteGame === undefined || deleteGame === null) {
                throw new GraphQLError(`Game with Id ${args.id} not found!`, {
                    path: 'deleteGame',
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 401,
                        },
                    }
                });
            }

            db.games = db.games.filter((game) => game.id !== args.id);
            return db.games;
        },
        addGame(_, args) {
            let newGame = {
                ...args.newGame,
                id: Math.floor(Math.random() * 10000).toString()
            };

            db.games.push(newGame);

            return newGame;
        },
        updateGame(_, args) {
            let editGame = db.games.find((game) => game.id === args.id);

            if (editGame === undefined || editGame === null) {
                throw new GraphQLError(`Game with Id ${args.id} not found!`, {
                    path: 'updateGame',
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 401,
                        },
                    }
                });
            }

            let updatedGames = db.games.map((game) => {
                if (game.id === args.id) {
                    return {
                        ...game,
                        ...args.editGame
                    };
                }

                return game;
            });

            db.games = updatedGames;

            return db.games.find((game) => game.id === args.id);
        }
    }
};
