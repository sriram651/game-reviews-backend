import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    title: String,
    content: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("Review", reviewSchema);