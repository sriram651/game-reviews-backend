import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    platform: {
        type: [String],
        required: true,
    },
    releasedYear: {
        type: Number,
        required: true,
    },
    genre: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default model("Game", gameSchema);