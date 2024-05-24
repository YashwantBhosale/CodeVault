const axios = require('axios');
const { Console } = require('console');
const fs = require('fs');
require('dotenv').config();

const fetchNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?domains=wired.com&q=technology OR AI OR machinelearning&sortBy=publishedAt&apiKey=1d5e1f75fdf149e0ac46e1a7cfc57c29`
    );
    const filteredArticles = response.data.articles.filter(article => article.source.name !== "[Removed]");
    
    fs.writeFileSync('news.json', JSON.stringify(filteredArticles, null, 2));
    console.log('News data saved to news.json');
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

fetchNews();
