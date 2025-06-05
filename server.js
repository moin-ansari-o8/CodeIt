import express from "express";
import cors from "cors";
import { CohereClient } from "cohere-ai";

const app = express();
app.use(cors()); // Allow frontend to call API
app.use(express.json()); // Parse JSON bodies

// Initialize Cohere with API key from environment
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// In-memory session store (same as cohereClient.js)
const sessions = {};

// API route for chat
app.post("/api/chat", async (req, res) => {
  const { message, sessionId } = req.body;
  console.log("Received message:", message, "Session ID:", sessionId);

  // Initialize session if new
  if (!sessions[sessionId]) {
    sessions[sessionId] = { state: "idle", data: {} };
    return res.json({
      response:
        "Hello! 👋 Welcome to Codeit’s chatbot. I can help you explore our awesome services, get contact info, or start a project. What’s on your mind? 😊",
    });
  }

  const session = sessions[sessionId];
  const msg = message.event === "WELCOME" ? "" : message.trim().toLowerCase();

  // Handle conversation based on state (moved from cohereClient.js)
  if (session.state === "idle") {
    if (/services|what do you offer/i.test(msg)) {
      return res.json({
        response:
          "Here’s what we offer at Codeit:\n💻 Web Development: Custom websites & e-commerce\n📱 Mobile Apps: iOS & Android solutions\n🎨 UI/UX Design: User-friendly interfaces\n☁️ Cloud Solutions: Scalable infrastructure\n🚀 Digital Marketing: SEO & social media\n🤖 AI & ML: Smart automation\nWhat interests you? 😄",
      });
    } else if (/start a project|work with you/i.test(msg)) {
      session.state = "lead_name";
      return res.json({
        response:
          "Excited to kick off a project? 🚀 Please share your name to get started!",
      });
    } else if (/schedule|book a meeting|book a call/i.test(msg)) {
      session.state = "schedule_date";
      return res.json({
        response:
          "Let’s set up a free 15-minute consultation! 📅 When’s a good day for you?",
      });
    } else if (/contact|reach out|phone|email|whatsapp|linkedin/i.test(msg)) {
      return res.json({
        response:
          "Get in touch with us! 📲\n📞 Phone: +123-456-7890\n📧 Email: contact@codeit.com\n💬 WhatsApp: +123-456-7890\n🔗 LinkedIn: linkedin.com/company/codeit\nWe’re here to help! 😊",
      });
    } else if (/how long does a project take/i.test(msg)) {
      return res.json({
        response:
          "Project timelines depend on scope. A typical web project takes 4-12 weeks. 📅 Want specifics for your idea?",
      });
    } else if (/do you work with startups/i.test(msg)) {
      return res.json({
        response:
          "Absolutely, we ❤️ startups! We offer flexible solutions to fuel your growth. What’s your startup about?",
      });
    } else if (/what industries/i.test(msg)) {
      return res.json({
        response:
          "We work across tech, healthcare, e-commerce, and more. 🏥🛒 What’s your industry?",
      });
    } else if (/tell me a joke|tech joke/i.test(msg)) {
      const jokes = [
        "Why do programmers prefer dark mode? Light attracts bugs! 🐞",
        "Why was the computer cold? It left its Windows open! ❄️",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return res.json({ response: joke });
    } else if (/startup advice|give me advice/i.test(msg)) {
      const advice = [
        "Solve a real customer pain point first. 🎯",
        "Launch an MVP to test your idea quickly. 🚀",
      ];
      const tip = advice[Math.floor(Math.random() * advice.length)];
      return res.json({ response: tip });
    } else if (msg) {
      try {
        const response = await cohere.chat({
          model: "command-r-plus",
          message: msg,
          temperature: 0.7,
          max_tokens: 100,
        });
        if (!response.text) {
          throw new Error("Cohere returned no text");
        }
        return res.json({ response: response.text.trim() });
      } catch (error) {
        console.error("Cohere error:", error);
        return res
          .status(500)
          .json({ response: "Oops, something broke! 😕 Try again?" });
      }
    }
  } else if (session.state.startsWith("lead_")) {
    if (session.state === "lead_name") {
      session.data.name = message;
      session.state = "lead_contact";
      return res.json({
        response: "Great, thanks! 📝 What’s your email or phone number?",
      });
    } else if (session.state === "lead_contact") {
      session.data.contact = message;
      session.state = "lead_project";
      return res.json({
        response: "Awesome! 🚀 What kind of project are you thinking about?",
      });
    } else if (session.state === "lead_project") {
      session.data.project = message;
      session.state = "lead_budget";
      return res.json({
        response: "Nice! 💡 What’s your estimated budget? (Optional)",
      });
    } else if (session.state === "lead_budget") {
      session.data.budget = message || "Not provided";
      session.state = "lead_timeline";
      return res.json({
        response: "Got it! ⏰ What’s your timeline or urgency?",
      });
    } else if (session.state === "lead_timeline") {
      session.data.timeline = message;
      console.log("Lead collected:", session.data);
      session.state = "idle";
      return res.json({ response: "Thanks! Our team will reach out soon. 😊" });
    }
  } else if (session.state.startsWith("schedule_")) {
    if (session.state === "schedule_date") {
      session.data.date = message;
      session.state = "schedule_time";
      return res.json({ response: "Perfect! 🕒 What time works for you?" });
    } else if (session.state === "schedule_time") {
      session.data.time = message;
      console.log("Meeting scheduled:", session.data);
      session.state = "idle";
      return res.json({
        response: "Your consultation is booked! 📅 We’ll confirm soon.",
      });
    }
  }

  return res.json({
    response:
      "Not sure what you mean. 🤔 Try asking about our services or contact info!",
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
