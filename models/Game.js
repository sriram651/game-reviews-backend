import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    title: String,
    platform: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("Game", gameSchema);