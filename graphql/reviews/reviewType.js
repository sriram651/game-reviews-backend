export const reviewType = `#graphql
    type Review {
        _id: ID!
        rating: Float!
        content: String!
        upVotes: Int!
        downVotes: Int!
        score: Int!
        voters: [ReviewVoter!]
        game: Game
        user: User
        userVoteDetails: UserVoteDetails!
        createdAt: String!
    }
    type ReviewVoter {
        userId: ID!
        voteType: VoteType!
    }
    type UserVoteDetails {
        isVoted: Boolean!
        isDownVoted: Boolean!
        isUpVoted: Boolean!
    }

    enum VoteType {
        UP
        DOWN
    }

    input NewReviewInput {
        rating: Float!
        content: String!
    }

    input UpdateReviewInput {
        rating: Float
        content: String
    }
`;

export const reviewQueries = `#graphql
    reviews: [Review]
    reviewById(id: ID!): Review
    getReviewsByUser: [Review]
`;

export const reviewMutations = `#graphql
    addReview(gameId: ID! review: NewReviewInput!): Review
    updateReview(id: ID!, review: UpdateReviewInput!): Review
    upVoteReview(reviewId: ID!): Boolean!
    downVoteReview(reviewId: ID!): Boolean!
`;