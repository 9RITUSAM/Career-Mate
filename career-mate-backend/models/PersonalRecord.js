import mongoose from "mongoose";

const PersonalRecordSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  attendance: {
    // store as percentage number or an array/object if needed; we'll use a simple number for overall attendance
    percentage: { type: Number, default: 0 },
    history: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  cgpa: {
    current: { type: Number, default: 0 },
    history: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  notes: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("PersonalRecord", PersonalRecordSchema);
