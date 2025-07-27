import { useState, useEffect, useRef } from 'react';
import useRequest from '../hooks/use-request';

const ThomasPage = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
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

  const { doRequest, errors } = useRequest({
    url: '/api/insights/thomas/chat',
    method: 'post',
    body: {},
    onSuccess: (data) => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }
  });

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
    const queryText = inputValue; 
    setInputValue('');
    setIsLoading(true);

    try {
      await doRequest({ query: queryText });
    } catch (error) {
      console.error('Thomas chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error processing your query. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBotMessage = (content) => {
    if (!content) return content;
    
    let text = content.trim();
    
    // Check for worksheet-specific patterns
    if (text.includes('worksheet') && text.includes('Created on:')) {
      return formatWorksheetResponse(text);
    }
    
    // Check for numbered lists
    const numberedItemsRegex = /\d+\./g;
    const numberedMatches = text.match(numberedItemsRegex);
    
    if (numberedMatches && numberedMatches.length >= 2) {
      return formatNumberedList(text);
    }
    
    // Default paragraph formatting
    return formatParagraphs(text);
  };

  const formatWorksheetResponse = (text) => {
    // Split by worksheet sections
    const worksheetPattern = /(\d+\.\s*"[^"]+"\s*worksheet\s*-\s*Created on:[^.]*\.)/g;
    const matches = [...text.matchAll(worksheetPattern)];
    
    if (matches.length >= 2) {
      const beforeWorksheets = text.substring(0, matches[0].index).trim();
      const afterWorksheets = text.substring(matches[matches.length - 1].index + matches[matches.length - 1][0].length).trim();
      
      return (
        <div className="bot-formatted-content">
          {beforeWorksheets && (
            <div className="bot-paragraph">
              {beforeWorksheets}
            </div>
          )}
          
          <div className="worksheet-list">
            {matches.map((match, index) => {
              const worksheetText = match[1];
              const parts = worksheetText.split(' - ');
              const title = parts[0].replace(/^\d+\.\s*/, '');
              const details = parts.slice(1).join(' - ');
              
              return (
                <div key={index} className="worksheet-item">
                  <div className="worksheet-title">{title}</div>
                  <div className="worksheet-details">{details}</div>
                </div>
              );
            })}
          </div>
          
          {afterWorksheets && (
            <div className="bot-paragraph">
              {afterWorksheets}
            </div>
          )}
        </div>
      );
    }
    
    return formatParagraphs(text);
  };

  const formatNumberedList = (text) => {
    const listPattern = /(\d+\.\s*[^?]*?\?)/g;
    const foundItems = [...text.matchAll(listPattern)];
    
    if (foundItems.length >= 2) {
      const firstItemStart = foundItems[0].index;
      const beforeList = text.substring(0, firstItemStart).trim();
      const listItems = foundItems.map(match => match[1].trim());
      const lastItemEnd = foundItems[foundItems.length - 1].index + foundItems[foundItems.length - 1][0].length;
      const afterList = text.substring(lastItemEnd).trim();
      
      return (
        <div className="bot-formatted-content">
          {beforeList && (
            <div className="bot-paragraph">
              {beforeList}
            </div>
          )}
          
          <div className="bot-list-container">
            <div className="list-header">Here are your options:</div>
            {listItems.map((item, index) => (
              <div key={index} className="bot-list-item numbered">
                <span className="list-number">{index + 1}.</span>
                <span className="list-content">{item.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
          
          {afterList && (
            <div className="bot-paragraph">
              {afterList}
            </div>
          )}
        </div>
      );
    }
    
    return formatParagraphs(text);
  };

  const formatParagraphs = (text) => {
    const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
    let sections = [];
    let currentParagraph = '';
    
    sentences.forEach((sentence, index) => {
      sentence = sentence.trim();
      
      const shouldBreak = sentence.match(/^(But |However |Also |I also |Would you |Remember |What would |Instead |Perhaps |While I |I should |I notice |Looking at)/i) ||
                         (currentParagraph.length > 80 && sentence.match(/^(I see |I can see |This |That |You |Your )/i)) ||
                         currentParagraph.length > 150;
                         
      if (shouldBreak && currentParagraph.trim()) {
        sections.push({ type: 'paragraph', content: currentParagraph.trim() });
        currentParagraph = sentence;
      } else {
        currentParagraph += (currentParagraph ? ' ' : '') + sentence;
      }
      
      if (index === sentences.length - 1 && currentParagraph.trim()) {
        sections.push({ type: 'paragraph', content: currentParagraph.trim() });
      }
    });
    
    return (
      <div className="bot-formatted-content">
        {sections.map((section, index) => (
          <div key={index} className="bot-paragraph">
            {section.content}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`thomas-page ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="elegant-silver-title-v2">
              <i className="fas fa-comment-dots me-3"></i>
              Chat with Thomas
            </h1>
            <div className="elegant-separator"></div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {/* Display hook errors if any */}
        {errors && (
          <div className="message bot">
            <div className="message-content">
              <div className="message-text error">
                {errors}
              </div>
            </div>
          </div>
        )}

                    {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  <div className="message-text">
                    {message.type === 'bot' ? formatBotMessage(message.content) : (
                      <div className="user-message-box">
                        {message.content}
                      </div>
                    )}
                  </div>
                  <div className="message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
        
                    {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-text">Thomas is thinking<span className="loading-dots">...</span></div>
                </div>
              </div>
            )}
        
        <div ref={messagesEndRef} />
      </div>

            {/* Modern AI Input Bar */}
      <div className="modern-input-container">
        <div className="input-center-wrapper">
          <form onSubmit={handleSubmit} className="modern-chat-form">
            <div className="modern-input-group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Thomas about your learning progress, coding challenges, or study guidance..."
                className="modern-chat-input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="modern-send-button"
                disabled={!inputValue.trim() || isLoading}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* All existing styles remain exactly the same */}
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
          background: transparent;
          border-bottom: none;
          padding: 2rem 0 1rem;
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
          transition: all 0.3s ease;
        }

        /* Adjust header centering for sidebar states */
        @media (min-width: 769px) {
          .header-content {
            margin-left: calc(50% - 400px - 140px); /* Center accounting for sidebar */
          }
          
          .sidebar.collapsed ~ .thomas-page .header-content {
            margin-left: calc(50% - 400px - 36px); /* Center accounting for collapsed sidebar */
          }
        }

        .elegant-silver-title-v2 {
          font-family: 'Playfair Display', serif !important;
          font-size: 3rem !important;
          font-weight: 900 !important;
          color: #c0c4cc !important;
          text-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 3px 12px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2) !important;
          margin-bottom: 1rem !important;
          line-height: 1.2 !important;
          background: none !important;
          background-image: none !important;
          background-clip: unset !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
          text-fill-color: unset !important;
        }

        h1.elegant-silver-title-v2,
        .thomas-page h1.elegant-silver-title-v2 {
          color: #c0c4cc !important;
          background: none !important;
          -webkit-text-fill-color: unset !important;
        }

        .elegant-separator {
          width: 280px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.3), #c0c0c0, #d3d3d3, rgba(211, 211, 211, 0.3), transparent);
          margin: 1rem auto 0;
          border-radius: 1px;
          box-shadow: 0 0 15px rgba(192, 192, 192, 0.3);
        }

        .messages-container {
          flex: 1;
          padding: 2rem 0 120px 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }
        
        .messages-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.02) 0%, transparent 50%);
          pointer-events: none;
        }

        .message {
          display: flex;
          align-items: flex-start;
          animation: messageSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
          padding: 2rem 0;
          max-width: 100%;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.bot {
          justify-content: flex-start;
        }
        
        @keyframes messageSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }



        .message-content {
          max-width: 90%;
        }

        .message.user .message-content {
          text-align: right;
        }

        .message.bot .message-content {
          text-align: left;
        }



        .message-text {
          font-size: 1.7rem;
          line-height: 1.7;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
          color: #f8fafc;
        }

        .message.user .message-text {
          color: #6366f1;
          font-weight: 500;
        }

        .user-message-box {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 1.5rem 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 1.7rem;
          line-height: 1.6;
          max-width: 100%;
          word-wrap: break-word;
          position: relative;
          overflow: hidden;
        }

        .user-message-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }

        .message-text.error {
          color: #dc2626;
          background: #fef2f2;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border-left: 4px solid #dc2626;
        }

        .typing-text {
          font-style: italic;
          color: #cbd5e1;
          font-size: 1.7rem;
        }

        .bot-formatted-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .bot-paragraph {
          margin: 0;
          line-height: 1.6;
          text-align: justify;
          hyphens: auto;
          font-size: 1.7rem;
          color: #f8fafc;
        }

        .bot-list-item {
          margin: 0.25rem 0;
          padding-left: 1rem;
          position: relative;
          line-height: 1.5;
          font-size: 1.7rem;
          color: #f8fafc;
        }

        .bot-list-container {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(139, 92, 246, 0.04));
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.15);
          border-left: 4px solid rgba(99, 102, 241, 0.4);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.08);
          position: relative;
          overflow: hidden;
        }

        .bot-list-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
        }

        .list-header {
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 1rem;
          font-size: 1.6rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .list-header::before {
          content: '💡';
          font-size: 1.1rem;
        }

        .bot-list-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6rem;
          width: 4px;
          height: 4px;
          background: rgba(99, 102, 241, 0.6);
          border-radius: 50%;
        }

        .bot-list-item.numbered {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.75rem 0 0.75rem 1rem;
          margin: 0.5rem 0;
          line-height: 1.6;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .bot-list-item.numbered:hover {
          background: rgba(99, 102, 241, 0.08);
          transform: translateX(4px);
        }

        .bot-list-item.numbered::before {
          display: none;
        }

        .list-number {
          font-weight: 700;
          color: #6366f1;
          min-width: 2rem;
          flex-shrink: 0;
          font-size: 1.6rem;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          text-align: center;
        }

        .list-content {
          flex: 1;
          line-height: 1.7;
          padding-top: 0.1rem;
          font-size: 1.7rem;
          color: #f8fafc;
        }

        /* Worksheet List Styling */
        .worksheet-list {
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .worksheet-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .worksheet-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .worksheet-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .worksheet-details {
          font-size: 1.5rem;
          color: #cbd5e1;
          line-height: 1.6;
        }

        .message-time {
          font-size: 0.85rem;
          opacity: 0.5;
          font-weight: 400;
          position: relative;
          z-index: 1;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .message.user .message-time {
          text-align: right;
        }

        .message.bot .message-time {
          text-align: left;
        }

        .typing-text {
          font-style: italic;
          color: #cbd5e1;
          font-size: 1.7rem;
        }

        .loading-dots {
          display: inline-block;
          animation: loadingDots 1.4s infinite;
        }

        @keyframes loadingDots {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Modern AI Input Container */
        .modern-input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: transparent;
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(226, 232, 240, 0.3);
          padding: 1.5rem 0;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
        }

        .modern-input-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.2), transparent);
        }

        .input-center-wrapper {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .modern-chat-form {
          width: 100%;
        }

        .modern-input-group {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 24px;
          padding: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .modern-input-group:focus-within {
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
          background: rgba(15, 23, 42, 0.95);
        }

        /* Modern Chat Input */
        .modern-chat-input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: none;
          border-radius: 20px;
          font-size: 1.4rem;
          background: transparent;
          color: #f1f5f9;
          font-family: inherit;
          line-height: 1.5;
          outline: none;
          transition: all 0.3s ease;
        }

        .modern-chat-input::placeholder {
          color: #94a3b8;
          opacity: 1;
          font-size: 1.4rem;
        }

        .modern-chat-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Modern Send Button */
        .modern-send-button {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .modern-send-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        .modern-send-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Dark mode overrides for modern input */
        .dark-mode .modern-input-group {
          background: rgba(15, 23, 42, 0.9);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .dark-mode .modern-chat-input {
          background: transparent;
          color: #f1f5f9;
        }

        .dark-mode .modern-chat-input::placeholder {
          color: #94a3b8;
        }

        .dark-mode .modern-input-container {
          background: rgba(255, 255, 255, 0.95);
          border-top-color: rgba(226, 232, 240, 0.8);
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
            font-size: 1.2rem;
          }

          .messages-container {
            padding: 1rem 0 100px 0;
            gap: 1.5rem;
          }

          .message-content {
            max-width: 85%;
          }

          .message-bubble {
            padding: 1.25rem 1.5rem;
          }

          .modern-input-container {
            padding: 1rem 0;
          }

          .input-center-wrapper {
            padding: 0 1rem;
          }

          .modern-input-group {
            gap: 0.5rem;
            padding: 0.375rem;
          }

          .modern-send-button {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }

          .modern-chat-input {
            font-size: 1.2rem;
          }

          .modern-chat-input::placeholder {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .creator-header {
            padding: 1.5rem 0;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .messages-container {
            padding: 0.75rem 0 90px 0;
            gap: 1rem;
          }

          .message-content {
            max-width: 90%;
          }

          .message-bubble {
            padding: 1rem 1.25rem;
          }

          .message-text {
            font-size: 1.5rem;
          }

          .modern-input-container {
            padding: 0.75rem 0;
          }

          .input-center-wrapper {
            padding: 0 0.75rem;
          }

          .modern-input-group {
            gap: 0.375rem;
            padding: 0.25rem;
          }

          .modern-send-button {
            width: 32px;
            height: 32px;
            font-size: 0.8rem;
          }

          .modern-chat-input {
            font-size: 1.1rem;
          }

          .modern-chat-input::placeholder {
            font-size: 1.1rem;
          }
        }

        /* Text selection styling */
        .thomas-page ::selection {
          background: rgba(99, 102, 241, 0.3);
          color: #1e293b;
        }

        .thomas-page ::-moz-selection {
          background: rgba(99, 102, 241, 0.3);
          color: #1e293b;
        }

        /* Message text selection */
        .message-text ::selection {
          background: rgba(99, 102, 241, 0.4);
          color: #1e293b;
        }

        .message-text ::-moz-selection {
          background: rgba(99, 102, 241, 0.4);
          color: #1e293b;
        }

        /* Input text selection */
        .modern-chat-input::selection {
          background: rgba(99, 102, 241, 0.4);
          color: #1e293b;
        }

        .modern-chat-input::-moz-selection {
          background: rgba(99, 102, 241, 0.4);
          color: #1e293b;
        }

        /* Scrollbar styling for the page */
        .thomas-page::-webkit-scrollbar {
          width: 6px;
        }

        .thomas-page::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .thomas-page::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .thomas-page::-webkit-scrollbar-thumb:hover {
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