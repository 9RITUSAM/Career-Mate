import express from "express";
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  upload
} from "../controllers/documentController.js";

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.post("/", upload.single('file'), handleMulterError, createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
