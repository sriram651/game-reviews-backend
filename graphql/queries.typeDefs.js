import { gameQueries } from "./games/gameType.js";
import { reviewQueries } from "./reviews/reviewType.js";

export const queries = `#graphql
    type Query {
        ${gameQueries}
        ${reviewQueries}
    }
`;