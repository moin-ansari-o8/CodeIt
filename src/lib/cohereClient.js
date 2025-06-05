import { CohereClient } from "cohere-ai";

// Initialize Cohere with your API key
const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

// In-memory session store (client-side)
const sessions = {};

export async function handleCohereRequest({ message, sessionId }) {
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
        "Hello! 👋 Welcome to Codeit’s chatbot. I can help you explore our awesome services, get contact info, or start a project. What’s on your mind? 😊",
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
          "Here’s what we offer at Codeit:\n💻 Web Development: Custom websites & e-commerce\n📱 Mobile Apps: iOS & Android solutions\n🎨 UI/UX Design: User-friendly interfaces\n☁️ Cloud Solutions: Scalable infrastructure\n🚀 Digital Marketing: SEO & social media\n🤖 AI & ML: Smart automation\nWhat interests you? 😄",
      };
    }
    // Lead Generation Flow
    else if (/start a project|work with you/i.test(msg)) {
      session.state = "lead_name";
      return {
        response:
          "Excited to kick off a project? 🚀 Please share your name to get started!",
      };
    }
    // Schedule a Meeting
    else if (/schedule|book a meeting|book a call/i.test(msg)) {
      session.state = "schedule_date";
      return {
        response:
          "Let’s set up a free 15-minute consultation! 📅 When’s a good day for you?",
      };
    }
    // Social & Contact Integration
    else if (/contact|reach out|phone|email|whatsapp|linkedin/i.test(msg)) {
      return {
        response:
          "Get in touch with us! 📲\n📞 Phone: +123-456-7890\n📧 Email: contact@codeit.com\n💬 WhatsApp: +123-456-7890\n🔗 LinkedIn: linkedin.com/company/codeit\nWe’re here to help! 😊",
      };
    }
    // Smart FAQs
    else if (/how long does a project take/i.test(msg)) {
      return {
        response:
          "Project timelines depend on scope. A typical web project takes 4-12 weeks. 📅 Want specifics for your idea?",
      };
    } else if (/do you work with startups/i.test(msg)) {
      return {
        response:
          "Absolutely, we ❤️ startups! We offer flexible solutions to fuel your growth. What’s your startup about?",
      };
    } else if (/what industries/i.test(msg)) {
      return {
        response:
          "We work across tech, healthcare, e-commerce, and more. 🏥🛒 What’s your industry?",
      };
    }
    // Fun Easter Eggs
    else if (/tell me a joke|tech joke/i.test(msg)) {
      const jokes = [
        "Why do programmers prefer dark mode? Light attracts bugs! 🐞",
        "Why was the computer cold? It left its Windows open! ❄️",
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return { response: joke };
    } else if (/startup advice|give me advice/i.test(msg)) {
      const advice = [
        "Solve a real customer pain point first. 🎯",
        "Launch an MVP to test your idea quickly. 🚀",
      ];
      const tip = advice[Math.floor(Math.random() * advice.length)];
      return { response: tip };
    }
    // General Response with Cohere Chat API
    else if (msg) {
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

        const botResponse = response.text.trim();
        return { response: botResponse };
      } catch (error) {
        console.error("Cohere error:", error);
        return { response: "Oops, something broke! 😕 Try again?" };
      }
    }
  }
  // Lead Generation Steps
  else if (session.state.startsWith("lead_")) {
    if (session.state === "lead_name") {
      session.data.name = message;
      session.state = "lead_contact";
      return {
        response: "Great, thanks! 📝 What’s your email or phone number?",
      };
    } else if (session.state === "lead_contact") {
      session.data.contact = message;
      session.state = "lead_project";
      return {
        response: "Awesome! 🚀 What kind of project are you thinking about?",
      };
    } else if (session.state === "lead_project") {
      session.data.project = message;
      session.state = "lead_budget";
      return { response: "Nice! 💡 What’s your estimated budget? (Optional)" };
    } else if (session.state === "lead_budget") {
      session.data.budget = message || "Not provided";
      session.state = "lead_timeline";
      return { response: "Got it! ⏰ What’s your timeline or urgency?" };
    } else if (session.state === "lead_timeline") {
      session.data.timeline = message;
      console.log("Lead collected:", session.data);
      session.state = "idle";
      return { response: "Thanks! Our team will reach out soon. 😊" };
    }
  }
  // Scheduling Steps
  else if (session.state.startsWith("schedule_")) {
    if (session.state === "schedule_date") {
      session.data.date = message;
      session.state = "schedule_time";
      return { response: "Perfect! 🕒 What time works for you?" };
    } else if (session.state === "schedule_time") {
      session.data.time = message;
      console.log("Meeting scheduled:", session.data);
      session.state = "idle";
      return {
        response: "Your consultation is booked! 📅 We’ll confirm soon.",
      };
    }
  }

  return {
    response:
      "Not sure what you mean. 🤔 Try asking about our services or contact info!",
  };
}
