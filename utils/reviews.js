import { GraphQLError } from "graphql";
import Review from "../models/Review.js";

export async function voteReview(type = "UP", reviewId, userId) {
    try {
        let review = await Review.findById(reviewId);

        if (!review) {
            throw new GraphQLError("Review not found", {
                extensions: {
                    code: "NOT_FOUND",
                    http: {
                        status: 404
                    }
                }
            });
        }

        let vote = review.voters.find(voter => voter.userId === userId);

        // User has already voted
        if (vote) {

            // User chooses to undo the vote
            if (vote.voteType === type) {
                review.voters = review.voters.filter(voter => voter.userId !== userId);
                if (type === "UP") {
                    review.upVotes -= 1;
                    review.score -= 2;
                } else {
                    review.downVotes -= 1;
                    review.score += 1;
                }
            }

            // User changes vote
            else {
                if (type === "UP") {
                    review.upVotes += 1;
                    review.downVotes -= 1;
                    review.score += 3;
                } else {
                    review.downVotes += 1;
                    review.upVotes -= 1;
                    review.score -= 3;
                }

                vote.voteType = type;
            }

            await review.save();
            
            return true;
        }

        // User has not voted
        if (type === "UP") {
            review.upVotes += 1;
            review.score += 2;
        } else {
            review.downVotes += 1;
            review.score -= 1;
        }

        // Add user to voters list
        review.voters.push({ userId, voteType: type });

        await review.save();

        return true;
    } catch (error) {
        throw new GraphQLError(error);
    }
}