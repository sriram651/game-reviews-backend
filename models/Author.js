import { Schema } from "mongoose";

const authorSchema = new Schema({
    name: String,
    verified: Boolean,
});

export default model("Author", authorSchema);