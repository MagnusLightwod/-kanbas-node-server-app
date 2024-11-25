import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema);
export default model;

 // use this to get data from the mongoose data base, use "model" to access the data using mongo commands similar to our old ones