import React, { useState, useRef, useEffect } from "react";
import "../styles/Chatbot.css";
import axios from 'axios';


const Chatbot = ({ patientId }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there 👋\nHow can I help you today?", type: "incoming" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const chatboxRef = useRef(null);
  const chatInputRef = useRef(null); // Create a ref for the chat input
  const inputInitHeight = useRef(0); // Store the initial height of the input

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  // No longer needed, handled by React state

  const generateResponse = async (userMsg) => {
    const API_URL = 'http://localhost:5000/api/chatbot/generate';
    // Add "Thinking..." message
    setMessages(prev => [...prev, { text: "Thinking...", type: "incoming" }]);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userMsg, patientId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Error from chatbot API');
      // Replace "Thinking..." with actual response
      setMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = {
          text: data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1") || 'No response',
          type: "incoming"
        };
        return msgs;
      });
    } catch (error) {
      setMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = {
          text: error.message,
          type: "incoming"
        };
        return msgs;
      });
    } finally {
      if (chatboxRef.current) {
        chatboxRef.current.scrollTo(0, chatboxRef.current.scrollHeight);
      }
    }
  };

  const handleChat = () => {
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) return;

    setUserMessage("");
    const chatInput = chatInputRef.current;
    if (chatInput) {
      chatInput.style.height = `${inputInitHeight.current}px`;
    }

    // Add user's message to state
    setMessages(prev => [...prev, { text: trimmedMessage, type: "outgoing" }]);

    setTimeout(() => {
      generateResponse(trimmedMessage);
    }, 600);
  };

  useEffect(() => {
    const chatInput = chatInputRef.current;
    if (chatInput) {
      inputInitHeight.current = chatInput.scrollHeight; // Set the initial height of the chat input when component mounts
    }
  }, []);

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
    // Adjust the height of the input textarea based on its content
    if (chatInputRef.current) {
      chatInputRef.current.style.height = `${inputInitHeight.current}px`;
      chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <>
      <button className="chatbot-toggler" onClick={toggleChatbot}>
        <span className="material-symbols-rounded">Chatbot</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      {isChatbotOpen && (
        <div className="chatbot">
          <header>
            <h2>Chatbot</h2>
            <span className="close-btn material-symbols-outlined" onClick={toggleChatbot}>
              close
            </span>
          </header>
          <div className="chatmsg">
          <ul className="chatbox" ref={chatboxRef}>
            {messages.map((msg, index) => (
              <li key={index} className={`chat ${msg.type}`}>
                {msg.type === "incoming" && (
                  <span className="material-symbols-outlined">Bot</span>
                )}
                <p>{msg.text}</p>
              </li>
            ))}
          </ul>
          </div>
          <div className="chat-input">
            <textarea
              ref={chatInputRef} // Assign ref to the chat input
              value={userMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter a message..."
              spellCheck="false"
              required
            />
            <span id="send-btn" className="material-symbols-rounded" onClick={handleChat}>
              send
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
