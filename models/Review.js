import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    title: String,
    content: String,
    rating: Number,
    userId: String,
    gameId: String,
    upVotes: { 
        type: Number, 
        default: 0 
    },
    downVotes: { 
        type: Number, 
        default: 0 
    },
    voters: [
        { 
            userId: String, 
            voteType: String 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default model("Review", reviewSchema);