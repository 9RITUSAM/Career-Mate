import { NextApiRequest, NextApiResponse } from "next";

// In-memory storage for fallback (use a database in production)
let studentStats = {};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET": {
      const { studentId } = req.query;
      if (!studentId || !studentStats[studentId]) {
        return res.status(404).json({ message: "No data found for this student." });
      }
      return res.status(200).json(studentStats[studentId]);
    }

    case "POST": {
      const { studentId, cgpaScores, attendanceRecords } = req.body;
      if (!studentId || !cgpaScores || !attendanceRecords) {
        return res.status(400).json({ message: "Invalid data." });
      }
      studentStats[studentId] = { cgpaScores, attendanceRecords };
      return res.status(200).json({ message: "Data saved successfully." });
    }

    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${method} not allowed.` });
    }
  }
}