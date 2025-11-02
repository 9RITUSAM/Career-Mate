"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast, Toaster } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/personal-records` : "http://localhost:5000/api/personal-records";

export default function PersonalRecordPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [attendance, setAttendance] = useState(0);
  const [cgpa, setCgpa] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const res = await axios.get(`${API_BASE}?clerkId=${user.id}`);
        if (res.data && res.data._id) {
          if (res.data.attendance?.percentage !== undefined) setAttendance(res.data.attendance.percentage);
          if (res.data.cgpa?.current !== undefined) setCgpa(res.data.cgpa.current);
          if (res.data.notes) setNotes(res.data.notes);
        }
      } catch (err) {
        console.error("Failed to load personal record:", err);
      }
    };
    fetchRecord();
  }, [isLoaded, isSignedIn, user]);

  const saveRecord = async () => {
    if (!isSignedIn) return toast.error("Please sign in to save your record");
    setLoading(true);
    try {
      const res = await axios.post(API_BASE, {
        clerkId: user.id,
        attendance: Number(attendance),
        cgpa: Number(cgpa),
        notes,
      });
      toast.success("Personal record saved");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save personal record");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="p-6">Loading...</div>;
  if (!isSignedIn) return <div className="p-6">Please sign in to access personal records.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Toaster position="top-center" richColors />
      <h1 className="text-2xl font-bold mb-4">Personal Record</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Attendance (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CGPA</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full border rounded-md p-2" rows={3} />
        </div>
        <div className="flex justify-end">
          <button onClick={saveRecord} disabled={loading} className="bg-sky-600 text-white px-4 py-2 rounded-md">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
