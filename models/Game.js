import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    title: String,
    platform: [String]
});

export default model("Game", gameSchema);