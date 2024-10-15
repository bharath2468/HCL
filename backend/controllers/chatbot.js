const express = require('express');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const query = req.body.query;
    const API_KEY = process.env.GEMINI_API;
    console.log(API_KEY)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: query }] }],
      }),
    };
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json(); // Correctly access the JSON body
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Error generating content' });
  }
});

module.exports = router;