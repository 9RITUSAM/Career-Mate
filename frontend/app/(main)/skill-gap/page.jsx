"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SkillGapPage = () => {
  const { user, isLoaded, isSignedIn } = useUser(); // ✅ fixed: destructured correctly

  // ✅ added missing states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [cgpaScores, setCgpaScores] = useState([{ semester: 1, cgpa: "" }]);
  const [attendance, setAttendance] = useState([{ subject: "", percentage: "" }]);
  const [careerInterest, setCareerInterest] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState([]);

  // Mock job data by category
  const jobData = {
    "Web Development": [
      {
        id: "web1",
        title: "Frontend Developer Intern",
        company: "TechNova",
        location: "Remote",
        salary: "₹25,000/month",
        skills: ["React", "JavaScript", "HTML/CSS"],
        description: "Join our team to build modern web applications using React.",
        applicationUrl: "/job-application/web1",
      },
      {
        id: "web2",
        title: "React Developer Internship",
        company: "CodeCrafters",
        location: "Bangalore",
        salary: "₹30,000/month",
        skills: ["React", "TypeScript", "Node.js"],
        description: "Work on enterprise-level React applications with modern tools.",
        applicationUrl: "/job-application/web2",
      },
      {
        id: "web3",
        title: "Web Dev Intern",
        company: "SoftLabs",
        location: "Chennai",
        salary: "₹20,000/month",
        skills: ["JavaScript", "React", "REST APIs"],
        description: "Help build and maintain client web applications.",
        applicationUrl: "/job-application/web3",
      },
    ],
    "Data Science": [
      {
        id: "data1",
        title: "Data Analyst Intern",
        company: "InnoData",
        location: "Pune",
        salary: "₹28,000/month",
        skills: ["Python", "SQL", "Data Visualization"],
        description: "Analyze large datasets and create meaningful insights.",
        applicationUrl: "/job-application/data1",
      },
      {
        id: "data2",
        title: "Machine Learning Intern",
        company: "AI Works",
        location: "Remote",
        salary: "₹35,000/month",
        skills: ["Python", "TensorFlow", "scikit-learn"],
        description: "Work on cutting-edge ML models and applications.",
        applicationUrl: "/job-application/data2",
      },
      {
        id: "data3",
        title: "Python Data Intern",
        company: "Insightify",
        location: "Hyderabad",
        salary: "₹25,000/month",
        skills: ["Python", "Pandas", "Data Analysis"],
        description: "Help process and analyze business data using Python.",
        applicationUrl: "/job-application/data3",
      },
    ],
    "AI / ML": [
      {
        id: "ai1",
        title: "AI Research Intern",
        company: "NeuraTech",
        location: "Remote",
        salary: "₹40,000/month",
        skills: ["Python", "Deep Learning", "Research"],
        description: "Research and implement state-of-the-art AI models.",
        applicationUrl: "/job-application/ai1",
      },
      {
        id: "ai2",
        title: "ML Model Developer",
        company: "VisionAI",
        location: "Delhi",
        salary: "₹35,000/month",
        skills: ["Python", "Computer Vision", "PyTorch"],
        description: "Develop computer vision models for real-world applications.",
        applicationUrl: "/job-application/ai2",
      },
      {
        id: "ai3",
        title: "Deep Learning Intern",
        company: "Brainify",
        location: "Remote",
        salary: "₹30,000/month",
        skills: ["Python", "TensorFlow", "Neural Networks"],
        description: "Build and train deep learning models for various use cases.",
        applicationUrl: "/job-application/ai3",
      },
    ],
    Cybersecurity: [
      {
        id: "sec1",
        title: "Security Analyst Intern",
        company: "SafeNet",
        location: "Noida",
        salary: "₹30,000/month",
        skills: ["Network Security", "SIEM", "Security Tools"],
        description: "Monitor and analyze security threats and incidents.",
        applicationUrl: "/job-application/sec1",
      },
      {
        id: "sec2",
        title: "Ethical Hacking Intern",
        company: "CyberCore",
        location: "Remote",
        salary: "₹35,000/month",
        skills: ["Penetration Testing", "Security Tools", "Network+"],
        description: "Conduct security assessments and penetration testing.",
        applicationUrl: "/job-application/sec2",
      },
      {
        id: "sec3",
        title: "Network Security Intern",
        company: "InfoShield",
        location: "Mumbai",
        salary: "₹28,000/month",
        skills: ["Network Security", "Firewalls", "Security Protocols"],
        description: "Help maintain and monitor network security infrastructure.",
        applicationUrl: "/job-application/sec3",
      },
    ],
  };

  // ✅ Fetch stored data
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) return;

      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/skillgap/${user.id}`);
        if (res.data) {
          setCgpaScores(res.data.cgpaScores || [{ semester: 1, cgpa: "" }]);
          setAttendance(res.data.attendanceRecords || [{ subject: "", percentage: "" }]);
          setCareerInterest(res.data.careerInterest || "");
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching skill gap data:", err);
        setError("Failed to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, user?.id]);

  // ✅ Save data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    try {
      console.log(1)
      // Save data to backend
      console.log(1)
      console.log(`${API_URL}/api/student-stats`)
      await axios.post(`${API_URL}/api/student-stats`, {
        studentId: user.id,
        cgpaScores,
        attendanceRecords: attendance,
        careerInterest,
      });

      toast.success("Data saved successfully!");

      // Emit event for real-time updates
      const event = new CustomEvent("skillGapDataUpdated", {
        detail: { cgpaScores, attendance },
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error("Error saving skill gap data:", err);
      toast.error("Failed to save your data. Falling back to localStorage.");

      // Fallback to localStorage
      localStorage.setItem("skillGapData", JSON.stringify({ cgpaScores, attendance }));
    } finally {
      setSaving(false);
    }
  };

  // ✅ Career interest change
  const handleCareerChange = (value) => {
    setCareerInterest(value);
    setJobSuggestions(jobData[value] || []);
  };

  // ✅ Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sky-800 text-xl font-semibold">
        Loading your data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 text-black p-8">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-sky-300">
        <h2 className="text-3xl font-bold mb-8 text-center text-sky-900">
          Skill Gap Analyzer
        </h2>

        {/* CGPA Section */}
        <div className="mb-10">
          <h3 className="font-semibold text-xl text-sky-800 mb-3">Semester-wise CGPA</h3>
          {cgpaScores.map((item, i) => (
            <div key={i} className="flex gap-3 mt-2">
              <input
                type="number"
                placeholder="Semester"
                value={item.semester}
                onChange={(e) => {
                  const updated = [...cgpaScores];
                  updated[i].semester = e.target.value;
                  setCgpaScores(updated);
                }}
                className="border border-sky-300 bg-sky-50 p-2 rounded-lg w-28 text-black focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="number"
                placeholder="CGPA"
                value={item.cgpa}
                onChange={(e) => {
                  const updated = [...cgpaScores];
                  updated[i].cgpa = e.target.value;
                  setCgpaScores(updated);
                }}
                className="border border-sky-300 bg-sky-50 p-2 rounded-lg w-28 text-black focus:ring-2 focus:ring-sky-400"
              />
            </div>
          ))}
          <button
            onClick={() =>
              setCgpaScores([...cgpaScores, { semester: cgpaScores.length + 1, cgpa: "" }])
            }
            className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            + Add Semester
          </button>
        </div>

        {/* Attendance Section */}
        <div className="mb-10">
          <h3 className="font-semibold text-xl text-sky-800 mb-3">Attendance Records</h3>
          {attendance.map((item, i) => (
            <div key={i} className="flex gap-3 mt-2">
              <input
                type="text"
                placeholder="Subject"
                value={item.subject}
                onChange={(e) => {
                  const updated = [...attendance];
                  updated[i].subject = e.target.value;
                  setAttendance(updated);
                }}
                className="border border-sky-300 bg-sky-50 p-2 rounded-lg w-52 text-black focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="number"
                placeholder="%"
                value={item.percentage}
                onChange={(e) => {
                  const updated = [...attendance];
                  updated[i].percentage = e.target.value;
                  setAttendance(updated);
                }}
                className="border border-sky-300 bg-sky-50 p-2 rounded-lg w-28 text-black focus:ring-2 focus:ring-sky-400"
              />
            </div>
          ))}
          <button
            onClick={() => setAttendance([...attendance, { subject: "", percentage: "" }])}
            className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            + Add Subject
          </button>
        </div>

        {/* Career Interest Section */}
        <div className="mb-10">
          <h3 className="font-semibold text-xl text-sky-800 mb-3">
            Select Your Career Interest
          </h3>
          <select
            value={careerInterest}
            onChange={(e) => handleCareerChange(e.target.value)}
            className="border border-sky-300 bg-sky-50 p-3 rounded-lg w-full text-black focus:ring-2 focus:ring-sky-400"
          >
            <option value="">-- Choose Domain --</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="AI / ML">AI / ML</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>

        {/* Job / Internship Suggestions */}
        {jobSuggestions.length > 0 && (
          <div className="mb-10">
            <h3 className="font-semibold text-xl text-sky-800 mb-4">
              Recommended Jobs & Internships
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {jobSuggestions.map((job) => (
                <div
                  key={job.id}
                  className="bg-sky-50 p-6 rounded-xl shadow-md border border-sky-200 hover:shadow-lg transition group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-sky-900 text-lg group-hover:text-sky-700">
                        {job.title}
                      </h4>
                      <p className="text-gray-700 font-medium">{job.company}</p>
                    </div>
                    <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium">
                      {job.location}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 text-sm">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-sky-100 text-sky-700 px-2 py-1 rounded-md text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">{job.salary}</span>
                    <a
                      href={job.applicationUrl}
                      className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="text-center">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition-all ${
              saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillGapPage;

