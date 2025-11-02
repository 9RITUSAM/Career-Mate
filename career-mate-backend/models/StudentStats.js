import mongoose from "mongoose";

const cgpaSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
});

const attendanceSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const skillGapSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true, // assuming one record per student
    },
    cgpaScores: {
      type: [cgpaSchema],
      default: [],
    },
    attendanceRecords: {
      type: [attendanceSchema],
      default: [],
    },
    careerInterest: {
      type: String,
      enum: ["Web Development", "Data Science", "AI / ML", "Cybersecurity", ""],
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.SkillGap || mongoose.model("SkillGap", skillGapSchema);
