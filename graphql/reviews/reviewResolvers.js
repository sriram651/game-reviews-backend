import { GraphQLError } from "graphql";
import Review from "../../models/Review.js";
import { voteReview } from "../../utils/reviews.js";
import User from "../../models/User.js";
import Game from "../../models/Game.js";

const reviews = async () => {
    try {
        let reviews = await Review.aggregate([
            {
                $sort: {
                    score: -1,
                    upVotes: -1,
                    createdAt: -1
                }
            }
        ]);

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
};

const reviewById = async (_, args) => {
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
};

const getReviewsByUser = async (_, args, context) => {
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
};

const addReview = async (_, args, context) => {
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
};

const updateReview = async (_, args) => {
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
};

const upVoteReview = async (_, args, context) => {
    try {
        let { userId } = context.user;

        if (!userId) {
            throw new GraphQLError('User not authenticated!', {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        let { reviewId } = args;

        let isVoted = await voteReview("UP", reviewId, userId);

        return isVoted;
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'upVoteReview',
            extensions: error.extensions
        });
    }
};

const downVoteReview = async (_, args, context) => {
    try {
        let { userId } = context.user;

        if (!userId) {
            throw new GraphQLError('User not authenticated!', {
                extensions: {
                    code: "UNAUTHENTICATED",
                    http: {
                        status: 401,
                    },
                }
            });
        }

        let { reviewId } = args;

        let isVoted = await voteReview("DOWN", reviewId, userId);

        return isVoted;
    } catch (error) {
        throw new GraphQLError(error.message, {
            path: 'downVoteReview',
            extensions: error.extensions
        });
    }
};

export const reviewQueries = {
    reviews,
    reviewById,
    getReviewsByUser,
};

export const reviewMutations = {
    addReview,
    updateReview,
    upVoteReview,
    downVoteReview,
};

export const reviewNestedQueries = {
    Review: {
        userVoteDetails: async (parent, _, { user }) => {
            if (!user) {
                return false;
            }

            const { userId } = user;

            let isVoted = parent.voters.some((voter) => voter.userId === userId);
            let voteType = parent.voters.find((voter) => voter.userId === userId)?.voteType;

            let isDownVoted = isVoted && voteType === "DOWN";
            let isUpVoted = isVoted && voteType === "UP";

            return {
                isVoted,
                isDownVoted,
                isUpVoted
            };
        },
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