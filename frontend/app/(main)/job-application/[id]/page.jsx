"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function JobApplicationPage({ params }) {
  const router = useRouter();
  const { user } = useUser();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    portfolio: "",
    linkedin: "",
    github: "",
    availability: "",
    expectedSalary: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically send the application to your backend
      // const response = await fetch("/api/job-applications", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...formData, jobId: id, userId: user?.id }),
      // });

      // For now, just show success and redirect
      alert("Application submitted successfully!");
      router.push("/skill-gap"); // Redirect back to jobs page
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sky-900 mb-4">Please Sign In</h2>
          <p className="text-sky-700">You need to be signed in to apply for jobs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-sky-200">
        <h2 className="text-3xl font-bold text-center text-sky-900 mb-8">
          Job Application Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-sky-800 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g., ₹25,000/month"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-sky-800 mb-4">Professional Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://your-portfolio.com"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/your-username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Immediately, 2 weeks notice"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-sky-800 mb-4">Documents</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
              <p className="mt-1 text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows={5}
                placeholder="Write a brief cover letter explaining why you're a good fit for this position..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="bg-sky-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-colors shadow-md"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}