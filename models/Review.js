import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    title: String,
    content: String,
    rating: Number,
});

export default model("Review", reviewSchema);