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
  const [dimensions, setDimensions] = useState(() => {
    const saved = localStorage.getItem("chatbotDimensions");
    return saved ? JSON.parse(saved) : { width: 384, height: 450 }; // w-96 = 384px
  });
  const containerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const resizeRef = useRef(null);
  const [isResizing, setIsResizing] = useState(null);

  // Auto-collapse button after 2s
  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Save messages and dimensions to localStorage
  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatbotDimensions", JSON.stringify(dimensions));
  }, [dimensions]);

  // Close chatbox on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !isResizing
      ) {
        if (isOpen) {
          setIsOpen(false);
          setShowButton(true);
          setIsExpanded(false);
        }
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isResizing]);

  // Scroll to latest message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle custom resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !resizeRef.current) return;
      const rect = resizeRef.current.getBoundingClientRect();
      let newWidth = dimensions.width;
      let newHeight = dimensions.height;

      if (isResizing.includes("left")) {
        newWidth = rect.right - e.clientX;
      }
      if (isResizing.includes("top")) {
        newHeight = rect.bottom - e.clientY;
      }
      if (isResizing.includes("bottom")) {
        newHeight = e.clientY - rect.top;
      }

      newWidth = Math.max(300, Math.min(800, newWidth)); // Min 300px, max 800px
      newHeight = Math.max(300, Math.min(600, newHeight)); // Min 300px, max 600px

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isResizing, dimensions]);

  // Toggle chat and send welcome message
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
      setTimeout(() => setIsExpanded(true), 300); // Reset for next open
    }
  };

  // Send message to server
  const sendMessage = async (text, msgSessionId = sessionId) => {
    setIsLoading(true);
    try {
      const data = await handleCohereRequest({
        message: text,
        sessionId: msgSessionId,
      });
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong 😕.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("Focused input after send/response");
        }
      }, 100);
    }
  };

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, sender: "user" }]);
      setMessage("");
      await sendMessage(message);
    }
  };

  // Clear input
  const clearInput = () => {
    setMessage("");
    inputRef.current?.focus();
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatbotMessages");
    inputRef.current?.focus();
  };

  // Start resizing
  const startResize = (direction) => (e) => {
    e.preventDefault();
    setIsResizing(direction);
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
          className={`fixed bottom-24 right-4 bg-blue-500 text-white py-2 px-3 
          ${isExpanded ? "w-32" : "w-12"} 
          h-12 rounded-l-lg overflow-hidden whitespace-nowrap shadow-lg z-50 
          transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 
          flex items-center`}
        >
          <div className="min-w-[1.5rem] flex justify-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
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
          ref={resizeRef}
          className={`fixed bottom-24 right-0 bg-white shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 ease-in-out transform ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            minWidth: "300px",
            minHeight: "300px",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
          }}
        >
          {/* Resize Handles */}
          <div
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-100"
            onMouseDown={startResize("top")}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-100"
            onMouseDown={startResize("top-left")}
          />
          <div
            className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize hover:bg-blue-100"
            onMouseDown={startResize("left")}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize hover:bg-blue-100"
            onMouseDown={startResize("bottom-left")}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-100"
            onMouseDown={startResize("bottom")}
          />

          <div ref={containerRef} className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-blue-600 text-white px-5 py-4 font-semibold flex justify-between items-center">
              Codeit Chatbot 🤖
              <button
                onClick={toggleChat}
                className="text-white text-2xl leading-none hover:text-red-300 transition"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="p-4 text-gray-800 flex-grow overflow-y-auto border-b border-gray-200 text-sm"
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
                      msg.sender === "user"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    } max-w-[80%] whitespace-pre-wrap`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
              {isLoading && (
                <div className="text-left mb-3">
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
                    <div className="flex gap-1 items-center justify-start h-5">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-0"></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 p-3 border-t border-gray-200 shrink-0"
            >
              <div className="relative flex-grow">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 pr-8"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition relative"
                  aria-label="Send message"
                  disabled={isLoading}
                >
                  <PaperAirplaneIcon className="w-5 h-5 rotate-0" />
                  <span className="tooltip">Send</span>
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={clearChat}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition relative"
                  aria-label="Clear chat"
                  disabled={isLoading}
                >
                  <TrashIcon className="w-5 h-5" />
                  <span className="tooltip">Clear</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS for Animations, Tooltips, and Resize */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .animate-bounce {
            animation: bounce 0.6s infinite;
          }
          .delay-0 { animation-delay: 0s; }
          .delay-150 { animation-delay: 0.15s; }
          .delay-300 { animation-delay: 0.3s; }
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
            z-index: 60;
          }
          button:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
