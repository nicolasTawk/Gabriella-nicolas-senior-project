import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import api from '../../http-common'; // Make sure this points to your axios instance with baseURL: 'http://localhost:3000/api'
import './ChatBot.scss';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessageText = input.trim();
    const userMessage = { from: 'user', text: userMessageText };

    // Add user message locally first
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');

    // Prepare conversation formatted for backend API
    const conversation = [
      ...messages.map((m) => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: userMessageText },
    ];

    try {
      // POST to your backend chatbot API
      const response = await api.post('/users/chat', { messages: conversation });

      // Extract reply from backend response
      const botReply = response.data.answer || "Sorry, I couldn't understand that.";
      setMessages((msgs) => [...msgs, { from: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      setMessages((msgs) => [
        ...msgs,
        {
          from: 'bot',
          text: 'Sorry, something went wrong. Please try again later.',
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chatbot__toggle"
          aria-label="Open chat"
          onClick={() => setIsOpen(true)}
        >
          <FaComments size={24} />
        </button>
      )}

      {isOpen && (
        <section
          className="chatbot"
          role="dialog"
          aria-modal="true"
          aria-label="Chatbot"
        >
          <header className="chatbot__header">
            <h2 className="chatbot__title">Chatbot</h2>
            <button
              className="chatbot__close"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </header>

          <div className="chatbot__messages" aria-live="polite">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot__message chatbot__message--${msg.from}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="chatbot__form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              className="chatbot__input"
              rows={2}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Chat message input"
            />
            <button
              type="submit"
              className="primary-btn chatbot__send mt-0"
              aria-label="Send message"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default ChatBot;
