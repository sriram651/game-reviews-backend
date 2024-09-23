import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    name: String,
    platform: [String]
});

export default model("Game", gameSchema);