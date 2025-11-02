import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadManual,
  getCertificates,
  importUdemy,
  importCoursera,
} from "../controllers/certController.js";

const router = express.Router();

router.post("/upload-manual", upload.single("file"), uploadManual);
router.get("/list", getCertificates);
router.post("/import/udemy", importUdemy);
router.post("/import/coursera", importCoursera);

export default router;
