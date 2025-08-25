// src/hooks/useMarketNews.js
import { useState, useEffect } from "react";
import { fetchMarketNews } from "../utils/api";

const useMarketNews = (limit) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketNews(limit);
        setNews(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch news");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, [limit]);

  return { news, loading, error };
};

export default useMarketNews;
