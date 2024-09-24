import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    title: String,
    content: String,
    rating: Number,
    reviewerId: String,
    gameId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("Review", reviewSchema);