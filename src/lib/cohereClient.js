import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

const sessions = {};

const serviceNavigator = {
  "about our company": {
    response:
      "Codeit: Creative tech company delivering websites, mobile apps, UI/UX, cloud, marketing, and AI solutions.",
  },
  "our services": {
    response:
      "We offer web development, mobile apps, UI/UX design, cloud solutions, digital marketing, and AI/ML automation.",
  },
  "how to contact?": {
    response: "Visit our contact section for details!",
  },
  "schedule meeting?": {
    response: "Check our contact section to book a meeting!",
  },
  "social media and follow": {
    response:
      "Follow us on LinkedIn (linkedin.com/company/codeit), Twitter (@CodeitTech), Instagram (@CodeitTech).",
  },
};

const intents = [
  {
    patternCheckPrompt:
      "Is the user asking how the assistant or company is doing? Examples: 'how are you', 'what’s up', 'how you doing', 'hru'.",
    promptForReply:
      "As Coral from Codeit, say you're doing great, mention services briefly, max 20 words.",
    regex: /^(how are you|how are you doing|what’s up|hru|how u doing)\??$/i,
    response:
      "I'm great! Codeit offers web, mobile, UI/UX, cloud, marketing, AI. Let's build something cool!",
  },
  {
    patternCheckPrompt:
      "Is the user asking who the assistant is or what Codeit does? Examples: 'who are you', 'what is codeit', 'what can you do', 'tell me about the company'.",
    promptForReply:
      "As Coral, introduce Codeit as a tech company with full services, no word limit.",
    regex:
      /^(who are you|what are you|what can you do|what is codeit|tell me about (this )?company)\??$/i,
    response:
      "I'm Coral, Codeit's assistant! We're a tech company crafting websites, apps, UI/UX, cloud, marketing, and AI solutions.",
  },
  {
    patternCheckPrompt:
      "Is the user asking about services offered by Codeit? Examples: 'what services do you offer', 'what are the services', 'what do you do', 'services'.",
    promptForReply: "List Codeit’s services, max 20 words.",
    regex: /services|what do you offer|what are the services|what do you do/i,
    response:
      "Web development, mobile apps, UI/UX, cloud, digital marketing, AI/ML. What's your project?",
  },
  {
    patternCheckPrompt:
      "Is the user wanting to start a project or work with Codeit? Examples: 'start a project', 'work with you', 'i want to start a project'.",
    promptForReply: "Show excitement, ask for user’s name, max 20 words.",
    regex: /start a project|work with you|i want to start a project/i,
    response: "Thrilled to start? Please share your name to begin!",
    nextState: "lead_name",
  },
  {
    patternCheckPrompt:
      "Is the user wanting to schedule a meeting or book a call? Examples: 'schedule a meeting', 'book a call', 'schedule'.",
    promptForReply:
      "Offer a 15-min consultation, ask preferred day, max 20 words.",
    regex: /schedule|book a meeting|book a call/i,
    response: "Free 15-min consultation? Pick a day that works!",
    nextState: "schedule_date",
  },
  {
    patternCheckPrompt:
      "Is the user asking for contact information? Examples: 'contact', 'reach out', 'phone', 'email', 'i want to contact'.",
    promptForReply: "Provide Codeit’s contact details, max 20 words.",
    regex: /contact|reach out|phone|email|whatsapp|linkedin|i want to contact/i,
    response:
      "Phone: +123-456-7890, Email: contact@codeit.com, WhatsApp: +123-456-7890, LinkedIn: linkedin.com/company/codeit",
  },
  {
    patternCheckPrompt:
      "Is the user asking how long a project takes? Examples: 'how long does a project take', 'project timeline'.",
    promptForReply:
      "Explain project timelines vary, ask for details, max 20 words.",
    regex: /how long does a project take|project timeline/i,
    response: "Timelines vary, 4–12 weeks for web. What's your project idea?",
  },
  {
    patternCheckPrompt:
      "Is the user asking if Codeit works with startups? Examples: 'do you work with startups', 'startups'.",
    promptForReply:
      "Confirm startup support, ask about their startup, max 20 words.",
    regex: /do you work with startups|startups/i,
    response:
      "We love startups! Flexible solutions for growth. What's your startup about?",
  },
  {
    patternCheckPrompt:
      "Is the user asking about industries Codeit works with? Examples: 'what industries', 'industries you serve'.",
    promptForReply: "List industries, ask user’s industry, max 20 words.",
    regex: /what industries|industries you serve/i,
    response: "Tech, healthcare, e-commerce, more. What's your industry?",
  },
  {
    patternCheckPrompt:
      "Is the user asking about pricing? Examples: 'how much does it cost', 'pricing', 'cost'.",
    promptForReply:
      "Explain pricing varies, suggest starting project, max 20 words.",
    regex: /pricing|how much|cost/i,
    response: "Pricing varies by scope. Start a project for a quote!",
    nextState: "lead_name",
  },
  {
    patternCheckPrompt:
      "Is the user asking for a joke? Examples: 'tell me a joke', 'tech joke', 'joke'.",
    promptForReply:
      "Generate a random joke about web development, coding, or the world, max 20 words.",
    regex: /tell me a joke|tech joke|joke/i,
  },
  {
    patternCheckPrompt:
      "Is the user asking for startup advice? Examples: 'startup advice', 'give me advice', 'advice for startups'.",
    promptForReply: "Give concise startup advice, max 20 words.",
    regex: /startup advice|give me advice|advice for startups/i,
    responses: [
      "Start small, build fast, learn quickly.",
      "Solve real problems, not just cool ideas.",
      "Launch imperfectly, improve fast.",
    ],
    getResponse: function () {
      return this.responses[Math.floor(Math.random() * this.responses.length)];
    },
  },
];

