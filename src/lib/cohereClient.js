import { CohereClient } from "cohere-ai";

// Initialize Cohere with your API key (loaded from .env.local via Vite)
const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

// In-memory session store (client-side)
const sessions = {};

export async function handleCohereRequest({ message, sessionId }) {
  // Log for debugging
  console.log("Calling Cohere with message:", message);
  console.log(
    "Cohere token:",
    import.meta.env.VITE_COHERE_API_KEY ? "✅ Set" : "❌ Missing"
  );

  // Initialize session if new
  if (!sessions[sessionId]) {
    sessions[sessionId] = { state: "idle", data: {} };
    return {
      response:
        "Hi there! 👋 Welcome to Codeit. I’m here to help you explore our services, answer questions, or get in touch with the team.",
    };
  }

  const session = sessions[sessionId];
  const msg = message.event === "WELCOME" ? "" : message.trim().toLowerCase();

  // Handle conversation based on state
  if (session.state === "idle") {
    // Service Navigator
    if (/services|what do you offer/i.test(msg)) {
      return {
        response:
          "We offer the following services:\n💻 Web Development\n📱 Mobile App Development\n🎨 UI/UX Design\n☁️ Cloud Solutions\n🚀 Digital Marketing\n🤖 AI & Machine Learning",
      };
    }
    // Lead Generation Flow
    else if (/start a project|work with you/i.test(msg)) {
      session.state = "lead_name";
      return {
        response:
          "Want to start a project with us? Let’s get a few details so our team can reach out. What’s your name?",
      };
    }
    // Schedule a Meeting
    else if (/schedule|book a meeting|book a call/i.test(msg)) {
      session.state = "schedule_date";
      return {
        response:
          "Would you like to book a free 15-minute consultation? When would you like the meeting?",
      };
    }
    // Social & Contact Integration
    else if (/contact|reach out|phone|email|whatsapp|linkedin/i.test(msg)) {
      return {
        response:
          "You can reach us via:\n📞 Phone: +123-456-7890\n📧 Email: contact@codeit.com\n💬 WhatsApp: +123-456-7890\n🔗 LinkedIn: linkedin.com/company/codeit",
      };
    }
    // Smart FAQs
    else if (/how long does a project take/i.test(msg)) {
      return {
        response:
          "Project timelines vary by complexity. A typical web development project takes 4-12 weeks.",
      };
    } else if (/do you work with startups/i.test(msg)) {
      return {
        response:
          "Yes, we love startups! We offer tailored solutions to help you grow.",
      };
    } else if (/what industries/i.test(msg)) {
      return {
        response:
          "We specialize in tech, healthcare, e-commerce, and more. What’s your industry?",
      };
    }
    // Fun Easter Eggs
    else if (/tell me a joke|tech joke/i.test(msg)) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why was the computer cold? It left its Windows open!",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return { response: joke };
    } else if (/startup advice|give me advice/i.test(msg)) {
      const advice = [
        "Focus on solving a real customer problem.",
        "Launch a minimum viable product (MVP) to test your idea fast.",
      ];
      const tip = advice[Math.floor(Math.random() * advice.length)];
      return { response: tip };
    }
    // General Response with Cohere Chat API
    else if (msg) {
      try {
        const response = await cohere.chat({
          model: "command-r-plus", // Use a supported model for the chat API
          message: msg,
          temperature: 0.7,
          max_tokens: 100,
        });

        if (!response.text) {
          throw new Error("Cohere returned no text");
        }

        const botResponse = response.text.trim();
        return { response: botResponse };
      } catch (error) {
        console.error("Cohere error:", error);
        return { response: "Oops! Something went wrong." };
      }
    }
  }
  // Lead Generation Steps
  else if (session.state.startsWith("lead_")) {
    if (session.state === "lead_name") {
      session.data.name = message;
      session.state = "lead_contact";
      return { response: "Thanks! What’s your email or phone number?" };
    } else if (session.state === "lead_contact") {
      session.data.contact = message;
      session.state = "lead_project";
      return { response: "What type of project are you interested in?" };
    } else if (session.state === "lead_project") {
      session.data.project = message;
      session.state = "lead_budget";
      return { response: "What’s your estimated budget? (Optional)" };
    } else if (session.state === "lead_budget") {
      session.data.budget = message || "Not provided";
      session.state = "lead_timeline";
      return { response: "What’s your timeline or urgency?" };
    } else if (session.state === "lead_timeline") {
      session.data.timeline = message;
      console.log("Lead collected:", session.data); // Replace with email/CRM/Google Sheet integration
      session.state = "idle";
      return { response: "Thanks! Our team will reach out soon." };
    }
  }
  // Scheduling Steps
  else if (session.state.startsWith("schedule_")) {
    if (session.state === "schedule_date") {
      session.data.date = message;
      session.state = "schedule_time";
      return { response: "What time would you prefer?" };
    } else if (session.state === "schedule_time") {
      session.data.time = message;
      console.log("Meeting scheduled:", session.data); // Replace with calendar integration
      session.state = "idle";
      return {
        response:
          "Your consultation is booked! We’ll confirm the details soon.",
      };
    }
  }

  return {
    response: "I’m not sure how to help with that. Try asking something else!",
  };
}
