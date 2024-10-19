import { userMutations } from './users/userResolvers.js';
import { authMutations, authQueries } from './auth/authResolvers.js';
import { gameMutations, gameNestedQueries, gameQueries } from './games/gameResolvers.js';
import { reviewMutations, reviewNestedQueries, reviewQueries } from './reviews/reviewResolvers.js';

export const resolvers = {
    Query: {
        ...authQueries,
        ...gameQueries,
        ...reviewQueries,
    },
    Mutation: {
        ...userMutations,
        ...authMutations,
        ...gameMutations,
        ...reviewMutations,
    },
    ...gameNestedQueries,
    ...reviewNestedQueries,
};
