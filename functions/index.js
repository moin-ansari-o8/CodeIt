const { SessionsClient } = require("@google-cloud/dialogflow");
const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");

admin.initializeApp();

const projectId = "chatbot-9yrs"; // Replace with your Dialogflow project ID
const sessionsClient = new SessionsClient();

functions.http("chatbotProxy", async (req, res) => {
  const { text, event, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).send("Session ID is required");
  }

  const sessionPath = sessionsClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  let request;

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
  } else if (text) {
    request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: "en-US",
        },
      },
    };
  } else {
    return res.status(400).send("Text or event is required");
  }

  try {
    const [response] = await sessionsClient.detectIntent(request);
    const result = response.queryResult;
    let botResponse = result.fulfillmentText;

    // Handle lead generation
    if (
      result.intent &&
      result.intent.displayName === "lead_generation" &&
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

    res.send({ response: botResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
