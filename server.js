import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyAB2ybNFXZbMccHrd23rjLgPi5n0RwBwek";

app.post('/ai', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          maxOutputTokens: 500
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const output = data?.candidates?.[0]?.output || "Sorry, I couldn't generate a response.";
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from Google AI API." });
  }
});

app.use(express.static('./')); // serve HTML & CSS

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
