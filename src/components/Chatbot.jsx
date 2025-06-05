import { useEffect, useState, useRef } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const containerRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-collapse button after 2s
  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close chatbox on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (isOpen) {
          setIsOpen(false);
          setShowButton(true);
          setIsExpanded(false);
        }
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle chat and send welcome message on open
  const toggleChat = () => {
    if (!isOpen) {
      setShowButton(false);
      setIsOpen(true);
      setIsExpanded(true);
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      sendMessage({ event: "WELCOME" }, newSessionId);
    } else {
      setIsOpen(false);
      setShowButton(true);
      setTimeout(() => setIsExpanded(false), 100);
    }
  };

  // Send message or event to backend
  const sendMessage = async (textOrEvent, sessId = sessionId) => {
    const isEvent = typeof textOrEvent === "object";
    const payload = isEvent
      ? { event: textOrEvent.event, sessionId: sessId }
      : { text: textOrEvent, sessionId: sessId };
    try {
      const response = await fetch("/api/chatbotProxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle user message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      await sendMessage(message);
      setMessage("");
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {showButton && (
        <button
          onClick={toggleChat}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => {
            if (!isOpen) setIsExpanded(false);
          }}
          className={`fixed bottom-24 right-0 bg-sky-200 text-primary py-2 px-3 
          ${isExpanded ? "w-44" : "w-12"} 
          h-12 overflow-hidden whitespace-nowrap rounded-l-lg shadow-lg z-50 
          transition-all duration-500 ease-in-out hover:bg-sky-300 hover:scale-105 
          hover:shadow-xl flex items-center`}
        >
          <div className="min-w-[1.5rem] flex justify-center">
            <ChatBubbleLeftRightIcon className="w-7 h-7 text-sky-700 shrink-1" />
          </div>
          <span
            className={`ml-2 transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div
          ref={containerRef}
          className="fixed bottom-24 right-0 w-96 bg-white rounded-l-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-scaleUp"
          style={{ height: "450px" }}
        >
          {/* Header */}
          <div className="bg-sky-700 text-white px-5 py-4 font-semibold flex justify-between items-center rounded-l-xl">
            Chatbot
            <button
              onClick={toggleChat}
              className="text-white text-3xl leading-none hover:text-red-300 transition"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="p-5 text-gray-700 flex-grow overflow-y-auto border-b border-gray-200 text-sm"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <p
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-sky-100" : "bg-gray-100"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 p-4 border-t border-gray-200"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-lg transition"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-6 h-6 rotate-0" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
