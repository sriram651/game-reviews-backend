import { Schema, model } from "mongoose";

const gameSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
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
    coverImage: {
        type: String,
        required: true,
    },
    genre: {
        type: [String],
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    manufacturerName: {
        type: String,
        required: true,
    },
    developer: {
        type: String,
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