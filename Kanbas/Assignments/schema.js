import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" } // Reference to CourseModel
  },
  { collection: "assignments" }
);

export default assignmentSchema;
