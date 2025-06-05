import { useEffect, useState, useRef } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // Chatbox open/close
  const [message, setMessage] = useState(""); // Input message
  const [isExpanded, setIsExpanded] = useState(true); // Button expand/collapse
  const [showButton, setShowButton] = useState(true); // Show/hide button on click
  const containerRef = useRef(null);

  // Auto collapse button after 2s on load
  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Click outside handler to close chat and show button again
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        // Close chatbox, show button, collapse button
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

  // Toggle chat open/close and hide/show button accordingly
  const toggleChat = () => {
    if (!isOpen) {
      // Opening chat: hide button, open chat, expand button state
      setShowButton(false);
      setIsOpen(true);
      setIsExpanded(true);
    } else {
      // Closing chat: close chat, show button, collapse after short delay
      setIsOpen(false);
      setShowButton(true);
      // Collapse button after reappears
      setTimeout(() => setIsExpanded(false), 100);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      alert(`🧠 Chatbot says: "You said - ${message}"`);
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
              &times;
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-5 text-gray-700 flex-grow overflow-y-auto border-b border-gray-200 text-sm">
            <p className="mb-3">👋 Hi there! How can I help you today?</p>
            {/* Future: chat messages map here */}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
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
