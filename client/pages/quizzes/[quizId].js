import { useState, useEffect } from 'react';

const QuizPage = ({ currentUser, quiz, errors }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const doRequest = async (body) => {
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const completedQuiz = await response.json();
        setQuizSubmitted(true);
        setScore(completedQuiz.score);
        setShowResults(true);
      } else {
        const errorData = await response.json();
        console.error('Quiz submission failed:', errorData);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  useEffect(() => {
    if (quizSubmitted || !quiz) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizSubmitted, quiz]);



  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, answer) => {

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    if (!quiz?.questions) return 0;
    
    let correct = 0;
    const detailedResults = [];
    
    quiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      
      const result = {
        questionNumber: index + 1,
        question: question.question,
        userAnswer: userAnswer || 'NOT_ANSWERED',
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        exactMatch: userAnswer === correctAnswer,
        userAnswerType: typeof userAnswer,
        correctAnswerType: typeof correctAnswer,
        userAnswerLength: userAnswer ? userAnswer.length : 0,
        correctAnswerLength: correctAnswer ? correctAnswer.length : 0
      };
      
      detailedResults.push(result);
      
      if (isCorrect) {
        correct++;
      }
    });
    
    const finalScore = Math.round((correct / quiz.questions.length) * 100);
    
    return finalScore;
  };

  const handleSubmitQuiz = async () => {
    if (quizSubmitted) return;
    
    const finalScore = calculateScore();
    
    await doRequest({ score: finalScore });
  };

  const getAnsweredCount = () => {
    return Object.keys(selectedAnswers).length;
  };

  const getDifficultyInfo = (difficulty) => {
    const info = {
      beginner: { label: 'Beginner', level: 1 },
      intermediate: { label: 'Intermediate', level: 2 },
      advanced: { label: 'Advanced', level: 3 }
    };
    return info[difficulty] || { label: difficulty, level: 1 };
  };

  if (!currentUser) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Authentication Required</h4>
          <p>Please sign in to take this quiz.</p>
          <a href="/auth/signin" className="btn btn-primary">Sign In</a>
        </div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error: {errors}</h4>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <a href="/quizzes" className="btn btn-primary">
              Back to Dashboard
            </a>
            <button 
              className="btn btn-outline-primary"
              onClick={() => window.location.reload()}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Quiz Not Found</h4>
          <p>The quiz you're looking for doesn't exist or you don't have access to it.</p>
          <a href="/quizzes" className="btn btn-primary">
            Back to Quiz Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (quiz.status === 'processing') {
    return (
      <div className="quiz-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Generating Your Quiz</h3>
          <p>Creating personalized questions based on your worksheet content...</p>
          <a href="/quizzes" className="btn btn-secondary">
            Back to Dashboard
          </a>
        </div>
        
        <style jsx>{`
          .quiz-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          }

          .loading-content {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
          }

          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #f1f5f9;
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-content h3 {
            color: #1e293b;
            margin-bottom: 1rem;
          }

          .loading-content p {
            color: #64748b;
            margin-bottom: 2rem;
          }
        `}</style>
      </div>
    );
  }

  if (quiz.status === 'failed') {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Quiz Generation Failed</h4>
          <p>We couldn't generate this quiz. Please try creating it again.</p>
          <a href="/quizzes" className="btn btn-primary">
            Back to Quiz Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (showResults) {
    const isPerfect = score === 100;
    const passed = score >= 70;
    const difficultyInfo = getDifficultyInfo(quiz.difficulty);
    
    return (
      <div className="quiz-results">
        <div className="container">
          <div className={`results-card ${isPerfect ? 'perfect' : passed ? 'good' : 'needs-work'}`}>
            <div className="results-header">
              <div className="score-display">
                <div className={`score-circle ${isPerfect ? 'perfect' : passed ? 'good' : 'needs-work'}`} id="quiz-score-circle">
                  <span className="quiz-score-number" id="quiz-score-number">{score}</span>
                  <span className="quiz-score-percent" id="quiz-score-percent">%</span>
                </div>
                <div className="score-details">
                  <h2 className="score-title">
                    {isPerfect && 'Perfect Score!'}
                    {!isPerfect && passed && 'Good Job!'}
                    {!passed && 'Keep Studying!'}
                  </h2>
                  <p className="score-description">
                    You got {Math.round(score * quiz.questions.length / 100)} out of {quiz.questions.length} questions correct
                  </p>
                </div>
              </div>
            </div>

            <div className="quiz-info">
              <div className="info-item">
                <span className="info-label">Worksheet</span>
                <span className="info-value">{quiz.title}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Difficulty</span>
                <div className="difficulty-display">
                  <span className="difficulty-name">{difficultyInfo.label}</span>
                  <div className="level-indicator">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`level-dot ${i < difficultyInfo.level ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
              <div className="results-actions">
              <a href="/quizzes" className="btn btn-secondary">
                Back to Dashboard
              </a>
              <a 
                href={`/quizzes/quiz-review/${quiz.id}`} 
                className="btn btn-primary"
              >
                Review Questions
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
                  .quiz-results {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          color: #f1f5f9;
        }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0 2rem;
          }

                  .results-card {
          border-radius: 24px;
          padding: 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, #1e293b, #334155);
          color: #f1f5f9;
          border: 2px solid #475569;
        }

          .results-card.perfect {
            background: linear-gradient(135deg, #1e293b, #334155);
            border: 3px solid #10b981;
            box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
          }

          .results-card.good {
            background: linear-gradient(135deg, #1e293b, #334155);
            border: 3px solid #f59e0b;
            box-shadow: 0 20px 60px rgba(245, 158, 11, 0.2);
          }

          .results-card.needs-work {
            background: linear-gradient(135deg, #1e293b, #334155);
            border: 3px solid #ef4444;
            box-shadow: 0 20px 60px rgba(239, 68, 68, 0.2);
          }

          .results-header {
            margin-bottom: 2rem;
          }

          .score-display {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .score-circle {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: 8px solid;
          }

          .score-circle.perfect {
            border-color: #10b981;
            background: linear-gradient(135deg, #ffffff, #f0fdf4);
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
          }

          .score-circle.good {
            border-color: #f59e0b;
            background: linear-gradient(135deg, #ffffff, #fffbeb);
            box-shadow: 0 8px 32px rgba(245, 158, 11, 0.4);
          }

          .score-circle.needs-work {
            border-color: #ef4444;
            background: linear-gradient(135deg, #ffffff, #fef2f2);
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
          }

          .score-number {
            font-size: 3rem !important;
            font-weight: 700 !important;
            color: #000000 !important;
          }

          .score-percent {
            font-size: 1.8rem !important;
            font-weight: 600 !important;
            color: #1e293b !important;
          }

          #quiz-score-number {
            font-size: 3rem !important;
            font-weight: 700 !important;
            color: #374151 !important;
          }

          #quiz-score-percent {
            font-size: 1.8rem !important;
            font-weight: 600 !important;
            color: #6b7280 !important;
          }

          .quiz-score-number {
            font-size: 3rem !important;
            font-weight: 700 !important;
            color: #374151 !important;
          }

          .quiz-score-percent {
            font-size: 1.8rem !important;
            font-weight: 600 !important;
            color: #6b7280 !important;
          }

          .score-circle #quiz-score-number {
            font-size: 3rem !important;
            font-weight: 700 !important;
            color: #374151 !important;
          }

          .score-circle #quiz-score-percent {
            font-size: 1.8rem !important;
            font-weight: 600 !important;
            color: #6b7280 !important;
          }

          .score-details {
            text-align: center;
          }

          .score-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 0.5rem 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .score-description {
            color: #e2e8f0;
            font-size: 1.3rem;
            margin: 0;
            font-weight: 500;
          }

          .quiz-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 2rem 0;
            padding: 2rem;
            background: rgba(71, 85, 105, 0.3);
            border-radius: 16px;
            border: 1px solid rgba(71, 85, 105, 0.5);
            backdrop-filter: blur(10px);
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .info-label {
            font-weight: 600;
            color: #ffffff;
            font-size: 1.1rem;
          }

          .info-value {
            color: #e2e8f0;
            font-size: 1.1rem;
            font-weight: 500;
          }

          .difficulty-display {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .difficulty-name {
            color: #e2e8f0;
            font-weight: 500;
            font-size: 1.1rem;
          }

          .level-indicator {
            display: flex;
            gap: 3px;
          }

          .level-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #e2e8f0;
          }

          .level-dot.active {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
          }

          .success-message {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));
            border: 2px solid #34d399;
            border-radius: 16px;
            padding: 2rem;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
          }

          .success-message h4 {
            color: #ffffff;
            margin: 0 0 0.5rem 0;
            font-weight: 600;
            font-size: 1.3rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .success-message p {
            color: #e2e8f0;
            margin: 0;
            font-size: 1.1rem;
            font-weight: 500;
          }

          .encouragement-message {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1));
            border: 2px solid #60a5fa;
            border-radius: 16px;
            padding: 2rem;
            margin: 2rem 0;
            backdrop-filter: blur(10px);
          }

          .encouragement-message h4 {
            color: #ffffff;
            margin: 0 0 0.5rem 0;
            font-weight: 600;
            font-size: 1.3rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .encouragement-message p {
            color: #e2e8f0;
            margin: 0;
            font-size: 1.1rem;
            font-weight: 500;
          }

          .results-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn {
            padding: 0.875rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            border: none;
            white-space: nowrap;
          }

          .btn-primary {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: 1px solid transparent;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
          }

          .btn-primary:hover {
            background: linear-gradient(135deg, #5855eb, #7c3aed);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
            text-decoration: none;
            color: white;
          }

          /* Dark Mode Styling for Results */
          .dark-mode .quiz-results {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
          }

          .dark-mode .results-card {
            background: #334155 !important;
            color: #f1f5f9 !important;
          }

          .dark-mode .results-card.perfect {
            background: #334155 !important;
            border-color: #10b981 !important;
          }

          .dark-mode .results-card.good {
            background: #334155 !important;
            border-color: #f59e0b !important;
          }

          .dark-mode .results-card.needs-work {
            background: #334155 !important;
            border-color: #ef4444 !important;
          }

          .dark-mode .score-title {
            color: #f1f5f9 !important;
          }

          .dark-mode .score-description {
            color: #cbd5e1 !important;
          }

          .dark-mode .quiz-info {
            background: #475569 !important;
            border-color: #475569 !important;
          }

          .dark-mode .info-label {
            color: #f1f5f9 !important;
          }

          .dark-mode .info-value {
            color: #cbd5e1 !important;
          }

          .dark-mode .difficulty-name {
            color: #cbd5e1 !important;
          }

          .dark-mode .btn-secondary {
            background: #334155 !important;
            color: #f1f5f9 !important;
            border-color: #475569 !important;
          }

          .dark-mode .btn-secondary:hover {
            background: #475569 !important;
            color: #f1f5f9 !important;
          }

          .btn-secondary {
            background: rgba(71, 85, 105, 0.4) !important;
            color: #ffffff !important;
            border: 2px solid rgba(71, 85, 105, 0.6) !important;
            backdrop-filter: blur(10px) !important;
          }

          .btn-secondary:hover {
            background: rgba(71, 85, 105, 0.6) !important;
            text-decoration: none !important;
            color: #ffffff !important;
            border-color: rgba(71, 85, 105, 0.8) !important;
          }

          .btn-outline-primary {
            background: white;
            color: #6366f1;
            border: 2px solid #6366f1;
          }

          .btn-outline-primary:hover {
            background: #6366f1;
            color: white;
          }

          @media (max-width: 768px) {
            .results-card {
              padding: 2rem;
            }

            .score-circle {
              width: 100px;
              height: 100px;
            }

            .score-number {
              font-size: 2rem !important;
              color: #000000 !important;
            }

            .score-percent {
              font-size: 1.25rem !important;
              color: #1e293b !important;
            }

            .results-actions {
              flex-direction: column;
            }

            .btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const difficultyInfo = getDifficultyInfo(quiz.difficulty);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="container">
          <div className="header-content">
            <div className="quiz-info">
              <h1 className="quiz-title">{quiz.title}</h1>
              <div className={`difficulty-badge ${quiz.difficulty}`}>
                <span className="difficulty-name">{difficultyInfo.label}</span>
              </div>
            </div>
            
            <div className="timer-card">
              <div className="timer-label">Time Remaining</div>
              <div className={`timer-display ${timeLeft < 300 ? 'warning' : ''}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="quiz-body">
        <div className="container">
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-info">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{getAnsweredCount()} of {quiz.questions.length} answered</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="question-card">
            <div className="question-header">
              <h2 className="question-text">{currentQ.question}</h2>
            </div>
            
            <div className="options-grid">
              {currentQ.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`option-card ${selectedAnswers[currentQuestion] === option ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={selectedAnswers[currentQuestion] === option}
                    onChange={() => handleAnswerSelect(currentQuestion, option)}
                    className="option-input"
                  />
                  <div className="option-content">
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="quiz-navigation">
            <button
              className="btn btn-ghost prev-btn"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              ← Previous
            </button>
            
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className="btn btn-primary submit-btn"
                onClick={handleSubmitQuiz}
                disabled={getAnsweredCount() < quiz.questions.length}
              >
                Submit Quiz ({getAnsweredCount()}/{quiz.questions.length})
              </button>
            )}
          </div>

          {/* Question Navigation */}
          <div className="question-navigation">
            <div className="nav-header">
              <span>Quick Navigation</span>
            </div>
            <div className="nav-grid">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  className={`nav-button ${
                    index === currentQuestion 
                      ? 'current' 
                      : selectedAnswers[index] 
                        ? 'answered' 
                        : 'unanswered'
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .quiz-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e293b 100%);
          color: #f1f5f9;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .quiz-header {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          border-bottom: 2px solid #475569;
          padding: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        .quiz-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          border-radius: 50%;
          transform: translate(50%, -50%);
        }

        .quiz-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.08));
          border-radius: 50%;
          transform: translate(-50%, 50%);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .quiz-info {
          flex: 1;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .breadcrumb-link {
          color: #6366f1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .breadcrumb-link:hover {
          color: #5855eb;
          text-decoration: none;
        }

        .breadcrumb-separator {
          color: #94a3b8;
        }

        .breadcrumb-current {
          color: #64748b;
        }

        .quiz-title {
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          color: #f1f5f9 !important;
          margin: 0 0 1rem 0 !important;
          transform: translateY(-0.5rem) !important;
        }

        .difficulty-badge {
          display: inline-flex !important;
          align-items: center !important;
          margin-left: 1rem !important;
          gap: 0.75rem !important;
          padding: 0.5rem 1rem !important;
          background: transparent !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 12px !important;
        }

        .difficulty-name {
          font-weight: 600 !important;
          color: #374151 !important;
          font-size: 1.1rem !important;
        }

        .difficulty-badge.beginner {
          background: linear-gradient(135deg, #cd7f32, #b8860b) !important;
          border-color: #cd7f32 !important;
          color: white !important;
        }

        .difficulty-badge.intermediate {
          background: linear-gradient(135deg, #c0c0c0, #a9a9a9) !important;
          border-color: #c0c0c0 !important;
          color: white !important;
        }

        .difficulty-badge.advanced {
          background: linear-gradient(135deg, #ffd700, #ffb347) !important;
          border-color: #ffd700 !important;
          color: white !important;
        }

        .level-indicator {
          display: flex;
          gap: 3px;
        }

        .level-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e2e8f0;
        }

        .level-dot.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        .timer-card {
          background: #334155;
          border: 2px solid #475569;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          min-width: 180px;
        }

        .timer-label {
          font-size: 1.1rem !important;
          color: #cbd5e1 !important;
          margin-bottom: 0.5rem !important;
          font-weight: 500 !important;
        }

        .timer-display {
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          color: #f1f5f9 !important;
          font-family: 'JetBrains Mono', monospace !important;
        }

        .timer-display.warning {
          color: #ef4444;
        }

        .quiz-body {
          padding: 2rem 0;
          background: transparent;
          min-height: calc(100vh - 200px);
        }

        .progress-section {
          margin-bottom: 2rem;
        }

        .progress-info {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 0.75rem !important;
          font-size: 1.2rem !important;
          color: #64748b !important;
          font-weight: 500 !important;
        }

        .progress-bar {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .question-card {
          background: #334155;
          border: 2px solid #475569;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .question-header {
          padding: 2rem !important;
          background: linear-gradient(135deg, #334155, #475569) !important;
          border-bottom: 2px solid #475569 !important;
        }

        .question-text {
          font-size: 1.6rem !important;
          font-weight: 600 !important;
          color: #f1f5f9 !important;
          margin: 0 !important;
          line-height: 1.6 !important;
        }

        .options-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .option-card {
          background: #334155 !important;
          border: 2px solid #475569 !important;
          border-radius: 12px !important;
          padding: 1.25rem !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          display: block !important;
        }

        .option-card:hover {
          border-color: #6366f1 !important;
          background: #475569 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15) !important;
        }

        .option-card.selected {
          border-color: #6366f1 !important;
          background: linear-gradient(135deg, #475569, #6366f1) !important;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2) !important;
        }

        .option-input {
          display: none;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .option-letter {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 40px !important;
          height: 40px !important;
          background: #475569 !important;
          color: #cbd5e1 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 1.2rem !important;
          flex-shrink: 0 !important;
          transition: all 0.3s ease !important;
        }

        .option-card.selected .option-letter {
          background: #6366f1;
          color: white;
        }

        .option-text {
          color: #f1f5f9 !important;
          font-weight: 500 !important;
          line-height: 1.5 !important;
          font-size: 1.3rem !important;
        }

        .quiz-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 1rem 2rem !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          font-size: 1.2rem !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          text-decoration: none !important;
          display: inline-flex !important;
          align-items: center !important;
          border: none !important;
          white-space: nowrap !important;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: 1px solid transparent;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-ghost {
          background: #334155 !important;
          color: #cbd5e1 !important;
          border: 2px solid #475569 !important;
        }

        .btn-ghost:hover {
          background: #475569 !important;
          border-color: #64748b !important;
        }

        .btn-ghost:disabled {
          background: #f8fafc;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .submit-btn {
          font-size: 1.4rem !important;
          padding: 1.25rem 2.5rem !important;
        }

        .question-navigation {
          background: linear-gradient(135deg, #334155, #475569) !important;
          border: 2px solid #475569 !important;
          border-radius: 16px !important;
          padding: 1.5rem !important;
        }

        .nav-header {
          font-weight: 600 !important;
          color: #f1f5f9 !important;
          margin-bottom: 1rem !important;
          text-align: center !important;
          font-size: 1.3rem !important;
        }

        .nav-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .nav-button {
          width: 50px !important;
          height: 50px !important;
          border: 2px solid #475569 !important;
          background: #334155 !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          color: #cbd5e1 !important;
          font-size: 1.2rem !important;
        }

        .nav-button:hover {
          border-color: #6366f1 !important;
          background: #475569 !important;
        }

        .nav-button.current {
          border-color: #6366f1 !important;
          background: #6366f1 !important;
          color: white !important;
        }

        .nav-button.answered {
          border-color: #22c55e !important;
          background: #22c55e !important;
          color: white !important;
        }

        .nav-button.unanswered {
          border-color: #475569 !important;
          background: #334155 !important;
          color: #94a3b8 !important;
        }

        /* Dark Mode Styling for Quiz Interface */
        .dark-mode .quiz-container {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e293b 100%) !important;
        }

        .dark-mode .quiz-header {
          background: linear-gradient(135deg, #0f172a, #1e293b) !important;
          border-color: #475569 !important;
        }

        .dark-mode .quiz-title {
          color: #f1f5f9 !important;
        }

        .dark-mode .breadcrumb-link {
          color: #6366f1 !important;
        }

        .dark-mode .breadcrumb-link:hover {
          color: #5855eb !important;
        }

        .dark-mode .breadcrumb-separator {
          color: #cbd5e1 !important;
        }

        .dark-mode .breadcrumb-current {
          color: #cbd5e1 !important;
        }

        .dark-mode .difficulty-badge {
          background: #334155 !important;
          border-color: #475569 !important;
        }

        .dark-mode .difficulty-name {
          color: #f1f5f9 !important;
        }

        .dark-mode .timer-card {
          background: #334155 !important;
          border-color: #475569 !important;
        }

        .dark-mode .timer-label {
          color: #cbd5e1 !important;
        }

        .dark-mode .timer-display {
          color: #f1f5f9 !important;
        }

        .dark-mode .progress-info {
          color: #cbd5e1 !important;
        }

        .dark-mode .progress-bar {
          background: #475569 !important;
        }

        .dark-mode .question-card {
          background: #334155 !important;
          border-color: #475569 !important;
        }

        .dark-mode .question-header {
          background: linear-gradient(135deg, #334155, #475569) !important;
          border-color: #475569 !important;
        }

        .dark-mode .question-text {
          color: #f1f5f9 !important;
        }

        .dark-mode .option-card {
          background: #334155 !important;
          border-color: #475569 !important;
        }

        .dark-mode .option-card:hover {
          background: #475569 !important;
          border-color: #6366f1 !important;
        }

        .dark-mode .option-card.selected {
          background: #475569 !important;
          border-color: #6366f1 !important;
        }

        .dark-mode .option-letter {
          background: #475569 !important;
          color: #cbd5e1 !important;
        }

        .dark-mode .option-card.selected .option-letter {
          background: #6366f1 !important;
          color: white !important;
        }

        .dark-mode .option-text {
          color: #f1f5f9 !important;
        }

        .dark-mode .btn-ghost {
          background: #334155 !important;
          color: #cbd5e1 !important;
          border-color: #475569 !important;
        }

        .dark-mode .btn-ghost:hover {
          background: #475569 !important;
          border-color: #64748b !important;
        }

        .dark-mode .btn-ghost:disabled {
          background: #475569 !important;
          color: #94a3b8 !important;
        }

        .dark-mode .question-navigation {
          background: linear-gradient(135deg, #334155, #475569) !important;
          border-color: #475569 !important;
        }

        .dark-mode .nav-header {
          color: #f1f5f9 !important;
        }

        .dark-mode .nav-button {
          background: #334155 !important;
          border-color: #475569 !important;
          color: #cbd5e1 !important;
        }

        .dark-mode .nav-button:hover {
          background: #475569 !important;
          border-color: #6366f1 !important;
        }

        .dark-mode .nav-button.current {
          background: #6366f1 !important;
          border-color: #6366f1 !important;
          color: white !important;
        }

        .dark-mode .nav-button.answered {
          background: #22c55e !important;
          border-color: #22c55e !important;
          color: white !important;
        }

        .dark-mode .nav-button.unanswered {
          background: #334155 !important;
          border-color: #475569 !important;
          color: #94a3b8 !important;
        }

        /* Dark Mode Styling for Error and Loading States */
        .dark-mode body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
        }

        .dark-mode .container {
          background: transparent !important;
        }

        .dark-mode .alert {
          background: #334155 !important;
          border-color: #475569 !important;
          color: #f1f5f9 !important;
        }

        .dark-mode .alert h4 {
          color: #f1f5f9 !important;
        }

        .dark-mode .alert p {
          color: #cbd5e1 !important;
        }

        .dark-mode .quiz-loading {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
        }

        .dark-mode .loading-content h3 {
          color: #f1f5f9 !important;
        }

        .dark-mode .loading-content p {
          color: #cbd5e1 !important;
        }

        .dark-mode .loading-spinner {
          border-color: #475569 !important;
          border-top-color: #6366f1 !important;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .quiz-title {
            font-size: 1.5rem;
          }

          .options-grid {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }

          .question-header {
            padding: 1.5rem;
          }

          .quiz-navigation {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-center {
            order: -1;
          }
        }

        @media (max-width: 480px) {
          .quiz-header {
            padding: 1.5rem 0;
          }

          .timer-card {
            min-width: 140px;
            padding: 1rem;
          }

          .timer-display {
            font-size: 1.5rem;
          }

          .question-text {
            font-size: 1.1rem;
          }

          .option-card {
            padding: 1rem;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .quiz-navigation {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

QuizPage.getInitialProps = async (context, client, currentUser) => {
  const { quizId } = context.query;
  
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return { quiz: null, errors: 'Please log in' };
  }

  try {
    const { data } = await client.get(`/api/quizzes/${quizId}`);
    return { quiz: data, errors: null };
  } catch (error) {
    return { 
      quiz: null, 
      errors: error.response?.data?.errors?.[0]?.message || 'Failed to load quiz' 
    };
  }
};

export default QuizPage;