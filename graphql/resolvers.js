import { GraphQLError } from 'graphql';
import Game from '../models/Game.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { comparePassword, createToken, encryptPassword } from '../utils/userAuth.js';

export const resolvers = {
    Query: {
        getAllGames: async (_, args) => {
            try {
                let search = args.search || '';
                let platform = args.platform || [];

                let aggregateQuery = [
                    {
                        $match: {
                            title: { $regex: search, $options: 'i' }
                        }
                    }
                ];

                if (platform.length > 0) {
                    aggregateQuery[0].$match.platform = { $in: platform };
                }

                let allGames = await Game.aggregate(aggregateQuery);

                return allGames;
            } catch (error) {
                throw new GraphQLError(error.message, {
                    path: 'getAllGames',
                    extensions: error.extensions
                });
            }
        },
        getGameById: async (_, args) => {
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
        reviews: async () => {
            try {
                let reviews = await Review.find({});

                return reviews;
            } catch (error) {
                throw new GraphQLError('Error fetching reviews', {
                    path: 'reviews',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    }
                });
            }
        },
        reviewById: async (_, args) => {
            try {
                let { id } = args;
                let reviewById = await Review.findById(id);

                if (reviewById === undefined || reviewById === null) {
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

                return reviewById;
            } catch (error) {
                throw new GraphQLError('Error fetching review', {
                    path: 'reviewById',
                    extensions: {
                        code: "INTERNAL_SERVER_ERROR",
                        http: {
                            status: 500,
                        },
                    }
                });
            }
        },
        getReviewsByUser: async (_, args, context) => {
            try {
                let { userId } = context.user;

                if (!userId) {
                    throw new GraphQLError('User not authenticated!', {
                        path: 'getReviewsByUser',
                        extensions: {
                            code: "UNAUTHORIZED",
                            http: {
                                status: 401,
                            },
                        }
                    });
                }

                let userReviews = await Review.find({ userId });

                return userReviews;
            } catch (error) {
                throw new GraphQLError(error.message, {
                    path: 'getReviewsByUser',
                    extensions: error.extensions
                });
            }
        },
    },
    Mutation: {
        registerNewUser: async (_, args) => {
            try {
                let { userName, email, password } = args.newUser;

                let existingUser = await User.findOne({ email });

                if (existingUser) {
                    throw new GraphQLError('Email is already registered!', {
                        path: 'registerNewUser',
                        extensions: {
                            code: "BAD_REQUEST",
                            http: {
                                status: 400,
                            },
                        }
                    });
                }

                let existingUserName = await User.findOne({ userName });

                if (existingUserName) {
                    throw new GraphQLError('Username is already taken!', {
                        path: 'registerNewUser',
                        extensions: {
                            code: "BAD_REQUEST",
                            http: {
                                status: 400,
                            },
                        }
                    });
                }

                if (password.length < 8) {
                    throw new GraphQLError('Password must be at least 8 characters long!', {
                        path: 'registerNewUser',
                        extensions: {
                            code: "BAD_REQUEST",
                            http: {
                                status: 400,
                            },
                        }
                    });
                }

                const hashedPassword = await encryptPassword(password);

                let newUser = await User.create({
                    userName,
                    email,
                    password: hashedPassword,
                });

                await newUser.save();

                let token = await createToken({
                    userId: newUser._id,
                    email: newUser.email,
                });

                return {
                    id: newUser._id,
                    ...newUser._doc,
                    token,
                };
            } catch (error) {
                throw new GraphQLError(error.message, {
                    path: 'registerNewUser',
                    extensions: error.extensions
                });
            }
        },
        loginUser: async (_, args) => {
            try {
                let { email, password } = args.userLogin;

                let user = await User.findOne({ email });

                if (!user) {
                    throw new GraphQLError('Email not registered!', {
                        path: 'loginUser',
                        extensions: {
                            code: "BAD_REQUEST",
                            http: {
                                status: 400,
                            },
                        }
                    });
                }

                let isValidPassword = await comparePassword(password, user.password);

                if (!isValidPassword) {
                    throw new GraphQLError('Incorrect password!', {
                        path: 'loginUser',
                        extensions: {
                            code: "BAD_REQUEST",
                            http: {
                                status: 400,
                            },
                        }
                    });
                }

                let token = await createToken({
                    userId: user._id,
                    email: user.email,
                });

                return {
                    id: user._id,
                    ...user._doc,
                    token,
                };
            } catch (error) {
                throw new GraphQLError(error.message, {
                    path: 'loginUser',
                    extensions: error.extensions
                });
            }
        },
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
        addReview: async (_, args, context) => {
            try {
                let { userId } = context.user;

                if (!userId) {
                    throw new GraphQLError('User not authenticated!', {
                        path: 'addReview',
                        extensions: {
                            code: "UNAUTHORIZED",
                            http: {
                                status: 401,
                            },
                        }
                    });
                }

                let { gameId, review } = args;

                let newReview = await Review.create({
                    title: review.title,
                    content: review.content,
                    rating: review.rating,
                    gameId: gameId,
                    userId: userId,
                });

                await newReview.save();

                return newReview;
            } catch (error) {
                throw new GraphQLError(error.message, {
                    path: 'addReview',
                    extensions: error.extensions,
                });
            }
        },
        updateReview: async (_, args) => {
            try {
                let { userId } = context.user;

                if (!userId) {
                    throw new GraphQLError('User not authenticated!', {
                        path: 'updateReview',
                        extensions: {
                            code: "UNAUTHORIZED",
                            http: {
                                status: 401,
                            },
                        }
                    });
                }

                let { id, review } = args;

                let editParams = {};

                if (review.content) {
                    editParams.content = review.content;
                }

                if (review.rating) {
                    editParams.rating = review.rating;
                }

                let updatedReview = await Review.findByIdAndUpdate(id, {
                    ...editParams,
                    updatedAt: new Date().toISOString()
                }, { new: true });

                if (updatedReview === undefined || updatedReview === null) {
                    throw new GraphQLError(`Review not found!`, {
                        path: 'updateReview',
                        extensions: {
                            code: "NOT_FOUND",
                            http: {
                                status: 401,
                            },
                        }
                    });
                }

                return updatedReview;
            } catch (error) {
                throw new GraphQLError(error.message, {
                    path: 'updateReview',
                    extensions: error.extensions
                });
            }
        },
    },
    Game: {
        reviews: async (parent) => {
            try {
                let reviews = Review.find({ gameId: parent._id });

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
        }
    },
    Review: {
        game: async (parent) => {
            try {
                let game = await Game.findById(parent.gameId);

                if (game === undefined || game === null) {
                    return null;
                }

                return game;
            } catch (error) {
                throw new GraphQLError('Error fetching game', {
                    path: 'review.game',
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
        user: async (parent) => {
            try {
                let user = await User.findById(parent.userId);

                if (user === undefined || user === null) {
                    return null;
                }

                return user;
            } catch (error) {
                throw new GraphQLError('Error fetching user', {
                    path: 'review.user',
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
    },
};
