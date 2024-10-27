import { GraphQLError } from "graphql";
import Game from "../../models/Game.js";
import Review from "../../models/Review.js";

const getAllGames = async (_, args) => {
    try {
        let {
            search = "",
            platform = [],
            genre = [],
            yearRange = [],
            sortBy = "releasedYear",
            sortOrder = "DESC"
        } = args;

        let matchConditions = {
            title: { $regex: search, $options: 'i' }
        };

        if (platform.length > 0) {
            matchConditions.platform = { $in: platform };
        }

        if (genre.length > 0) {
            matchConditions.genre = { $in: genre };
        }

        if (yearRange.length > 0) {
            let minYear = yearRange[0];
            let maxYear = yearRange[0];

            if (yearRange.length > 1) {
                maxYear = yearRange[1];
            }

            matchConditions.releasedYear = {
                $gte: minYear,
                $lte: maxYear
            }
        }

        let aggregateQuery = [
            {
                $match: matchConditions
            },
            {
                $sort: {
                    [sortBy]: sortOrder === "ASC" ? 1 : -1
                }
            }
        ];

        let allGames = await Game.aggregate(aggregateQuery);

        return allGames;
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'getAllGames',
            extensions: error.extensions
        });
    }
};

const getGameById = async (_, args) => {
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
};

const deleteGame = async (_, args, context) => {
    try {
        if (!context.user.userId) {
            throw new GraphQLError('User not authenticated!', {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        if (context.user.role === "USER") {
            throw new GraphQLError('You do not have authorization!', {
                extensions: {
                    code: "UNAUTHORIZED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        let game = await Game.findById(args.id);

        if (game === undefined || game === null) {
            throw new GraphQLError(`Game not found!`, {
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
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'deleteGame',
            extensions: error.extensions
        });
    }
};

const addGame = async (_, args, context) => {
    try {
        if (!context.user.userId) {
            throw new GraphQLError('User not authenticated!', {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        if (context.user.role === "USER") {
            throw new GraphQLError('You do not have authorization!', {
                extensions: {
                    code: "UNAUTHORIZED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        let newGame = await Game.create(
            {
                title: args.newGame.title,
                platform: args.newGame.platform
            }
        );

        await newGame.save();

        return newGame;
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'addGame',
            extensions: error.extensions
        });
    }
};

const updateGame = async (_, args, context) => {
    try {
        if (!context.user.userId) {
            throw new GraphQLError('User not authenticated!', {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        if (context.user.role === "USER") {
            throw new GraphQLError('You do not have authorization!', {
                extensions: {
                    code: "UNAUTHORIZED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        let { id, editGame } = args;

        let editParams = {};

        if (editGame.title) {
            editParams.title = editGame.title;
        }

        if (editGame.platform) {
            editParams.platform = editGame.platform;
        }

        if (editGame.releasedYear) {
            editParams.releasedYear = editGame.releasedYear;
        }

        if (editGame.genre) {
            editParams.genre = editGame.genre;
        }

        let game = await Game.findByIdAndUpdate(id, {
            ...editParams,
            updatedAt: new Date().toISOString()
        }, { new: true });

        if (game === undefined || game === null) {
            throw new GraphQLError(`Game not found!`, {
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
        throw new GraphQLError(error.message, {
            path: 'updateGame',
            extensions: error.extensions,
        });
    }
};

export const gameQueries = {
    getAllGames,
    getGameById,
};

export const gameMutations = {
    addGame,
    updateGame,
    deleteGame,
};

export const gameNestedQueries = {
    Game: {
        reviews: async (parent) => {
            try {
                let reviews = Review.find({ gameId: parent._id }).sort({ createdAt: -1 });

                return reviews;
            } catch (error) {
                throw new GraphQLError('Error fetching reviews', {
                    path: 'game.reviews',
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
        averageRating: async (parent) => {
            try {
                let aggregateQuery = [
                    {
                        $match: {
                            gameId: parent._id.toString()
                        }
                    },
                    {
                        $group: {
                            _id: "$gameId",
                            totalRating: {
                                $sum: "$rating"
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            averageRating: {
                                $divide: ["$totalRating", "$count"]
                            }
                        }
                    }
                ];

                let aggregateResult = await Review.aggregate(aggregateQuery);

                if (aggregateResult.length === 0) {
                    return 0;
                }

                let averageRating = aggregateResult[0].averageRating?.toFixed(2);

                return averageRating;
            } catch (error) {
                throw new GraphQLError('Error fetching average rating', {
                    path: 'game.averageRating',
                    extensions: error.extensions
                });
            }
        },
    },
};