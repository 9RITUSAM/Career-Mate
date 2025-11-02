import express from "express";
import Folder from "../models/Folder.js";
import File from "../models/File.js";

const router = express.Router();


// 📁 Create a new folder
router.post("/folders", async (req, res) => {
  try {
    const { studentId, name } = req.body;
    if (!studentId || !name) return res.status(400).json({ error: "Missing data" });

    const folder = new Folder({ studentId, name });
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📁 Get all folders for a student
router.get("/folders/:studentId", async (req, res) => {
  try {
    const folders = await Folder.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📄 Add file inside a folder
router.post("/folders/:folderId/files", async (req, res) => {
  try {
    const { name, subject, fileUrl } = req.body;
    if (!name || !fileUrl) return res.status(400).json({ error: "Missing file data" });

    const file = new File({
      folderId: req.params.folderId,
      name,
      subject,
      fileUrl,
    });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📂 Get all files of a folder
router.get("/folders/:folderId/files", async (req, res) => {
  try {
    const files = await File.find({ folderId: req.params.folderId }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ Delete folder and its files
router.delete("/folders/:folderId", async (req, res) => {
  try {
    await File.deleteMany({ folderId: req.params.folderId });
    await Folder.findByIdAndDelete(req.params.folderId);
    res.json({ message: "Folder and files deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ Delete a specific file
router.delete("/files/:fileId", async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.fileId);
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
