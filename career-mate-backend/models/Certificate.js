import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  provider: String, // 'manual' | 'udemy' | 'coursera'
  fileUrl: String,
  fileName: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Certificate", CertificateSchema);

