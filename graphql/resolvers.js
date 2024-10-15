import { GraphQLError } from 'graphql';
import Game from '../models/Game.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { userMutations } from './users/userResolvers.js';
import { authMutations } from './auth/authResolvers.js';
import { gameMutations, gameQueries } from './games/gameResolvers.js';
import { reviewMutations, reviewQueries } from './reviews/reviewResolvers.js';

export const resolvers = {
    Query: {
        ...gameQueries,
        ...reviewQueries,
    },
    Mutation: {
        ...userMutations,
        ...authMutations,
        ...gameMutations,
        ...reviewMutations,
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
