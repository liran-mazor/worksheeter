import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

const NewWorksheet = ({ currentUser }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState(['']);
  const [questions, setQuestions] = useState(['']);
  const [isVisible, setIsVisible] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/signup');
      return;
    }
    setIsVisible(true);
  }, [currentUser, router]);

  const { doRequest, errors } = useRequest({
    url: '/api/worksheets',
    method: 'post',
    body: {
      title,
      keywords: keywords.filter(k => k.trim().length > 0),
      questions: questions.filter(q => q.trim().length > 0)
    },
    onSuccess: (worksheet) => {
      Router.push(`/worksheets/${worksheet.id}`);
    }
  });

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirecting to sign in...</p>
      </div>
    );
  }

  const addKeyword = () => {
    setKeywords([...keywords, '']);
  };

  const updateKeyword = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const removeKeyword = (index) => {
    if (keywords.length > 1) {
      setKeywords(keywords.filter((_, i) => i !== index));
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    const filteredKeywords = keywords.filter(k => k.trim().length > 0);
    const filteredQuestions = questions.filter(q => q.trim().length > 0);
    
    if (filteredKeywords.length === 0 || filteredQuestions.length === 0) {
      return;
    }

    await doRequest();
  };

  const isFormValid = title.trim() && 
                      keywords.filter(k => k.trim().length > 0).length > 0 && 
                      questions.filter(q => q.trim().length > 0).length > 0;

  return (
    <div className={`worksheet-creator ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-plus-circle me-3"></i>
              Create New Worksheet
            </h1>
            <p className="page-subtitle">
              Create a custom worksheet with your own keywords and questions
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="creator-layout">
          {/* Main Content */}
          <div className="creator-main">
            <form onSubmit={onSubmit} className="creator-form">
              {/* Title Input */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <i className="fas fa-heading me-2"></i>
                    Worksheet Title
                  </h3>
                  <p className="section-description">
                    Give your worksheet a descriptive name
                  </p>
                </div>

                <div className="input-group-modern">
                  <div className={`input-wrapper ${titleFocused || title ? 'focused' : ''}`}>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      onFocus={() => setTitleFocused(true)}
                      onBlur={() => setTitleFocused(false)}
                      className="input-modern"
                      placeholder="e.g., Biology Chapter 5 - Photosynthesis"
                      required
                    />
                    <label className="label-modern">Worksheet Title</label>
                    <div className="input-highlight"></div>
                  </div>
                </div>
              </div>

              {/* Keywords Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <i className="fas fa-key me-2"></i>
                    Keywords ({keywords.filter(k => k.trim()).length})
                  </h3>
                  <p className="section-description">
                    Add important terms and concepts for this worksheet
                  </p>
                </div>

                <div className="keywords-container">
                  <div className="keywords-grid">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="keyword-item">
                        <input
                          type="text"
                          value={keyword}
                          onChange={e => updateKeyword(index, e.target.value)}
                          className="keyword-input"
                          placeholder="Enter keyword"
                        />
                        {keywords.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="remove-keyword"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="add-keyword-btn"
                    disabled={keywords.length >= 30}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Keyword
                    {keywords.length >= 30 && <span className="limit-text">(Maximum 30)</span>}
                  </button>
                </div>
              </div>

              {/* Questions Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <i className="fas fa-question-circle me-2"></i>
                    Questions ({questions.filter(q => q.trim()).length})
                  </h3>
                  <p className="section-description">
                    Add study questions related to your topic
                  </p>
                </div>

                <div className="questions-container">
                  <div className="questions-list">
                    {questions.map((question, index) => (
                      <div key={index} className="question-item">
                        <div className="question-number">{index + 1}</div>
                        <div className="question-input-wrapper">
                          <textarea
                            value={question}
                            onChange={e => updateQuestion(index, e.target.value)}
                            className="question-input"
                            placeholder="Enter your question"
                            rows="2"
                          />
                        </div>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="remove-question"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="add-question-btn"
                    disabled={questions.length >= 30}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Question
                    {questions.length >= 30 && <span className="limit-text">(Maximum 30)</span>}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {errors && (
                <div className="alert-modern error">
                  <div className="alert-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">Creation Failed</div>
                    <div className="alert-message">{errors}</div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`btn-primary ${!isFormValid ? 'disabled' : ''}`}
                >
                  <i className="fas fa-check me-2"></i>
                  Create Worksheet
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="creator-sidebar">
            <div className="sidebar-card">
              <div className="card-header">
                <h4 className="card-title">
                  <i className="fas fa-lightbulb me-2"></i>
                  Tips for Great Worksheets
                </h4>
              </div>
              <div className="card-content">
                <div className="tip-item">
                  <div className="tip-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="tip-text">
                    Use specific, focused keywords that capture key concepts
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="tip-text">
                    Write clear, specific questions that test understanding
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="tip-text">
                    Include a mix of recall and application questions
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="tip-text">
                    Keep questions concise and focused on one concept each
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <div className="card-header">
                <h4 className="card-title">
                  <i className="fas fa-chart-bar me-2"></i>
                  Worksheet Summary
                </h4>
              </div>
              <div className="card-content">
                <div className="summary-stat">
                  <div className="stat-icon">
                    <i className="fas fa-heading"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Title</div>
                    <div className="stat-value">{title || 'Untitled'}</div>
                  </div>
                </div>
                
                <div className="summary-stat">
                  <div className="stat-icon">
                    <i className="fas fa-key"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Keywords</div>
                    <div className="stat-value">{keywords.filter(k => k.trim()).length}</div>
                  </div>
                </div>
                
                <div className="summary-stat">
                  <div className="stat-icon">
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Questions</div>
                    <div className="stat-value">{questions.filter(q => q.trim()).length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .worksheet-creator {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .worksheet-creator.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .creator-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 3rem 0 2rem;
          margin-bottom: 3rem;
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

        .breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #6366f1;
        }

        .breadcrumb-item.active {
          font-weight: 600;
        }

        .breadcrumb i {
          font-size: 0.7rem;
          opacity: 0.7;
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

        .creator-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          padding-bottom: 4rem;
        }

        .creator-main {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .creator-form {
          padding: 2.5rem;
        }

        .form-section {
          margin-bottom: 3rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .section-description {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        .input-group-modern {
          position: relative;
        }

        .input-wrapper {
          position: relative;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .input-wrapper.focused {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .input-modern {
          width: 100%;
          background: transparent;
          border: none;
          padding: 1.25rem;
          color: #1e293b;
          font-size: 1rem;
          outline: none;
          z-index: 2;
          position: relative;
        }

        .input-modern::placeholder {
          color: #94a3b8;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .input-wrapper.focused .input-modern::placeholder {
          opacity: 1;
        }

        .label-modern {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .input-wrapper.focused .label-modern {
          top: 0.75rem;
          font-size: 0.75rem;
          color: #6366f1;
          transform: translateY(0);
        }

        .input-highlight {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .input-wrapper.focused .input-highlight {
          width: 100%;
        }

        .keywords-container,
        .questions-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
        }

        .keywords-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .keyword-item {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .keyword-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .keyword-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .remove-keyword,
        .remove-question {
          width: 32px;
          height: 32px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-keyword:hover,
        .remove-question:hover {
          background: #dc2626;
          transform: scale(1.05);
        }

        .add-keyword-btn,
        .add-question-btn {
          background: white;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-keyword-btn:hover:not(:disabled),
        .add-question-btn:hover:not(:disabled) {
          border-color: #6366f1;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .add-keyword-btn:disabled,
        .add-question-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .limit-text {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-left: 0.5rem;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .question-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .question-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }

        .question-input-wrapper {
          flex: 1;
        }

        .question-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          resize: vertical;
          min-height: 60px;
          font-family: inherit;
        }

        .question-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .alert-modern {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          animation: slideInDown 0.4s ease;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-icon i {
          color: #ef4444;
          font-size: 1.1rem;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          color: #ef4444;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .alert-message {
          color: #ef4444;
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.875rem 2rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
        }

        .btn-primary:hover:not(.disabled) {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.35);
        }

        .btn-primary.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .creator-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 1px solid #e2e8f0;
          padding: 1.25rem;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .card-content {
          padding: 1.25rem;
        }

        .tip-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .tip-item:last-child {
          margin-bottom: 0;
        }

        .tip-icon {
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tip-icon i {
          color: white;
          font-size: 0.7rem;
        }

        .tip-text {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .summary-stat {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .summary-stat:last-child {
          margin-bottom: 0;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          color: #1e293b;
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .creator-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .creator-sidebar {
            order: -1;
          }

          .page-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .creator-header {
            padding: 2rem 0 1.5rem;
            margin-bottom: 2rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1.1rem;
          }

          .creator-form {
            padding: 1.5rem;
          }

          .form-section {
            margin-bottom: 2rem;
          }

          .keywords-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
          }

          .summary-stat {
            padding: 0.5rem;
          }

          .stat-icon {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 480px) {
          .creator-header {
            padding: 1.5rem 0 1rem;
            margin-bottom: 1.5rem;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .creator-form {
            padding: 1rem;
          }

          .card-header,
          .card-content {
            padding: 1rem;
          }

          .question-item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .question-number {
            align-self: flex-start;
            margin-top: 0;
          }

          .remove-question {
            align-self: flex-end;
            margin-top: 0.5rem;
          }

          .breadcrumb {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

NewWorksheet.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
  }
  return {};
};

export default NewWorksheet;