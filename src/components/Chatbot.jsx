import { useEffect, useState, useRef } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import { handleCohereRequest } from "../lib/cohereClient";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatbotMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("chatbotSessionId") || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-collapse button after 2s
  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

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
  }, [messages, isLoading]);

  // Toggle chat and send welcome message only for new sessions
  const toggleChat = () => {
    if (!isOpen) {
      setShowButton(false);
      setIsOpen(true);
      setIsExpanded(true);
      let newSessionId = sessionId;
      let isNewSession = false;

      if (!newSessionId) {
        newSessionId = uuidv4();
        isNewSession = true;
        setSessionId(newSessionId);
        localStorage.setItem("chatbotSessionId", newSessionId);
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      if (isNewSession) {
        setIsLoading(true);
        sendMessage({ event: "WELCOME" }, newSessionId);
      }
    } else {
      setIsOpen(false);
      setShowButton(true);
      setTimeout(() => setIsExpanded(false), 100);
    }
  };

  // Send message or event to Cohere client
  const sendMessage = async (text, sessId = sessionId) => {
    setIsLoading(true);
    try {
      const data = await handleCohereRequest({
        message: text,
        sessionId: sessId,
      });
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");
      inputRef.current.focus();
      await sendMessage(message);
    }
  };

  // Clear input box
  const clearInput = () => {
    setMessage("");
    inputRef.current.focus();
  };

  // Clear chatbox messages
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatbotMessages");
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
            {/* Loading Indicator */}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
                  <div className="flex gap-1 items-center justify-start h-5">
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-0"></span>
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 p-4 border-t border-gray-200"
          >
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500 pr-8"
                disabled={isLoading}
              />
              {message && (
                <button
                  type="button"
                  onClick={clearInput}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear input"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-lg transition relative"
                aria-label="Send message"
                disabled={isLoading}
              >
                <PaperAirplaneIcon className="w-6 h-6 rotate-0" />
                <span className="tooltip">Send</span>
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={clearChat}
                className="bg-sky-600 hover:bg-sky-700 text-white p-3 rounded-lg transition relative"
                aria-label="Clear chat"
                disabled={isLoading}
              >
                <TrashIcon className="w-6 h-6" />
                <span className="tooltip">Clear</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CSS for Loading Animation and Tooltips */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .tooltip {
          visibility: hidden;
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s, visibility 0.2s;
          margin-bottom: 8px;
        }
        button:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
