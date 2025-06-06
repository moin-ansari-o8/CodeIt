import { CohereClient } from "cohere-ai";

// Initialize Cohere with your API key
const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

// In-memory session store (client-side)
const sessions = {};

// Service Navigator Responses (persistent menu buttons)
const serviceNavigator = {
  "web development": {
    response:
      "Web Development: Custom Websites & E-Commerce\nAt Codeit, our web dev wizards craft stunning, high-performing websites and e-commerce platforms. From bold landing pages to complex online stores, we blend creativity with clean code to bring your brand alive online.",
  },
  "mobile apps": {
    response:
      "Mobile Apps: iOS & Android Solutions\nWe build sleek, scalable mobile apps that live in users’ pockets and hearts. Whether it’s Android or iOS, our Codeit crew turns your vision into intuitive, impactful apps that just feel right.",
  },
  "ui/ux design": {
    response:
      "UI/UX Design: User-Friendly Interfaces\nDesign is the soul of experience—and at Codeit, our UI/UX artists create interfaces that aren’t just pretty, but purposeful. We make every click effortless, every screen delightful.",
  },
  "cloud solutions": {
    response:
      "Cloud Solutions: Scalable Infrastructure\nCodeit brings the cloud down to earth—our engineers build robust, secure, and scalable cloud solutions tailored to your growth. From AWS to Azure, we keep your systems light, fast, and future-ready.",
  },
  "digital marketing": {
    response:
      "Digital Marketing: SEO & Social Media\nAt Codeit, our digital marketing maestros turn traffic into trust. With SEO strategies, viral social content, and conversion-focused campaigns, we help your brand rise, roar, and resonate.",
  },
  "ai & ml": {
    response:
      "AI & ML: Smart Automation\nLet smart tech do the heavy lifting. Codeit’s AI & ML experts craft intelligent solutions that automate tasks, analyze data, and predict trends—so you can focus on what truly matters.",
  },
};

