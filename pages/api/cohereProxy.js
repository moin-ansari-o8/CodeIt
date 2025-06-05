import { CohereClient } from "cohere-ai";

// Initialize Cohere with your API key
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
console.log("Calling Cohere with message:", msg);
console.log(
  "Cohere token:",
  process.env.COHERE_API_KEY ? "✅ Set" : "❌ Missing"
);

// In-memory session store (simple for now; use a database in production)
const sessions = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { message, sessionId } = req.body;

  // Initialize session if new
  if (!sessions[sessionId]) {
    sessions[sessionId] = { state: "idle", data: {} };
    return res.status(200).json({
      response:
        "Hi there! 👋 Welcome to Codeit. I'm here to help you explore our services, answer questions, or get in touch with the team.",
    });
  }

  const session = sessions[sessionId];
  const msg = message.event === "WELCOME" ? "" : message.trim().toLowerCase();
  console.log("Calling Cohere with message:", msg);
  console.log(
    "Cohere token:",
    process.env.COHERE_API_KEY ? "✅ Set" : "❌ Missing"
  );

  // Handle conversation based on state
  if (session.state === "idle") {
    // Service Navigator
    if (/services|what do you offer/i.test(msg)) {
      return res.status(200).json({
        response:
          "We offer the following services:\n💻 Web Development\n📱 Mobile App Development\n🎨 UI/UX Design\n☁️ Cloud Solutions\n🚀 Digital Marketing\n🤖 AI & Machine Learning",
      });
    }
    // Lead Generation Flow
    else if (/start a project|work with you/i.test(msg)) {
      session.state = "lead_name";
      return res.status(200).json({
        response:
          "Want to start a project with us? Let’s get a few details so our team can reach out. What’s your name?",
      });
    }
    // Schedule a Meeting
    else if (/schedule|book a meeting|book a call/i.test(msg)) {
      session.state = "schedule_date";
      return res.status(200).json({
        response:
          "Would you like to book a free 15-minute consultation? When would you like the meeting?",
      });
    }
    // Social & Contact Integration
    else if (/contact|reach out|phone|email|whatsapp|linkedin/i.test(msg)) {
      return res.status(200).json({
        response:
          "You can reach us via:\n📞 Phone: +123-456-7890\n📧 Email: contact@codeit.com\n💬 WhatsApp: +123-456-7890\n🔗 LinkedIn: linkedin.com/company/codeit",
      });
    }
    // Smart FAQs
    else if (/how long does a project take/i.test(msg)) {
      return res.status(200).json({
        response:
          "Project timelines vary by complexity. A typical web development project takes 4-12 weeks.",
      });
    } else if (/do you work with startups/i.test(msg)) {
      return res.status(200).json({
        response:
          "Yes, we love startups! We offer tailored solutions to help you grow.",
      });
    } else if (/what industries/i.test(msg)) {
      return res.status(200).json({
        response:
          "We specialize in tech, healthcare, e-commerce, and more. What’s your industry?",
      });
    }
    // Fun Easter Eggs
    else if (/tell me a joke|tech joke/i.test(msg)) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why was the computer cold? It left its Windows open!",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return res.status(200).json({ response: joke });
    } else if (/startup advice|give me advice/i.test(msg)) {
      const advice = [
        "Focus on solving a real customer problem.",
        "Launch a minimum viable product (MVP) to test your idea fast.",
      ];
      const tip = advice[Math.floor(Math.random() * advice.length)];
      return res.status(200).json({ response: tip });
    }
    // General Response with Cohere
    else if (msg) {
      try {
        const response = await cohere.generate({
          model: "command-xlarge-nightly",
          prompt: msg,
          max_tokens: 100,
          temperature: 0.7,
        });

        if (!response.generations || response.generations.length === 0) {
          throw new Error("Cohere returned no generations");
        }

        const botResponse = response.generations[0].text.trim();
        return res.status(200).json({ response: botResponse });
      } catch (error) {
        console.error("Cohere error:", error);
        return res
          .status(200)
          .json({ response: "Oops! Something went wrong." });
      }
    }
  }
  // Lead Generation Steps
  else if (session.state.startsWith("lead_")) {
    if (session.state === "lead_name") {
      session.data.name = message;
      session.state = "lead_contact";
      return res
        .status(200)
        .json({ response: "Thanks! What’s your email or phone number?" });
    } else if (session.state === "lead_contact") {
      session.data.contact = message;
      session.state = "lead_project";
      return res
        .status(200)
        .json({ response: "What type of project are you interested in?" });
    } else if (session.state === "lead_project") {
      session.data.project = message;
      session.state = "lead_budget";
      return res
        .status(200)
        .json({ response: "What’s your estimated budget? (Optional)" });
    } else if (session.state === "lead_budget") {
      session.data.budget = message || "Not provided";
      session.state = "lead_timeline";
      return res
        .status(200)
        .json({ response: "What’s your timeline or urgency?" });
    } else if (session.state === "lead_timeline") {
      session.data.timeline = message;
      console.log("Lead collected:", session.data); // Replace with email/CRM/Google Sheet integration
      session.state = "idle";
      return res
        .status(200)
        .json({ response: "Thanks! Our team will reach out soon." });
    }
  }
  // Scheduling Steps
  else if (session.state.startsWith("schedule_")) {
    if (session.state === "schedule_date") {
      session.data.date = message;
      session.state = "schedule_time";
      return res.status(200).json({ response: "What time would you prefer?" });
    } else if (session.state === "schedule_time") {
      session.data.time = message;
      console.log("Meeting scheduled:", session.data); // Replace with calendar integration
      session.state = "idle";
      return res.status(200).json({
        response:
          "Your consultation is booked! We’ll confirm the details soon.",
      });
    }
  }

  return res.status(200).json({
    response: "I’m not sure how to help with that. Try asking something else!",
  });
}
