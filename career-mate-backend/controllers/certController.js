import Certificate from "../models/Certificate.js";
import fs from "fs";
import path from "path";
import axios from "axios";

// Manual PDF upload
export const uploadManual = async (req, res) => {
  try {
    const { clerkId } = req.body;
    if (!clerkId) return res.status(400).json({ message: "User ID is required" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = `/uploads/${req.file.filename}`;

    const cert = await Certificate.create({
      userId: clerkId,
      title: req.file.originalname.replace(/\.pdf$/i, ''),
      provider: "manual",
      fileUrl,
      fileName: req.file.originalname,
      verified: true,
      issuedDate: new Date(),
    });

    res.json(cert);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: "Failed to upload certificate" });
  }
};

// Get all certificates
export const getCertificates = async (req, res) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const certs = await Certificate.find({ userId: clerkId })
      .sort({ issuedDate: -1, createdAt: -1 })
      .select('-__v');
      
    res.json(certs);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

// Import Udemy certificates
export const importUdemy = async (req, res) => {
  try {
    const { clerkId, accessToken } = req.body;
    if (!clerkId || !accessToken) {
      return res.status(400).json({ message: "User ID and access token are required" });
    }

    // Call Udemy API
    const response = await axios.get('https://www.udemy.com/api-2.0/users/me/certificates', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const certificates = response.data.results;
    const importedCerts = [];

    for (const cert of certificates) {
      const existing = await Certificate.findOne({
        userId: clerkId,
        provider: 'udemy',
        'metadata.courseId': cert.course_id
      });

      if (!existing) {
        const newCert = await Certificate.create({
          userId: clerkId,
          title: cert.course_title,
          provider: 'udemy',
          fileUrl: cert.certificate_url,
          issuedDate: new Date(cert.created),
          verified: true,
          metadata: {
            courseId: cert.course_id,
            courseUrl: cert.course_url,
          }
        });
        importedCerts.push(newCert);
      }
    }

    res.json({
      imported: importedCerts.length,
      data: importedCerts
    });
  } catch (err) {
    console.error('Udemy import error:', err);
    res.status(err.response?.status === 401 ? 401 : 500).json({
      message: err.response?.status === 401 
        ? "Invalid Udemy access token"
        : "Failed to import Udemy certificates"
    });
  }
};

// Import Coursera certificates
export const importCoursera = async (req, res) => {
  try {
    const { clerkId, accessToken } = req.body;
    if (!clerkId || !accessToken) {
      return res.status(400).json({ message: "User ID and access token are required" });
    }

    // Call Coursera API
    const response = await axios.get('https://api.coursera.org/api/accomplishments.v1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const certificates = response.data.elements;
    const importedCerts = [];

    for (const cert of certificates) {
      const existing = await Certificate.findOne({
        userId: clerkId,
        provider: 'coursera',
        'metadata.courseId': cert.courseId
      });

      if (!existing) {
        const newCert = await Certificate.create({
          userId: clerkId,
          title: cert.courseInfo.name,
          provider: 'coursera',
          fileUrl: cert.certificateUrl,
          issuedDate: new Date(cert.completionDate),
          verified: true,
          metadata: {
            courseId: cert.courseId,
            specialization: cert.specializationInfo?.name,
            grade: cert.grade
          }
        });
        importedCerts.push(newCert);
      }
    }

    res.json({
      imported: importedCerts.length,
      data: importedCerts
    });
  } catch (err) {
    console.error('Coursera import error:', err);
    res.status(err.response?.status === 401 ? 401 : 500).json({
      message: err.response?.status === 401 
        ? "Invalid Coursera access token"
        : "Failed to import Coursera certificates"
    });
  }
};
