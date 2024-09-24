import { GraphQLError } from 'graphql';
import db from '../_db.js';
import Game from '../models/Game.js';
import Author from '../models/Author.js';

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
        authors: async () => {
            try {
                let authors = await Author.find({});

                return authors;
            } catch (error) {
                throw new GraphQLError('Error fetching authors', {
                    path: 'authors',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    }
                });
            }
        },
        authorById: async (_, args) => {
            try {
                let author = await Author.findById(args.id);

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
            } catch (error) {
                throw new GraphQLError('Error fetching author', {
                    path: 'authorById',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    }
                });
            }
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
                let { id, editGame } = args;

                let editParams = {};

                if (editGame.title) {
                    editParams.title = editGame.title;
                }

                if (editGame.platform) {
                    editParams.platform = editGame.platform;
                }

                let game = await Game.findByIdAndUpdate(id, editParams, { new: true });

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
        },
        addAuthor: async (_, args) => {
            try {
                let newAuthor = await Author.create(args.author);

                await newAuthor.save();

                return newAuthor;
            } catch (error) {
                throw new GraphQLError('Error adding author', {
                    path: 'addAuthor',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    }
                });
            }
        },
        updateAuthor: async (_, args) => {
            try {
                let { id, editAuthor } = args;

                let editParams = {};

                if (editAuthor.name) {
                    editParams.name = editAuthor.name;
                }

                if (editAuthor.verified !== undefined && editAuthor.verified !== null) {
                    editParams.verified = editAuthor.verified;
                }

                let author = await Author.findByIdAndUpdate(id, editParams, { new: true });

                if (author === undefined || author === null) {
                    throw new GraphQLError(`Author not found!`, {
                        path: 'updateAuthor',
                        extensions: {
                            code: "NOT_FOUND",
                            http: {
                                status: 401,
                            },
                        }
                    });
                }

                return author;
            } catch (error) {
                throw new GraphQLError('Error updating author', {
                    path: 'updateAuthor',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    },
                });
            }
        }
    }
};
