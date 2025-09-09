// api/news.js
export default async function handler(req, res) {
  try {
    const category = req.query.category || "general";
    const query = req.query.q || ""; // support search too

    let url = "";

    if (query) {
      url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.API_KEY}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=ng&category=${category}&apiKey=${process.env.API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
