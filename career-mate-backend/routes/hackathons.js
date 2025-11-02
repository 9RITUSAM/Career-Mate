import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Fallback hackathon data when API is unavailable
const fallbackHackathons = [
  {
    name: "Microsoft Student Hackathon",
    date: "November 15-17, 2025",
    platform: "Virtual",
    url: "https://imaginecup.microsoft.com/",
    registerUrl: "https://imaginecup.microsoft.com/register",
    description: "Build innovative solutions using Microsoft Azure and AI services",
    prizes: "$75,000",
    registrationDeadline: "November 13, 2025",
    technologies: ["Azure", "AI/ML", "Cloud Computing", "Web Development"]
  },
  {
    name: "Google Cloud Challenge",
    date: "November 20-22, 2025",
    platform: "Hybrid",
    url: "https://cloudonair.withgoogle.com/",
    registerUrl: "https://cloudonair.withgoogle.com/register",
    description: "Create cloud-native applications with Google Cloud Platform",
    prizes: "$60,000",
    registrationDeadline: "November 18, 2025",
    technologies: ["Google Cloud", "Kubernetes", "Machine Learning"]
  },
  {
    name: "AWS GameDev Hackathon",
    date: "November 25-27, 2025",
    platform: "Virtual",
    url: "https://aws.amazon.com/gametech/",
    registerUrl: "https://aws.amazon.com/gametech/register",
    description: "Develop games using AWS services and game engines",
    prizes: "$45,000",
    registrationDeadline: "November 23, 2025",
    technologies: ["AWS", "Unity", "Unreal Engine", "Game Development"]
  },
  {
    name: "Meta XR Innovation",
    date: "December 1-3, 2025",
    platform: "Virtual",
    url: "https://www.meta.com/quest/developer",
    registerUrl: "https://www.meta.com/quest/developer/register",
    description: "Create immersive experiences for the metaverse",
    prizes: "$55,000",
    registrationDeadline: "November 29, 2025",
    technologies: ["AR/VR", "Unity", "3D Modeling", "WebXR"]
  },
  {
    name: "IBM Quantum Challenge",
    date: "December 5-7, 2025",
    platform: "Virtual",
    url: "https://quantum-computing.ibm.com/",
    registerUrl: "https://quantum-computing.ibm.com/challenges/register",
    description: "Solve real-world problems using quantum computing",
    prizes: "$65,000",
    registrationDeadline: "December 3, 2025",
    technologies: ["Quantum Computing", "Qiskit", "Python"]
  },
  {
    name: "Adobe Creative Jam",
    date: "December 10-12, 2025",
    platform: "Hybrid",
    url: "https://www.adobe.com/creative-cloud.html",
    registerUrl: "https://www.adobe.com/creative-cloud/challenges/register",
    description: "Design innovative solutions using Adobe Creative Cloud",
    prizes: "$40,000",
    registrationDeadline: "December 8, 2025",
    technologies: ["Adobe CC", "UX/UI", "Design", "Web Development"]
  },
  {
    name: "OpenAI Hackathon",
    date: "December 15-17, 2025",
    platform: "Virtual",
    url: "https://openai.com/hackathon",
    registerUrl: "https://openai.com/hackathon/register",
    description: "Build next-gen applications using GPT-4 and DALL-E",
    prizes: "$80,000",
    registrationDeadline: "December 13, 2025",
    technologies: ["GPT-4", "DALL-E", "LangChain", "AI/ML"]
  }
];

// Helper function to check if a date is in the future
const isUpcoming = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Helper function to parse and sort hackathons
const processHackathons = (hackathons) => {
  return hackathons
    .filter(hack => isUpcoming(hack.date)) // Only future hackathons
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
    .map(hack => ({
      ...hack,
      daysUntil: Math.ceil((new Date(hack.date) - new Date()) / (1000 * 60 * 60 * 24))
    }))
    .slice(0, 7); // Show 7 upcoming hackathons
};

router.get("/", async (req, res) => {
  try {
    // Try to fetch from Devpost API (replace with actual API when available)
    const response = await fetch("https://devpost.com/api/hackathons/upcoming", {
      headers: {
        'Accept': 'application/json'
      }
    }).catch(() => null);

    if (response?.ok) {
      const data = await response.json();
      const formattedHackathons = data.map(event => ({
        name: event.title,
        date: event.submission_period_dates.start,
        platform: event.location_type || 'Virtual',
        url: event.url,
        description: event.tagline,
        prizes: event.prize_amount,
        registrationDeadline: event.registration_deadline,
        technologies: event.themes || []
      }));
      
      return res.json(processHackathons(formattedHackathons));
    }

    // If API fails, use fallback data
    console.warn('Using fallback hackathon data');
    res.json(processHackathons(fallbackHackathons));
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    // Return processed fallback data on error
    res.json(processHackathons(fallbackHackathons));
  }
});

export default router;