export async function handleCohereRequest({ message, sessionId }) {
  console.log("Calling Cohere with message:", message);
  console.log(
    "Cohere token:",
    import.meta.env.VITE_COHERE_API_KEY ? "Set" : "Missing"
  );

  const systemPrompt =
    "You are Coral, Codeit’s friendly assistant. Be professional, human-like, max 20 words unless about company.";

  if (!sessions[sessionId]) {
    sessions[sessionId] = { state: "idle", data: {}, history: [] };
  }
  const session = sessions[sessionId];
  const msg = message.event === "WELCOME" ? "" : message.trim().toLowerCase();

  if (message.event === "WELCOME") {
    return {
      response: "SERVICE_MENU",
    };
  }

  const serviceKey = Object.keys(serviceNavigator).find((key) =>
    msg.includes(key)
  );
  if (serviceKey) {
    return { response: serviceNavigator[serviceKey].response };
  }

  if (session.state.startsWith("lead_")) {
    if (session.state === "lead_name") {
      session.data.name = message;
      session.state = "lead_contact";
      return { response: "Great! What's your email or phone?" };
    } else if (session.state === "lead_contact") {
      session.data.contact = message;
      session.state = "lead_project";
      return { response: "Nice! What's your project about?" };
    } else if (session.state === "lead_project") {
      session.data.project = message;
      session.state = "lead_budget";
      return { response: "Cool! Estimated budget? (Optional)" };
    } else if (session.state === "lead_budget") {
      session.data.budget = message || "Not provided";
      session.state = "lead_timeline";
      return { response: "Got it! What's your timeline?" };
    } else if (session.state === "lead_timeline") {
      session.data.timeline = message;
      console.log("Lead collected:", session.data);
      session.state = "idle";
      return { response: "Thanks! We'll reach out soon." };
    }
  }

  if (session.state.startsWith("schedule_")) {
    if (session.state === "schedule_date") {
      session.data.date = message;
      session.state = "schedule_time";
      return { response: "Great! What time works?" };
    } else if (session.state === "schedule_time") {
      session.data.time = message;
      console.log("Meeting scheduled:", session.data);
      session.state = "idle";
      return { response: "All set! We'll confirm soon." };
    }
  }

  try {
    const intentPrompt = `Classify the user's intent based on their message: "${message}".\nPossible intents and their detection prompts:\n${intents
      .map(
        (intent, index) => `${index + 1}. Intent: ${intent.patternCheckPrompt}`
      )
      .join(
        "\n"
      )}\nReturn the index of the matching intent (1-based) or 0 if no match. Only return the number.`;

    const intentResponse = await cohere.chat({
      model: "command-r-plus",
      message: intentPrompt,
      temperature: 0.3,
      max_tokens: 10,
    });

    const intentIndex = parseInt(intentResponse.text.trim()) - 1;

    if (intentIndex >= 0 && intentIndex < intents.length) {
      const intent = intents[intentIndex];

      if (intent.regex && intent.regex.test(msg)) {
        if (intent.nextState) {
          session.state = intent.nextState;
        }
        // For joke intent, rely on Cohere API instead of predefined responses
        if (intent.patternCheckPrompt.includes("joke")) {
          const response = await cohere.chat({
            model: "command-r-plus",
            message: intent.promptForReply,
            temperature: 0.7,
            max_tokens: 20,
            chatHistory: [
              { role: "SYSTEM", message: systemPrompt },
              { role: "USER", message },
            ],
          });

          if (!response.text) throw new Error("Cohere returned no text");

          return { response: response.text.trim() };
        }

        return {
          response: intent.getResponse
            ? intent.getResponse(msg)
            : intent.response,
        };
      }

      const response = await cohere.chat({
        model: "command-r-plus",
        message: intent.promptForReply,
        temperature: 0.7,
        max_tokens: 20,
        chatHistory: [
          { role: "SYSTEM", message: systemPrompt },
          { role: "USER", message },
        ],
      });

      if (!response.text) throw new Error("Cohere returned no text");

      if (intent.nextState) {
        session.state = intent.nextState;
      }

      return { response: response.text.trim() };
    }

    return {
      response: "Not sure? Ask about services, contact, or schedule a call!",
    };
  } catch (error) {
    console.error("Cohere error:", error);
    return { response: "Oops, something broke! Try again?" };
  }
}
