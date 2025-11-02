// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import documentRoutes from "./routes/documentRoutes.js";
import news from "./routes/news.js";
import hackathons from "./routes/hackathons.js";
import taskRoutes from "./routes/taskRoutes.js";
import academics from "./routes/academics.js";
import userRoutes from "./routes/userRoutes.js";
import certificateRoutes from "./routes/certificates.js";
import personalRecords from "./routes/personalRecords.js";
import skillGapRoutes from "./routes/skill-gap.js";
import studentStats from './routes/student-stats.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Create uploads directory if it doesn't exist
import { promises as fs } from 'fs';
try {
  await fs.access('uploads');
} catch {
  await fs.mkdir('uploads', { recursive: true });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/tech-news", news); // Changed to match frontend expectation
app.use("/api/documents", documentRoutes);
app.use("/api/hackathons", hackathons);
app.use("/api/tasks", taskRoutes);
app.use("/api/academics", academics);
app.use("/api/users", userRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/personal-records", personalRecords);
// app.use("/api/skillgap", skillGapRoutes);
app.use('/api/student-stats', studentStats)

// Health Check
app.get("/", (req, res) => res.send("Career-Mate backend is running 🚀"));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
