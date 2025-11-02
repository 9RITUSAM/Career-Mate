import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Schema for skill gap data
const skillGapSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  cgpaScores: [{
    semester: Number,
    cgpa: Number
  }],
  attendanceRecords: [{
    subject: String,
    percentage: Number
  }],
  careerInterest: String,
  updatedAt: { type: Date, default: Date.now }
});

// Create model if it doesn't exist
const SkillGap = mongoose.models.SkillGap || mongoose.model('SkillGap', skillGapSchema);

// Get skill gap data for a student
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const skillGapData = await SkillGap.findOne({ studentId });
    
    if (!skillGapData) {
      return res.status(200).json({
        cgpaScores: [{ semester: 1, cgpa: "" }],
        attendanceRecords: [{ subject: "", percentage: "" }],
        careerInterest: ""
      });
    }
    
    res.status(200).json(skillGapData);
  } catch (error) {
    console.error('Error fetching skill gap data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update skill gap data
router.post('/update', async (req, res) => {
  try {
    const { studentId, cgpaScores, attendanceRecords, careerInterest } = req.body;

    const updatedData = await SkillGap.findOneAndUpdate(
      { studentId },
      {
        cgpaScores,
        attendanceRecords,
        careerInterest,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error updating skill gap data:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;