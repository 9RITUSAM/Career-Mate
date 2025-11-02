import express from "express";
import { getPersonalRecord, createOrUpdatePersonalRecord } from "../controllers/personalRecordController.js";

const router = express.Router();

// GET /api/personal-records?clerkId=...
router.get("/", getPersonalRecord);

// POST /api/personal-records  { clerkId, attendance, cgpa, notes }
router.post("/", createOrUpdatePersonalRecord);

export default router;
