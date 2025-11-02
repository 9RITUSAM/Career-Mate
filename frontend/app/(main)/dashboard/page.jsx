"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import TechNews from "./Tech";

const API_URL = "http://localhost:5000";

const Dashboard = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [cgpaData, setCgpaData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [careerInterest, setCareerInterest] = useState("");
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        const userId = user.id;

        
        const [tasksRes, studentStatsRes, newsRes, hackRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/tasks/${userId}`),
          fetch(`${API_URL}/api/student-stats/${userId}`),
          fetch(`${API_URL}/api/tech-news`),
          fetch(`${API_URL}/api/hackathons`),
        ]);

       
        if (tasksRes.status === "fulfilled") {
          const taskData = await tasksRes.value.json();
          setTasks(Array.isArray(taskData) ? taskData : []);
        }

        
        if (studentStatsRes.status === "fulfilled" && studentStatsRes.value.ok) {
          const statsData = await studentStatsRes.value.json();
          
          
          if (statsData.cgpaScores && Array.isArray(statsData.cgpaScores)) {
            const formattedCgpa = statsData.cgpaScores.map((item) => ({
              semester: `Sem ${item.semester}`,
              cgpa: item.cgpa,
            }));
            setCgpaData(formattedCgpa);
          }

          
          if (statsData.attendanceRecords && Array.isArray(statsData.attendanceRecords)) {
            const formattedAttendance = statsData.attendanceRecords.map((item) => ({
              subject: item.subject,
              percentage: item.percentage,
            }));
            setAttendanceData(formattedAttendance);
          }

          
          if (statsData.careerInterest) {
            setCareerInterest(statsData.careerInterest);
          }
        }

        
        if (newsRes.status === "fulfilled") {
          const newsData = await newsRes.value.json();
          setTechNews(Array.isArray(newsData) ? newsData : []);
        }

        
        if (hackRes.status === "fulfilled") {
          const hackData = await hackRes.value.json();
          setHackathons(Array.isArray(hackData) ? hackData : []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isLoaded, isSignedIn, user]);

  
  const addTask = async () => {
    if (!newTask.trim() || !isSignedIn) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newTask, userId: user.id }),
      });
      const savedTask = await res.json();
      setTasks([...tasks, savedTask]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

 
  const markComplete = async (_id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${_id}/complete`, {
        method: "PATCH",
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === _id ? updated : t)));
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };

  
  const deleteTask = async (_id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${_id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t._id !== _id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  
  const averageCgpa = cgpaData.length > 0
    ? (cgpaData.reduce((sum, item) => sum + item.cgpa, 0) / cgpaData.length).toFixed(2)
    : "N/A";

 
  const averageAttendance = attendanceData.length > 0
    ? (attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length).toFixed(1)
    : "N/A";

 
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br g-black">
        <div className="text-white text-xl">Loading dashboard...🤞</div>
      </div>
    );
  }

  
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sky-800 to-sky-600 text-white">
        <h2 className="text-2xl mb-4">You're not logged in 😅</h2>
        <p className="text-lg text-center">
          Please sign in with Clerk to access your personalized dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-blue-300 p-6 space-y-8 font-sans">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-black tracking-wider drop-shadow-lg ">
           Welcome, {user.firstName || "User"} 
        </h1>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4">
            <div className="text-sm text-black font-medium">Average CGPA</div>
            <div className="text-3xl font-bold text-sky-700 mt-1">{averageCgpa}</div>
            <div className="text-xs text-black mt-1">out of 10.0</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4">
            <div className="text-sm text-black font-medium">Avg Attendance</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{averageAttendance}%</div>
            <div className="text-xs text-black mt-1">across all subjects</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4">
            <div className="text-sm text-black font-medium">Career Interest</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {careerInterest || "Not Set"}
            </div>
            <div className="text-xs text-black mt-1">your focus area</div>
          </div>
        </div>
      </div>

      {/* To-Do List */}
      <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
        <h2 className="text-2xl font-bold mb-4 text-blue-500">📝 To-Do List</h2>
        <div className="flex gap-3 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            className="border border-gray-300 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-400 text-white"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTask}
            className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-xl font-semibold transition duration-300"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.length === 0 ? (
            <li className="text-gray-500 italic text-center py-4">
              No tasks yet. Add your first task!
            </li>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                className={`flex justify-between items-center p-3 rounded-xl transition duration-300 ${
                  task.status === "completed"
                    ? "bg-blue-600 line-through text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-gray-800"
                }`}
              >
                <span className="flex-1">{task.description}</span>
                <div className="flex gap-2">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => markComplete(task._id)}
                      className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-xl transition duration-300"
                      title="Mark as complete"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-xl transition duration-300"
                    title="Delete task"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">🎓 CGPA Performance</h2>
          {cgpaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cgpaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="semester" 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  domain={[0, 10]} 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cgpa" 
                  stroke="#0284c7" 
                  strokeWidth={3}
                  dot={{ fill: '#0284c7', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No CGPA data available. Add your scores in the Skill Gap section.
            </div>
          )}
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">📊 Attendance by Subject</h2>
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="subject" 
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="#0ea5e9"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No attendance data available. Add your records in the Skill Gap section.
            </div>
          )}
        </div>
      </div>

      
      <div className="space-y-6">
        <TechNews />
      </div>

      
      <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-500">🏆 Latest Hackathons</h2>
          <span className="text-sm text-gray-500">Showing latest opportunities</span>
        </div>
        <div className="space-y-4">
          {hackathons.length === 0 ? (
            <div className="text-gray-500 italic text-center py-8">
              Loading hackathons...
            </div>
          ) : (
            hackathons.map((hack, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-sky-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{hack.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{hack.description}</p>
                  </div>
                  {hack.daysUntil !== undefined && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
                        hack.daysUntil <= 7
                          ? "bg-red-100 text-red-800"
                          : hack.daysUntil <= 14
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {hack.daysUntil === 1
                        ? "Tomorrow"
                        : hack.daysUntil === 0
                        ? "Today"
                        : `${hack.daysUntil} days left`}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {hack.date && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                      📅{" "}
                      {new Date(hack.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {hack.platform && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {hack.platform}
                    </span>
                  )}
                  {hack.prizes && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      💰 {hack.prizes}
                    </span>
                  )}
                </div>

                {hack.technologies && hack.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hack.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {hack.registrationDeadline && (
                      <>
                        Registration ends:{" "}
                        {new Date(hack.registrationDeadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={hack.registerUrl || hack.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white hover:bg-sky-700 rounded-lg text-sm font-medium transition-colors duration-200"
                      onClick={(e) => {
                        if (!hack.registerUrl && !hack.url) {
                          e.preventDefault();
                          alert("Registration link will be available soon!");
                        }
                      }}
                    >
                      Register Now →
                    </a>
                    {hack.url && (
                      <a
                        href={hack.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;