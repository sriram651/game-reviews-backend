import { authMutations } from "./auth/authType.js";
import { gameMutations } from "./games/gameType.js";
import { reviewMutations } from "./reviews/reviewType.js";
import { userMutations } from "./users/userType.js";

export const mutations = `#graphql
    type Mutation {
        ${authMutations}
        ${userMutations}
        ${gameMutations}
        ${reviewMutations}
    }
`;