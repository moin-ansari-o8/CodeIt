const express = require("express");
const { CohereClient } = require("cohere-ai");

const app = express();
const port = 3001;

app.use(express.json());

// Load the Cohere API key from your .env.local file
require("dotenv").config({ path: "./.env.local" });
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

app.post("/api/cohereProxy", async (req, res) => {
  const { message, sessionId } = req.body;
  try {
    // Example logic: Replace with your actual Cohere API call
    const response = await cohere.generate({
      prompt: message,
      max_tokens: 50,
    });
    res.status(200).json({ response: response.generations[0].text });
  } catch (error) {
    console.error("Error in /api/cohereProxy:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
