import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    // store Clerk user id (frontend sends userId)
    userId: { type: String, required: true, index: true },
    dueDate: { type: Date }, // optional
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
