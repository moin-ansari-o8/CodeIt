const { SessionsClient } = require("@google-cloud/dialogflow");
const admin = require("firebase-admin");

// Initialize Dialogflow client
const projectId = process.env.PROJECT_ID;
const sessionsClient = new SessionsClient({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

// Initialize Firebase Admin SDK for Firestore
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

module.exports = async (req, res) => {
  const { text, event, sessionId } = req.body;

  // Validate input
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }
  if (!text && !event) {
    return res.status(400).json({ error: "Text or event is required" });
  }

  const sessionPath = sessionsClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  let request;

  // Prepare Dialogflow request
  if (event) {
    request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          languageCode: "en-US",
        },
      },
    };
  } else {
    request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: "en-US",
        },
      },
    };
  }

  try {
    // Send request to Dialogflow
    const [response] = await sessionsClient.detectIntent(request);
    const result = response.queryResult;
    let botResponse = result.fulfillmentText;

    // Handle lead generation intent
    if (
      result.intent?.displayName === "lead_generation" &&
      result.allRequiredParamsPresent
    ) {
      const parameters = result.parameters.fields;
      const leadData = {
        name: parameters.name.stringValue,
        email: parameters.email.stringValue,
        projectType: parameters.project_type?.stringValue || "",
        budget: parameters.budget?.stringValue || "Not specified",
        timeline: parameters.timeline?.stringValue || "Not specified",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      await admin.firestore().collection("leads").add(leadData);
      botResponse =
        "Thank you! We’ve received your details and will reach out soon.";
    }

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
