
import Document from "../models/documents.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(path.resolve(), 'uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize the original filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + sanitizedName);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
});

export const getDocuments = async (req, res) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) {
      return res.status(400).json({ message: "Clerk ID is required" });
    }
    
    const documents = await Document.find({ clerkId })
      .sort({ updatedAt: -1 });
    
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { clerkId } = req.query;
    
    const document = await Document.findOne({ _id: id, clerkId });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    
    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    // Check if the request contains a file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if form data is present
    if (!req.body) {
      return res.status(400).json({ message: "Form data is missing" });
    }

    // Extract and validate required fields
    const title = req.body.title?.trim();
    const clerkId = req.body.clerkId;
    const category = req.body.category || 'other';
    const description = req.body.description?.trim() || '';

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!clerkId) {
      return res.status(400).json({ message: "Clerk ID is required" });
    }

    // Create new document
    const newDocument = new Document({
      title,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      fileSize: req.file.size,
      category,
      description,
      clerkId
    });

    // Save document
    const savedDocument = await newDocument.save();
    
    // Send success response
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    
    // Handle specific error cases
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation Error", 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Handle multer errors
    if (error.name === 'MulterError') {
      return res.status(400).json({ 
        message: error.message,
        code: error.code
      });
    }
    
    // Handle general errors
    res.status(500).json({ 
      message: "Error creating document",
      details: error.message
    });
  }
};


export const updateDocument = async (req, res) => {
  try {
    const updatedDoc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoc) return res.status(404).json({ message: "Document not found" });
    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteDocument = async (req, res) => {
  try {
    const deletedDoc = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

