import PersonalRecord from "../models/PersonalRecord.js";

export const getPersonalRecord = async (req, res) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) return res.status(400).json({ message: "Missing clerkId" });

    const record = await PersonalRecord.findOne({ clerkId });
    if (!record) return res.json({});
    return res.json(record);
  } catch (err) {
    console.error("getPersonalRecord error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createOrUpdatePersonalRecord = async (req, res) => {
  try {
    const { clerkId, attendance, cgpa, notes } = req.body;
    if (!clerkId) return res.status(400).json({ message: "Missing clerkId" });

    const update = {
      updatedAt: new Date(),
    };

    if (attendance !== undefined) {
      if (typeof attendance === "number") {
        update['attendance.percentage'] = attendance;
      } else if (attendance && attendance.percentage !== undefined) {
        update['attendance.percentage'] = attendance.percentage;
      }
      // optionally add to history
      update['$push'] = update['$push'] || {};
      update['$push']['attendance.history'] = { value: update['attendance.percentage'], date: new Date() };
    }

    if (cgpa !== undefined) {
      if (typeof cgpa === "number") {
        update['cgpa.current'] = cgpa;
      } else if (cgpa && cgpa.current !== undefined) {
        update['cgpa.current'] = cgpa.current;
      }
      update['$push'] = update['$push'] || {};
      update['$push']['cgpa.history'] = { value: update['cgpa.current'], date: new Date() };
    }

    if (notes !== undefined) {
      update.notes = notes;
    }

    const record = await PersonalRecord.findOneAndUpdate(
      { clerkId },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(record);
  } catch (err) {
    console.error("createOrUpdatePersonalRecord error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
