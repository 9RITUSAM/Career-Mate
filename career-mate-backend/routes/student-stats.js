import express from "express";
import SkillGap from '../models/StudentStats.js'

const router = express.Router();

/**
 * @route   GET /api/skillgap/:studentId
 * @desc    Get skill gap data for a student
 */
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const record = await SkillGap.findOne({ studentId });

    if (!record) {
      return res.status(404).json({ message: "No record found for this student." });
    }

    res.status(200).json(record);
  } catch (err) {
    console.error("Error fetching skill gap data:", err);
    res.status(500).json({ message: "Server error fetching skill gap data." });
  }
});

/**
 * @route   POST /api/student-stats
 * @desc    Create or update a student's skill gap data
 */
router.post("/", async (req, res) => {
  try {
    const { studentId, cgpaScores, attendanceRecords, careerInterest } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // Upsert (create or update)
    const updatedData = await SkillGap.findOneAndUpdate(
      { studentId },
      {
        $set: {
          cgpaScores,
          attendanceRecords,
          careerInterest,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Skill gap data saved successfully.",
      data: updatedData,
    });
  } catch (err) {
    console.error("Error saving skill gap data:", err);
    res.status(500).json({ message: "Server error saving skill gap data." });
  }
});

/**
 * @route   PUT /api/skillgap/:studentId
 * @desc    Update existing skill gap data
 */
router.put("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const update = req.body;

    const updated = await SkillGap.findOneAndUpdate({ studentId }, update, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Record not found for update." });
    }

    res.status(200).json({
      message: "Skill gap data updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating skill gap data:", err);
    res.status(500).json({ message: "Server error updating skill gap data." });
  }
});

/**
 * @route   DELETE /api/skillgap/:studentId
 * @desc    Delete a student's skill gap data
 */
router.delete("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const deleted = await SkillGap.findOneAndDelete({ studentId });

    if (!deleted) {
      return res.status(404).json({ message: "No record found to delete." });
    }

    res.status(200).json({ message: "Skill gap data deleted successfully." });
  } catch (err) {
    console.error("Error deleting skill gap data:", err);
    res.status(500).json({ message: "Server error deleting skill gap data." });
  }
});

export default router;
