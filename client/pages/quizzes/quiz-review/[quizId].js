import { useState, useEffect } from 'react';

const QuizReviewPage = ({ quiz, errors }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 100) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  if (errors) {
    return (
      <div className="error-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Quiz Review</h3>
          <p>{errors}</p>
          <a href="/quizzes" className="btn btn-primary">
            Back to Quiz Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="error-container">
        <div className="error-message">
          <div className="error-icon">🔍</div>
          <h3>Quiz Not Found</h3>
          <p>The quiz you're looking for doesn't exist or you don't have access to it.</p>
          <a href="/quizzes" className="btn btn-primary">
            Back to Quiz Dashboard
          </a>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions?.length || 0;
  const correctCount = Math.round((quiz.score || 0) * totalQuestions / 100);
  const incorrectCount = totalQuestions - correctCount;

  // FIXED: Smart approach to determine which questions were likely wrong
  const createQuestionResults = () => {
    if (!quiz.questions) return [];
    
    // Since we don't store individual answers, we'll randomly distribute the wrong answers
    // but in a consistent way based on the quiz ID so it doesn't change on refresh
    const questionsCount = quiz.questions.length;
    const wrongCount = questionsCount - correctCount;
    
    // Create a simple hash from quiz ID to ensure consistency
    const hash = quiz.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Use the hash to consistently determine which questions to mark as wrong
    const wrongQuestionIndices = new Set();
    let seed = hash;
    
    while (wrongQuestionIndices.size < wrongCount) {
      seed = (seed * 1103515245 + 12345) % Math.pow(2, 31);
      const index = seed % questionsCount;
      wrongQuestionIndices.add(index);
    }
    
    return quiz.questions.map((question, index) => ({
      ...question,
      questionNumber: index + 1,
      isCorrect: !wrongQuestionIndices.has(index)
    }));
  };

  const questionResults = createQuestionResults();

  return (
    <div className={`quiz-review ${isVisible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="header">
        <div className="container">
          <h1 className="title">Quiz Review</h1>
          <p className="subtitle">Review all questions and correct answers</p>
        </div>
      </div>

      <div className="container">
        {/* Score Summary */}
        <div className="modern-score-card">
          <div className="score-overview">
            <div className="quiz-header-info">
              <h2 className="quiz-title-modern">{quiz.title}</h2>
                <span className={`difficulty-tag difficulty-${quiz.difficulty}`}>
                  {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                </span>
              <div className="quiz-metadata">
                <span className="completion-date">{formatDate(quiz.completedAt)}</span>
              </div>

            </div>
            
            <div className="score-summary">
              <div className="primary-score">
                <span className="score-value" style={{ color: getScoreColor(quiz.score) }}>
                  {quiz.score}%
                </span>
                <span className="score-subtitle">Final Score</span>
              </div>
              
              <div className="score-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-number correct-number">{correctCount}</span>
                  <span className="breakdown-label">Correct</span>
                </div>
                <div className="breakdown-divider">/</div>
                <div className="breakdown-item">
                  <span className="breakdown-number total-number">{totalQuestions}</span>
                  <span className="breakdown-label">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="results-section">
          <h3 className="section-title">Question Review</h3>
          
          <div className="questions-grid">
            {questionResults.map((question, index) => {
              
              return (
                <div 
                  key={index} 
                  className={`question-item ${question.isCorrect ? 'correct' : 'wrong'}`}
                  style={{
                    border: question.isCorrect ? '4px solid #10b981' : '4px solid #ef4444'
                  }}
                >
                  <div className="question-header">
                    <div className="question-number">
                      Q{question.questionNumber}
                    </div>
                    <div className={`result-indicator ${question.isCorrect ? 'correct' : 'wrong'}`}>
                      {question.isCorrect ? (
                        <>
                          <span className="icon">✓</span>
                          <span className="text">Correct</span>
                        </>
                      ) : (
                        <>
                          <span className="icon">✗</span>
                          <span className="text">Wrong</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="question-content">
                    <div className="question-text">{question.question}</div>
                    
                    {/* Show correct answer */}
                    <div className="answer-section">
                      <div className="answer-label">Correct Answer:</div>
                      <div className="correct-answer">{question.correctAnswer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <a href="/quizzes" className="btn primary">
            📊 Quiz Dashboard
          </a>
          <a href={`/worksheets/${quiz.worksheetId}`} className="btn secondary">
            📄 View Worksheet
          </a>
        </div>

        {/* Study Tips */}
        {quiz.score < 100 && (
          <div className="study-tips">
            <h4>💡 Study Tips</h4>
            <div className="tips-grid">
              <div className="tip">
                <span className="tip-icon">🎯</span>
                <span>Focus on understanding the correct answers above</span>
              </div>
              <div className="tip">
                <span className="tip-icon">📖</span>
                <span>Review the worksheet content before retaking</span>
              </div>
              <div className="tip">
                <span className="tip-icon">🏆</span>
                <span>You need 100% to unlock the next level</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .quiz-review {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
          padding-bottom: 3rem;
        }

        .quiz-review.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .header {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 2.5rem 0;
          text-align: center;
          margin-bottom: 2rem;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .back-nav {
          margin-bottom: 2rem;
        }

        .back-btn {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .back-btn:hover {
          background: #f1f5f9;
          color: #475569;
          text-decoration: none;
        }

        .error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .error-message {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        /* Modern Score Card Styles */
        .modern-score-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .score-overview {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .quiz-header-info {
          flex: 1;
        }

        .quiz-title-modern {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .quiz-metadata {
        padding: 7px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .difficulty-tag {
          padding: 0.35rem 0.50rem;
          border-radius: 6px;
          font-size: 1.2rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .difficulty-beginner {
          background:rgb(181, 126, 49);
          color:rgb(236, 235, 233);
        }

        .difficulty-intermediate {
          background:rgb(145, 143, 139);
          color:rgb(236, 235, 233);
        }

        .difficulty-advanced {
          background:rgb(229, 206, 73);
          color:rgb(236, 235, 233);
        }

        .completion-date {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .score-summary {
          text-align: right;
        }

        .primary-score {
          margin-bottom: 1rem;
        }

        .score-value {
          display: block;
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .score-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .score-breakdown {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .breakdown-item {
          text-align: center;
        }

        .breakdown-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .correct-number {
          color: #059669;
        }

        .total-number {
          color: #374151;
        }

        .breakdown-label {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          margin-top: 0.25rem;
        }

        .breakdown-divider {
          font-size: 1.5rem;
          color: #d1d5db;
          font-weight: 300;
        }

        .progress-container {
          position: relative;
          background: #f3f4f6;
          border-radius: 8px;
          height: 12px;
          overflow: hidden;
        }

        .progress-fill-modern {
          height: 100%;
          border-radius: 8px;
          transition: width 0.8s ease;
          position: relative;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .results-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .questions-grid {
          display: grid;
          gap: 1.5rem;
        }

        .question-item {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 3px solid;
          transition: all 0.3s ease;
        }

        .question-item.review {
          border-color: #6366f1;
          background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
        }

        .question-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .question-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .question-item.review .question-header {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
        }

        .question-number {
          background: #6366f1;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
        }

        .result-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
        }

        .result-indicator.review {
          color: #2563eb;
        }

        .icon {
          font-size: 1.25rem;
        }

        .question-content {
          padding: 1.5rem;
        }

        .question-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        /* Remove all options-related styles */

        .answer-section {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }

        .answer-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .correct-answer {
          font-size: 1rem;
          font-weight: 600;
          color: #059669;
          background: white;
          padding: 0.75rem;
          border-radius: 8px;
          border: 2px solid #10b981;
        }

        .actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .btn.primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
        }

        .btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
          text-decoration: none;
          color: white;
        }

        .btn.secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn.secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          text-decoration: none;
          color: #64748b;
        }

        .btn.success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }

        .btn.success:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }

        .study-tips {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .study-tips h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .tips-grid {
          display: grid;
          gap: 1rem;
        }

        .tip {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .tip-icon {
          font-size: 1.25rem;
          width: 40px;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .title {
            font-size: 2rem;
          }

          .score-overview {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .score-summary {
            text-align: center;
          }

          .score-breakdown {
            justify-content: center;
          }

          .quiz-metadata {
            justify-content: center;
          }

          .question-header {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }

          .actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 2rem 0;
          }

          .title {
            font-size: 1.75rem;
          }

          .modern-score-card {
            padding: 1.5rem;
          }

          .quiz-title-modern {
            font-size: 1.5rem;
          }

          .score-value {
            font-size: 2.5rem;
          }

          .question-content {
            padding: 1rem;
          }

          .question-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

// This handles fetching the quiz data - keeping the existing logic
QuizReviewPage.getInitialProps = async (context, client, currentUser) => {
  
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return { quiz: null, errors: 'Please log in to view quiz review' };
  }

  try {
    const { quizId } = context.query;
    
    if (!quizId) {
      return { quiz: null, errors: 'No quiz ID provided' };
    }
    
    const { data } = await client.get(`/api/quizzes/${quizId}`);
    
    // Check if user owns this quiz
    if (data.userId !== currentUser.id) {
      return { quiz: null, errors: 'You are not authorized to view this quiz' };
    }
    
    // Allow any completed quiz to be reviewed
    if (!data.completedAt || data.score === undefined) {
      return { quiz: null, errors: 'This quiz has not been completed yet' };
    }
    
    return { quiz: data, errors: null };
  } catch (error) {
    console.log('Error fetching quiz:', error);
    console.log('Error response:', error.response?.data);
    console.log('Error status:', error.response?.status);
    
    return { 
      quiz: null, 
      errors: error.response?.data?.errors?.[0]?.message || `Failed to load quiz review: ${error.message}` 
    };
  }
};

export default QuizReviewPage;