// Modular Intents (editable for intent detection and responses)
const intents = [
  {
    patternCheckPrompt:
      "Does the user want to know how the assistant or company is doing? (e.g., 'how are you', 'what’s up', 'how you doing')",
    promptForReply:
      "Respond as Coral, a friendly assistant at Codeit, saying you're doing great and briefly mentioning Codeit's services (web development, mobile apps, UI/UX, cloud solutions, digital marketing, AI & ML). Keep it professional but chill and human-like.",
    regex: /^(how are you|how are you doing|what’s up|hru|how u doing)\??$/i,
    response:
      "I’m doing great! What about you? At Codeit, we craft digital magic — from custom websites and sleek mobile apps to UI/UX design, AI automation, and marketing solutions. We're a crew of tech lovers making brands shine online. Let’s build something awesome together.",
  },
  {
    patternCheckPrompt:
      "Does the user want to know who the assistant is or what Codeit does? (e.g., 'who are you', 'what is codeit', 'what can you do')",
    promptForReply:
      "Introduce yourself as Coral, Codeit’s virtual assistant, and explain that Codeit is a creative tech company offering services like websites, mobile apps, UI/UX, cloud setups, and AI. Keep the tone confident and human-like.",
    regex:
      /^(who are you|what are you|what can you do|what is codeit|tell me about (this )?company)\??$/i,
    response:
      "I'm Coral, your friendly tech-sidekick at Codeit! We’re a creative tech company turning ideas into high-impact digital experiences. From websites to mobile apps, UI/UX, cloud setups, and AI — we cover it all. Whether you’re a startup or a scale-up, we’ve got your back. Ready to explore?",
  },
  {
    patternCheckPrompt:
      "Does the user want to know about services offered by Codeit? (e.g., 'what services do you offer', 'what do you do')",
    promptForReply:
      "List Codeit’s services: web development, mobile apps, UI/UX design, cloud solutions, digital marketing, AI & ML. Ask what interests the user.",
    regex: /services|what do you offer/i,
    response:
      "Here’s what we offer at Codeit:\n- Web Development: Custom websites & e-commerce\n- Mobile Apps: iOS & Android solutions\n- UI/UX Design: User-friendly interfaces\n- Cloud Solutions: Scalable infrastructure\n- Digital Marketing: SEO & social media\n- AI & ML: Smart automation\nWhat interests you?",
  },
  {
    patternCheckPrompt:
      "Does the user want to start a project or work with Codeit? (e.g., 'start a project', 'work with you')",
    promptForReply:
      "Express excitement about starting a project and ask for the user’s name to begin the lead generation process.",
    regex: /start a project|work with you/i,
    response:
      "Excited to kick off a project? Please share your name to get started!",
    nextState: "lead_name",
  },
  {
    patternCheckPrompt:
      "Does the user want to schedule a meeting or book a call? (e.g., 'schedule a meeting', 'book a call')",
    promptForReply:
      "Offer to set up a free 15-minute consultation and ask for a preferred day.",
    regex: /schedule|book a meeting|book a call/i,
    response:
      "Let’s set up a free 15-minute consultation! When’s a good day for you?",
    nextState: "schedule_date",
  },
  {
    patternCheckPrompt:
      "Does the user want contact information? (e.g., 'contact', 'reach out', 'phone', 'email')",
    promptForReply:
      "Provide Codeit’s contact details: phone (+123-456-7890), email (contact@codeit.com), WhatsApp (+123-456-7890), LinkedIn (linkedin.com/company/codeit).",
    regex: /contact|reach out|phone|email|whatsapp|linkedin/i,
    response:
      "Get in touch with us!\n- Phone: +123-456-7890\n- Email: contact@codeit.com\n- WhatsApp: +123-456-7890\n- LinkedIn: linkedin.com/company/codeit\nWe’re here to help!",
  },
  {
    patternCheckPrompt:
      "Does the user ask how long a project takes? (e.g., 'how long does a project take')",
    promptForReply:
      "Explain that project timelines depend on scope, with typical web projects taking 4–12 weeks, and ask for specifics about their idea.",
    regex: /how long does a project take/i,
    response:
      "Project timelines depend on scope. A typical web project takes 4–12 weeks. Want specifics for your idea?",
  },
  {
    patternCheckPrompt:
      "Does the user ask if Codeit works with startups? (e.g., 'do you work with startups')",
    promptForReply:
      "Confirm that Codeit loves working with startups and ask about their startup.",
    regex: /do you work with startups/i,
    response:
      "Absolutely, we love startups! We offer flexible solutions to fuel your growth. What’s your startup about?",
  },
  {
    patternCheckPrompt:
      "Does the user ask about industries Codeit works with? (e.g., 'what industries')",
    promptForReply:
      "State that Codeit works across tech, healthcare, e-commerce, and more, and ask about the user’s industry.",
    regex: /what industries/i,
    response:
      "We work across tech, healthcare, e-commerce, and more. What’s your industry?",
  },
  {
    patternCheckPrompt:
      "Does the user want a tech joke? (e.g., 'tell me a tech joke')",
    promptForReply: "Share a random tech joke in a fun, engaging tone.",
    regex: /tell me a joke|tech joke/i,
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the developer go broke? Because he used up all his cache!",
      "Why was the computer cold? It left its Windows open!",
    ],
    getResponse: function () {
      return this.responses[Math.floor(Math.random() * this.responses.length)];
    },
  },
  {
    patternCheckPrompt:
      "Does the user want startup advice? (e.g., 'startup advice', 'give me advice')",
    promptForReply:
      "Provide concise, actionable startup advice in a friendly tone.",
    regex: /startup advice|give me advice/i,
    responses: [
      "Start small, build fast, learn faster.",
      "Solve a real pain point, not just a cool idea.",
      "Your first version won’t be perfect — launch anyway.",
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
    "You are Coral, the friendly, helpful, human-sounding chatbot working at *Codeit*, a modern tech company. You are never robotic, overly formal, or emotionless. Never say you're an AI or language model. You are Codeit’s virtual assistant and team member. For questions like 'how are you', reply naturally like: 'I’m great! What about you?' and then follow up with 4-5 short, useful lines about Codeit's services and vibe. Be professional but chill, confident, and human-like in tone.";

  // Initialize session if not exists
  if (!sessions[sessionId]) {
    sessions[sessionId] = { state: "idle", data: {}, history: [] };
  }
  const session = sessions[sessionId];
  const msg = message.event === "WELCOME" ? "" : message.trim().toLowerCase();

  // Welcome message for new sessions
  if (message.event === "WELCOME") {
    return {
      response:
        "Hi there! Welcome to Codeit. I'm Coral, here to help you explore our services, answer questions, or get in touch with the team. What’s on your mind?",
    };
  }

  // Handle Service Navigator (exact match for menu buttons)
  const serviceKey = Object.keys(serviceNavigator).find((key) =>
    msg.includes(key)
  );
  if (serviceKey) {
    return { response: serviceNavigator[serviceKey].response };
  }

  // Lead Generation Flow
  if (session.state.startsWith("lead_")) {
    if (session.state === "lead_name") {
      session.data.name = message;
      session.state = "lead_contact";
      return { response: "Awesome! What’s your email or phone number?" };
    } else if (session.state === "lead_contact") {
      session.data.contact = message;
      session.state = "lead_project";
      return { response: "Cool! What kind of project are you thinking about?" };
    } else if (session.state === "lead_project") {
      session.data.project = message;
      session.state = "lead_budget";
      return { response: "Nice! What’s your estimated budget? (Optional)" };
    } else if (session.state === "lead_budget") {
      session.data.budget = message || "Not provided";
      session.state = "lead_timeline";
      return { response: "Got it! What’s your timeline or urgency?" };
    } else if (session.state === "lead_timeline") {
      session.data.timeline = message;
      console.log("Lead collected:", session.data);
      // TODO: Integrate with CRM or Google Sheet here (e.g., send to an API endpoint)
      session.state = "idle";
      return { response: "Thanks! Our team will reach out soon." };
    }
  }

  // Meeting Scheduler Flow
  if (session.state.startsWith("schedule_")) {
    if (session.state === "schedule_date") {
      session.data.date = message;
      session.state = "schedule_time";
      return { response: "Great! What time works for you?" };
    } else if (session.state === "schedule_time") {
      session.data.time = message;
      console.log("Meeting scheduled:", session.data);
      // TODO: Integrate with calendar API (e.g., Google Calendar) here
      session.state = "idle";
      return {
        response: "You're all set! We'll follow up to confirm the details.",
      };
    }
  }

  // Intent Detection with Cohere AI
  try {
    // Prepare intent classification prompt
    const intentPrompt = `Classify the user's intent based on their message: "${message}".\nPossible intents and their detection prompts:\n${intents
      .map(
        (intent, index) => `${index + 1}. Intent: ${intent.patternCheckPrompt}`
      )
      .join(
        "\n"
      )}\nReturn the index of the matching intent (1-based) or 0 if no match.`;

    const intentResponse = await cohere.chat({
      model: "command-r-plus",
      message: intentPrompt,
      temperature: 0.3,
      max_tokens: 10,
    });

    const intentIndex = parseInt(intentResponse.text.trim()) - 1;

    if (intentIndex >= 0 && intentIndex < intents.length) {
      const intent = intents[intentIndex];

      // Fallback to regex for critical flows
      if (intent.regex && intent.regex.test(msg)) {
        if (intent.nextState) {
          session.state = intent.nextState;
        }
        return {
          response: intent.getResponse
            ? intent.getResponse(msg)
            : intent.response,
        };
      }

      // Use Cohere for response generation
      const response = await cohere.chat({
        model: "command-r-plus",
        message: intent.promptForReply,
        temperature: 0.7,
        max_tokens: 120,
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

    // Fallback response if no intent matches
    return {
      response:
        "Hmm, not sure I got that. Try asking about our services, starting a project, or booking a call!",
    };
  } catch (error) {
    console.error("Cohere error:", error);
    return { response: "Oops, something broke! 😕 Try again?" };
  }
}
