import { authTypes } from "./auth/authType.js";
import { gameType } from "./games/gameType.js";
import { mutations } from "./mutations.typeDefs.js";
import { queries } from "./queries.typeDefs.js";
import { reviewType } from "./reviews/reviewType.js";
import { userType } from "./users/userType.js";

export const typeDefs = `#graphql
    ${authTypes}
    ${userType}
    ${gameType}
    ${reviewType}
    ${queries}
    ${mutations}
`;