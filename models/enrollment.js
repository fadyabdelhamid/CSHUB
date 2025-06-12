import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    resource_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Enrollment = mongoose.model("enrollment", enrollmentSchema);

export default Enrollment;