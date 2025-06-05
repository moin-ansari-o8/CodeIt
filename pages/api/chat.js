import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, sessionId } = req.body;
  try {
    const response = await cohere.chat({
      model: "command-r-plus",
      message: message.trim().toLowerCase(),
      temperature: 0.7,
      max_tokens: 100,
    });
    res.status(200).json({ response: response.text.trim() });
  } catch (error) {
    console.error("Cohere error:", error);
    res.status(500).json({ response: "Oops! Something went wrong 😕." });
  }
}
