
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  clerkId: { type: String, required: true }, // Store Clerk user ID
  category: { type: String, enum: ['resume', 'certificate', 'academic', 'other'], default: 'other' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
