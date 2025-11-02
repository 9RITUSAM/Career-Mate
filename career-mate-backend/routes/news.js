import express from "express";
import fetch from "node-fetch";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const apiKey = "d6a28de4e45247bc908b3be5808005cb";
    const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      console.error('Invalid response from News API:', data);
      return res.status(500).json({ error: "Invalid response from news service" });
    }

    // Transform articles to match frontend expectations
    const formattedNews = data.articles.slice(0, 4).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url
    }));

    res.json(formattedNews);
  } catch (err) {
    console.error("Error fetching tech news:", err);
    res.status(500).json({ error: "Failed to fetch tech news", details: err.message });
  }
});

export default router;


