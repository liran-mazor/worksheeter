import { useState, useEffect, useRef } from 'react';

const ThomasPage = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    // Initial welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Hello ${currentUser?.email?.split('@')[0] || 'there'}! 👋 I'm Thomas, your AI learning assistant. I'm here to help you with your studies, answer questions about your worksheets, provide coding guidance, or discuss anything related to your learning journey. What would you like to explore today?`,
        timestamp: new Date()
      }
    ]);
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual Thomas API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I understand you're asking about "${userMessage.content}". This is a demo response. In the full implementation, I would analyze your question and provide personalized learning assistance based on your worksheets, coding progress, and quiz results.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`thomas-page ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-comment-dots me-3"></i>
              Chat with Thomas
            </h1>
            <p className="page-subtitle">
              Your AI learning assistant is ready to help with your studies
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container">
        <div className="chat-container">
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? (
                    <div className="thomas-avatar">
                      <svg viewBox="0 0 100 100" className="robot-svg">
                        <defs>
                          <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                        
                        {/* Robot Head */}
                        <rect x="25" y="20" width="50" height="45" rx="8" fill="url(#robotGradient)" />
                        
                        {/* Antenna */}
                        <circle cx="50" cy="15" r="3" fill="#ffffff" />
                        <line x1="50" y1="18" x2="50" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Eyes */}
                        <circle cx="38" cy="35" r="6" fill="#ffffff" />
                        <circle cx="62" cy="35" r="6" fill="#ffffff" />
                        <circle cx="38" cy="35" r="3" fill="#6366f1" />
                        <circle cx="62" cy="35" r="3" fill="#6366f1" />
                        
                        {/* Mouth */}
                        <rect x="43" y="48" width="14" height="8" rx="4" fill="#ffffff" />
                        <rect x="45" y="50" width="2" height="4" fill="#6366f1" />
                        <rect x="48" y="50" width="2" height="4" fill="#6366f1" />
                        <rect x="51" y="50" width="2" height="4" fill="#6366f1" />
                        <rect x="54" y="50" width="2" height="4" fill="#6366f1" />
                        
                        {/* Robot Body */}
                        <rect x="30" y="65" width="40" height="25" rx="6" fill="url(#robotGradient)" />
                        
                        {/* Control Panel */}
                        <rect x="35" y="70" width="30" height="15" rx="3" fill="#ffffff" />
                        <circle cx="42" cy="77" r="2" fill="#6366f1" />
                        <circle cx="50" cy="77" r="2" fill="#8b5cf6" />
                        <circle cx="58" cy="77" r="2" fill="#6366f1" />
                      </svg>
                    </div>
                  ) : (
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot">
                <div className="message-avatar">
                  <div className="thomas-avatar">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="typing-text">Thomas is thinking...</div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-form">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Thomas anything about your studies..."
                  className="chat-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .thomas-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
          padding-left: 280px; /* Account for sidebar */
        }

        .thomas-page.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Adjust for collapsed sidebar */
        @media (min-width: 769px) {
          .sidebar.collapsed ~ .thomas-page {
            padding-left: 72px;
          }
        }

        .creator-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 3rem 0 2rem;
          margin-bottom: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .header-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          margin: 0;
        }

        .chat-container {
          height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .thomas-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .robot-svg {
          width: 24px;
          height: 24px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #64748b, #94a3b8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
        }

        .message-content {
          flex: 1;
          max-width: 70%;
        }

        .message.user .message-content {
          display: flex;
          justify-content: flex-end;
        }

        .message-bubble {
          padding: 1rem 1.25rem;
          border-radius: 16px;
          position: relative;
        }

        .message.bot .message-bubble {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-bottom-left-radius: 4px;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-text {
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .message.user .message-time {
          text-align: right;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
          justify-content: center;
        }

        .typing-indicator span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6366f1;
          animation: typing 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }

        .typing-text {
          font-style: italic;
          color: #6b7280;
        }

        .chat-input-container {
          padding: 2rem;
          border-top: 1px solid #e2e8f0;
          background: #fafbfc;
          border-radius: 0 0 16px 16px;
        }

        .chat-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .input-wrapper {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          padding: 1rem 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
        }

        .chat-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .chat-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-button {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .send-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .send-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .thomas-page {
            padding-left: 0;
          }

          .container {
            padding: 0 1rem;
          }

          .creator-header {
            padding: 2rem 0;
            margin-bottom: 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .chat-container {
            height: calc(100vh - 160px);
          }

          .chat-messages {
            padding: 1rem;
            gap: 1rem;
          }

          .message-content {
            max-width: 85%;
          }

          .chat-input-container {
            padding: 1rem;
          }

          .input-wrapper {
            gap: 0.75rem;
          }

          .send-button {
            width: 44px;
            height: 44px;
          }
        }

        @media (max-width: 480px) {
          .creator-header {
            padding: 1.5rem 0;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .chat-messages {
            padding: 0.75rem;
          }

          .message-content {
            max-width: 90%;
          }

          .message-bubble {
            padding: 0.75rem 1rem;
          }

          .message-text {
            font-size: 0.9rem;
          }
        }

        /* Scrollbar styling */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

ThomasPage.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return {};
  }

  return {};
};

export default ThomasPage;