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
    // Clear messages on page load
    localStorage.removeItem("chatbotMessages");
    return [{ text: "SERVICE_MENU", sender: "bot", isServiceMenu: true }];
  });
  const [sessionId, setSessionId] = useState(() => {
    // Generate new session ID on page load
    const newSessionId = uuidv4();
    localStorage.setItem("chatbotSessionId", newSessionId);
    return newSessionId;
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

  // Service options for the menu
  const serviceOptions = [
    "Web Development: Custom websites & e-commerce",
    "Mobile Apps: iOS & Android solutions",
    "UI/UX Design: User-friendly interfaces",
    "Cloud Solutions: Scalable infrastructure",
    "Digital Marketing: SEO & social media",
    "AI & ML: Smart automation",
  ];

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

  // Toggle chat and initialize with service menu
  const toggleChat = async () => {
    if (!isOpen) {
      setShowButton(false);
      setIsOpen(true);
      setIsExpanded(true);
      let newSessionId = sessionId;

      if (!newSessionId) {
        newSessionId = uuidv4();
        setSessionId(newSessionId);
        localStorage.setItem("chatbotSessionId", newSessionId);
      }

      // Initialize with service menu
      setMessages([
        { text: "SERVICE_MENU", sender: "bot", isServiceMenu: true },
      ]);
      localStorage.setItem(
        "chatbotMessages",
        JSON.stringify([
          { text: "SERVICE_MENU", sender: "bot", isServiceMenu: true },
        ])
      );

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setIsOpen(false);
      setShowButton(true);
      setTimeout(() => setIsExpanded(false), 300);
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
    setMessages([{ text: "SERVICE_MENU", sender: "bot", isServiceMenu: true }]);
    localStorage.setItem(
      "chatbotMessages",
      JSON.stringify([
        { text: "SERVICE_MENU", sender: "bot", isServiceMenu: true },
      ])
    );
    inputRef.current?.focus();
  };

  // Start resizing
  const startResize = (direction) => (e) => {
    e.preventDefault();
    setIsResizing(direction);
  };

  // Handle service button click
  const handleServiceClick = async (service) => {
    const serviceKey = service
      .split(":")[0]
      .trim()
      .toLowerCase()
      .replace(" & ", " and ");
    setMessages((prev) => [...prev, { text: service, sender: "user" }]);
    await sendMessage(serviceKey);
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
          ref={resizeRef}
          className={`fixed bottom-24 right-0 bg-white shadow-2xl z-50 overflow-hidden flex flex-col
    transform transition-all duration-900 ease-in-out
    ${
      isOpen
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-75 translate-y-12 pointer-events-none"
    }`}
          style={{
            willChange: "transform, opacity",
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
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize"
            onMouseDown={startResize("top")}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
            onMouseDown={startResize("top-left")}
          />
          <div
            className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize"
            onMouseDown={startResize("left")}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
            onMouseDown={startResize("bottom-left")}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize"
            onMouseDown={startResize("bottom")}
          />

          <div ref={containerRef} className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-sky-700 text-white px-5 py-4 font-semibold flex justify-between items-center">
              CodeIt Chatbot 🤖
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
              className="p-4 text-gray-800 flex-grow overflow-y-auto border-b border-sky-100 text-sm"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.isServiceMenu ? (
                    <div className="flex flex-col items-center text-center text-gray-600 rounded-lg p-4 bg-sky-50">
                      <p className="text-lg font-semibold mb-4">
                        What can I help you with? 🌟
                      </p>
                      <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                        {serviceOptions.map((service, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleServiceClick(service)}
                            className="bg-sky-100 hover:bg-sky-200 text-sky-800 px-4 py-2 rounded-lg text-left text-sm transition"
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`inline-block px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-sky-300 text-sky-900"
                          : "bg-sky-100 text-sky-800"
                      } max-w-[80%] whitespace-pre-wrap`}
                    >
                      {msg.text}
                    </p>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="text-left mb-3">
                  <div className="inline-block px-4 py-2 rounded-lg bg-sky-50">
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
              className="flex items-center gap-2 p-3 border-t border-sky-100 shrink-0"
            >
              <div className="relative flex-grow">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500 pr-8"
                  disabled={isLoading}
                />
                {message && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sky-400 hover:text-sky-600"
                    aria-label="Clear input"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="relative">
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-lg transition relative"
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
                  className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-lg transition relative"
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
