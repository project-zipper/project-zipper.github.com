import express from 'express';
import fetch from 'node-fetch'; // npm install node-fetch
import cors from 'cors';

const app = express();
app.use(cors()); // allow frontend to call
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

    // Send back only the text output to frontend
    const output = data?.candidates?.[0]?.output || "Sorry, I couldn't generate a response.";
    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from Google AI API." });
  }
});

app.use(express.static('./')); // serve HTML and CSS files

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
