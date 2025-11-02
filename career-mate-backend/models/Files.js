import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("File", fileSchema);
