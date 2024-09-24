import { model, Schema } from "mongoose";

const authorSchema = new Schema({
    name: String,
    verified: Boolean,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default model("Author", authorSchema);