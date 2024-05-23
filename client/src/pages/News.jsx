import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("/news.json");
        console.log(response.data);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news from JSON:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-[90%] md:w-[60%] mt-[10vh] md:mt-[20vh] mx-auto">
      <h1 className="text-3xl text-center font-bold mb-4">Catch up with the latest Tech News</h1>
      {news.map((article, index) => (
        <div
          key={index}
          className="w-full border border-gray-300 p-4 my-4 rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]"
          style={{ zIndex: -99 }}
        >
          <p
            onClick={() => window.open(article.url, "_blank")}
            className="flex items-center gap-2 text-black text-md font-bold mb-2 border-b border-gray-200 p-2 cursor-pointer"
          >
            {article.source.name}
            <span className="text-sm ml-2 text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          </p>
          <h1 className="text-xl mb-2">
            <p
              style={{ margin: "0 auto" }}
              className="font-bold text-md"
            >
              {article.title}
            </p>
          </h1>
          {article.author && (
            <p className="text-sm mb-2 text-gray-600">By {article.author}</p>
          )}
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt="Article"
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          )}
          <p
            style={{margin: "10px auto", marginTop: 0 }}
            className="bg-light-off-white border border-gray-200 p-4 text-sm"
          >
            {article.description}
          </p>
          <button
            className="bg-black text-white px-4 py-2 rounded-md mt-4 hover:bg-slate-700 transition-all"
            onClick={() => {
              setSelectedArticle(article);
            }}
          >
            View Article
          </button>
        </div>
      ))}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedArticle(null);
            }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg w-[90%] md:w-[80%] z-[100] h-[84vh] overflow-auto"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedArticle.title}
              </h2>
              {selectedArticle.author && (
                <p className="text-sm mb-2 text-gray-600">
                  By {selectedArticle.author}
                </p>
              )}
                <iframe
                  src={selectedArticle.url}
                  className="w-full h-[75%] md:h-[78%]"
                  title="Article Content"
                ></iframe>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 ml-4 hover:bg-red-600 transition-all"
                onClick={() => {
                  setSelectedArticle(null);
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
