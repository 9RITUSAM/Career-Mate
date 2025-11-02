"use client";
import { useEffect, useState } from "react";

export default function TechNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_API_URL)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tech-news`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error('Expected array of news items, got:', data);
          setNews([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch tech news:', err);
        setNews([]);
      });
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
     <h2 className="text-2xl font-bold mb-4 text-blue-500">🤞Tech News</h2>
      {news.length === 0 && <p>Loading news...</p>}
      {news.map((article, idx) => (
        <div key={idx} className="mb-4 border-b pb-2">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-black hover:underline">
            {article.title}
          </a>
          <p className="text-sm text-gray-600">{article.description}</p>
        </div>
      ))}
    </div>
  );
}
