import { useState, useEffect } from 'react';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const QuizzesPage = ({ quizzes, errors }) => {
  const [loadingQuiz, setLoadingQuiz] = useState(null);
  const [processingQuizzes, setProcessingQuizzes] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingQuizInfo, setLoadingQuizInfo] = useState(null);

  const { doRequest, errors: requestErrors } = useRequest({
    url: '/api/quizzes',
    method: 'post',
    onSuccess: (quiz) => {
      setLoadingQuiz(null);
      if (quiz.status === 'processing') {
        setProcessingQuizzes(prev => new Set([...prev, quiz.id]));
      } else if (quiz.status === 'available') {
        setShowLoadingOverlay(false);
        window.location.href = `/quizzes/${quiz.id}`;
      }
    }
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Polling effect for processing quizzes
  useEffect(() => {
    if (processingQuizzes.size === 0) return;

    const pollQuiz = async (quizId) => {
      try {
        const response = await fetch(`/api/quizzes/${quizId}`, {
          credentials: 'include'
        });
        const quiz = await response.json();
        
        if (quiz.status === 'available') {
          setProcessingQuizzes(prev => {
            const newSet = new Set(prev);
            newSet.delete(quizId);
            return newSet;
          });
          setShowLoadingOverlay(false);
          window.location.href = `/quizzes/${quiz.id}`;
        } else if (quiz.status === 'failed') {
          setProcessingQuizzes(prev => {
            const newSet = new Set(prev);
            newSet.delete(quizId);
            return newSet;
          });
          setShowLoadingOverlay(false);
          window.location.reload();
        }
      } catch (error) {
        console.error('Polling error:', error);
        setProcessingQuizzes(prev => {
          const newSet = new Set(prev);
          newSet.delete(quizId);
          return newSet;
        });
        setShowLoadingOverlay(false);
      }
    };

    const interval = setInterval(() => {
      processingQuizzes.forEach(quizId => pollQuiz(quizId));
    }, 3000);

    return () => clearInterval(interval);
  }, [processingQuizzes]);

  const handleStartQuiz = async (worksheetId, difficulty) => {
    const loadingKey = `${worksheetId}-${difficulty}`;
    setLoadingQuiz(loadingKey);
    
    const currentQuiz = quizzes.find(q => q.worksheetId === worksheetId);
    setLoadingQuizInfo({
      title: currentQuiz?.worksheetTitle || 'Quiz',
      difficulty: difficulty,
      icon: difficulty === 'beginner' ? '🥉' : difficulty === 'intermediate' ? '🥈' : '🥇'
    });
    setShowLoadingOverlay(true);

    try {
      await doRequest({
        worksheetId,
        difficulty
      });
    } catch (error) {
      console.error('Failed to create quiz:', error);
      setLoadingQuiz(null);
      setShowLoadingOverlay(false);
      
      if (error?.response?.status === 400) {
        try {
          window.location.reload();
        } catch (fetchError) {
          console.error('Failed to fetch existing quiz:', fetchError);
        }
      }
    }

    if (requestErrors) {
      setLoadingQuiz(null);
      setShowLoadingOverlay(false);
    }
  };

  // Get card color based on highest achievement
  const getCardColorClass = (quizProgress) => {
    if (quizProgress.advanced.status === 'completed' && quizProgress.advanced.score === 100) {
      return 'card-advanced';
    } else if (quizProgress.intermediate.status === 'completed' && quizProgress.intermediate.score === 100) {
      return 'card-intermediate';
    } else if (quizProgress.beginner.status === 'completed' && quizProgress.beginner.score === 100) {
      return 'card-beginner';
    }
    return 'card-default';
  };

  const getQuizAvailability = (quizProgress) => {
    const beginner = quizProgress.beginner;
    const intermediate = quizProgress.intermediate;
    const advanced = quizProgress.advanced;

    return {
      beginner: {
        isAvailable: true,
        isUnlocked: true
      },
      intermediate: {
        isAvailable: beginner.status === 'completed' && beginner.score === 100,
        isUnlocked: beginner.status === 'completed' && beginner.score === 100
      },
      advanced: {
        isAvailable: intermediate.status === 'completed' && intermediate.score === 100,
        isUnlocked: intermediate.status === 'completed' && intermediate.score === 100
      }
    };
  };

  const getDifficultyInfo = (difficulty) => {
    const info = {
      beginner: { label: 'Beginner', icon: '🥉', color: '#ef4444' },
      intermediate: { label: 'Intermediate', icon: '🥈', color: '#f59e0b' },
      advanced: { label: 'Advanced', icon: '🥇', color: '#10b981' }
    };
    return info[difficulty] || { label: difficulty, icon: '🏆', color: '#6366f1' };
  };

  const renderLevelActions = (status, difficulty, worksheetId, availability) => {
    const loadingKey = `${worksheetId}-${difficulty}`;
    const isLoading = loadingQuiz === loadingKey;

    // If level is locked
    if (!availability.isUnlocked) {
      return (
        <div className="level-actions">
        </div>
      );
    }

    switch (status.status) {
      case 'completed':
        return (
          <div className="level-actions">
            <div className="action-buttons dual" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button 
                className="action-btn secondary"
                style={{
                  background: 'linear-gradient(135deg,rgb(125, 126, 128),rgb(191, 194, 197))',
                  color: 'white',
                  border: '1px solid rgb(176, 177, 178)',
                  padding: '0.475rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 8px rgba(248, 249, 250, 0.3)'
                }}
                onClick={() => handleStartQuiz(worksheetId, difficulty)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Loading...
                  </>
                ) : (
                  'Retake Quiz'
                )}
              </button>
              
              <Link 
                href={`/quizzes/quiz-review/${status.quizId}`} 
                className="action-btn secondary"
                style={{
                  background: 'linear-gradient(135deg,rgb(125, 126, 128),rgb(191, 194, 197))',
                  color: 'white',
                  border: '1px solid rgb(176, 177, 178)',
                  padding: '0.475rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 8px rgba(164, 174, 190, 0.3)'
                }}
              >
                View Quiz
              </Link>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="level-actions">
            <div className="action-buttons dual">
              <button 
                className="action-btn secondary"
                onClick={() => handleStartQuiz(worksheetId, difficulty)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Loading...
                  </>
                ) : (
                  'Retake'
                )}
              </button>
              <Link 
                href={`/quizzes/quiz-review/${status.quizId}`} 
                className="action-btn secondary"
              >
                Review
              </Link>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="level-actions">
            <div className="processing-indicator">
              <span className="processing-spinner"></span>
              <span>Generating quiz...</span>
            </div>
            <div className="processing-note">This may take a few moments</div>
          </div>
        );

      case 'available':
        if (status.quizId) {
          return (
            <div className="level-actions">
              <div className="action-buttons single">
                <Link 
                  href={`/quizzes/${status.quizId}`} 
                  className="action-btn primary"
                  style={{
                    background: 'linear-gradient(135deg,rgb(125, 126, 128),rgb(191, 194, 197))',
                    color: 'white',
                    border: '1px solid rgb(55, 96, 160)',
                    padding: '0.475rem 0.5rem',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(123, 127, 133, 0.3)'
                  }}
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          );
        }
        return (
          <div className="level-actions">
            <div className="action-buttons single">
              <button 
                className="action-btn primary"
                style={{
                  background: 'linear-gradient(135deg,rgb(29, 112, 50),rgb(115, 165, 116))',
                  color: 'white',
                  border: '1px solid rgb(57, 84, 66)',
                  padding: '0.475rem 0.5rem',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(74, 201, 98, 0.3)'
                }}
                onClick={() => handleStartQuiz(worksheetId, difficulty)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="level-actions">
            <div className="action-buttons single">
              <button 
                className="action-btn primary"
                onClick={() => handleStartQuiz(worksheetId, difficulty)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </div>
        );
    }
  };

  const getOverallProgress = (quizProgress) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    let completedLevels = 0;
    
    for (const level of levels) {
      if (quizProgress[level].status === 'completed' && quizProgress[level].score === 100) {
        completedLevels++;
      } else {
        break;
      }
    }
    
    return {
      completed: completedLevels,
      total: 3,
      percentage: Math.round((completedLevels / 3) * 100)
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    if (typeof window === 'undefined') {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (errors) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{errors}</div>
      </div>
    );
  }

  return (
    <div className={`quiz-dashboard ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-brain me-3"></i>
              Quiz Dashboard
            </h1>
            <p className="page-subtitle">
              Complete all three difficulty levels with perfect scores!
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {requestErrors && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h4>Something went wrong</h4>
              <ul>
                {requestErrors.map((err) => (
                  <li key={err.message}>{err.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="empty-state">
            <h3>No Worksheets Found</h3>
            <p>Create your first worksheet to start generating quizzes and test your knowledge!</p>
            <Link 
              href="/worksheets/new" 
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              Create Your First Worksheet
            </Link>
          </div>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => {
              const availability = getQuizAvailability(quiz.quizProgress);
              const cardColorClass = getCardColorClass(quiz.quizProgress);
              const progress = getOverallProgress(quiz.quizProgress);
              
              return (
                <div key={quiz.worksheetId} className={`quiz-card ${cardColorClass}`}>
                  <div className="card-header">
                    <div className="quiz-title-section">
                      <h3 className="quiz-title">{quiz.worksheetTitle}</h3>
                      <div className="progress-info">
                        <span className="progress-text">{progress.completed}/3 levels completed</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    {['beginner', 'intermediate', 'advanced'].map((difficulty) => {
                      const status = quiz.quizProgress[difficulty];
                      const levelAvailability = availability[difficulty];
                      const difficultyInfo = getDifficultyInfo(difficulty);
                      
                      return (
                        <div key={difficulty} className={`level-section ${!levelAvailability.isUnlocked ? 'locked' : ''}`}>
                          <div className="level-header">
                            <div className="level-info">
                              <span className="level-name">{difficultyInfo.label}</span>
                              <span className="level-medal">{difficultyInfo.icon}</span>
                            </div>
                            <div className="level-score">
                              {status.status === 'completed' && status.score !== undefined ? (
                                <span className={`score-display ${status.score === 100 ? 'perfect' : 'partial'}`}>
                                  {status.score}%
                                </span>
                              ) : status.status === 'failed' && status.score !== undefined ? (
                                <span className="score-display failed">
                                  {status.score}%
                                </span>
                              ) : !levelAvailability.isUnlocked ? (
                                <span className="locked-indicator">Locked</span>
                              ) : (
                                <span className="status-indicator">
                                  {status.status === 'processing' ? 'Generating...' : 
                                   status.status === 'available' && status.quizId ? 'Ready' : 'Not Generated'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {renderLevelActions(
                            { ...status, worksheetId: quiz.worksheetId },
                            difficulty,
                            quiz.worksheetId,
                            levelAvailability
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="card-footer">
                    <span className="creation-date">Created {formatDate(quiz.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions */}
        <div className="instructions-card">
          <div className="instructions-header">
            <h4>How It Works</h4>
          </div>
          <div className="instructions-grid">
            <div className="instruction-item">
              <div className="instruction-number">1</div>
              <span>Start with the <strong>Beginner</strong> level</span>
            </div>
            <div className="instruction-item">
              <div className="instruction-number">2</div>
              <span>Score <strong>100%</strong> to unlock the next level</span>
            </div>
            <div className="instruction-item">
              <div className="instruction-number">3</div>
              <span>Retake quizzes as many times as needed</span>
            </div>
            <div className="instruction-item">
              <div className="instruction-number">4</div>
              <span>Review questions after completing any quiz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {showLoadingOverlay && loadingQuizInfo && (
        <div className="loading-overlay">
          <div className="loading-modal">
            <div className="loading-animation">
              <div className="spinner"></div>
              <div className="quiz-icon">{loadingQuizInfo.icon}</div>
            </div>
            
            <div className="loading-content">
              <h3 className="loading-title">Generating Your Quiz...</h3>
              <p className="loading-subtitle">
                Creating {loadingQuizInfo.difficulty} level quiz for <strong>{loadingQuizInfo.title}</strong>
              </p>
              
              <div className="loading-steps">
                <div className="step active">
                  <div className="step-icon">✓</div>
                  <span>Analyzing worksheet content</span>
                </div>
                <div className="step active">
                  <div className="step-icon">✓</div>
                  <span>Generating questions</span>
                </div>
                <div className="step processing">
                  <div className="step-icon">
                    <div className="mini-spinner"></div>
                  </div>
                  <span>Finalizing quiz...</span>
                </div>
              </div>
              
              <p className="loading-note">
                This usually takes 10-30 seconds
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quiz-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .quiz-dashboard.visible {
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

        .header-section {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 3rem 0;
          margin-bottom: 3rem;
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

        .header-content-center {
          text-align: center;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #111827;
          text-align: center;
          margin: 0 0 1rem 0;
        }

        .main-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          text-align: center;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .error-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .error-content h4 {
          color: #dc2626;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .error-content ul {
          margin: 0;
          color: #b91c1c;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
        }

        .empty-state p {
          color: #6b7280;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .quiz-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .quiz-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        /* Card Color Classes */
        .card-default {
        border: 1px solid #e5e7eb;
        background: white;
        }

        .card-beginner {
        border: 2px solid #cd7f32;
        background: linear-gradient(135deg, #ffffff 0%, #fef7f0 100%);
        box-shadow: 0 4px 12px rgba(205, 127, 50, 0.15);
        }

        .card-beginner .card-header {
        background: linear-gradient(135deg, #f4e4c1, #e6c47a);
        border-bottom: 1px solid #cd7f32;
        }

        .card-intermediate {
        border: 2px solid #c0c0c0;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        box-shadow: 0 4px 12px rgba(192, 192, 192, 0.15);
        }

        .card-intermediate .card-header {
        background: linear-gradient(135deg, #e8e9ea, #d3d4d5);
        border-bottom: 1px solid #c0c0c0;
        }

        .card-advanced {
        border: 2px solid #ffd700;
        background: linear-gradient(135deg, #ffffff 0%, #fffef0 100%);
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.15);
        }

        .card-advanced .card-header {
        background: linear-gradient(135deg, #fff9c4, #ffeaa7);
        border-bottom: 1px solid #ffd700;
        }

        /* Enhanced hover effects for colored cards */
        .card-beginner:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(205, 127, 50, 0.25);
        }

        .card-intermediate:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(192, 192, 192, 0.25);
        }

        .card-advanced:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.25);
        }

        .card-header {
        padding: 1.5rem;
        border-bottom: 1px solid #f3f4f6;
        }

        .quiz-title {
          font-size: 1.5rem;
          text-align: center;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
          line-height: 1.3;
        }

        .progress-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 3px;
          transition: width 0.8s ease;
        }

        .card-body {
          padding: 0;
        }

        .level-section {
          padding: 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.2s ease;
        }

        .level-section:last-child {
          border-bottom: none;
        }

        .level-section.locked {
          opacity: 0.6;
          background: #fafafa;
        }

        .level-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .level-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .level-name {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .level-medal {
          font-size: 1.25rem;
        }

        .level-score {
          display: flex;
          align-items: center;
        }

        .score-display {
          font-size: 1.125rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
        }

        .score-display.perfect {
          background: #dcfce7;
          color: #166534;
        }

        .score-display.partial {
          background: #fef3c7;
          color: #92400e;
        }

        .score-display.failed {
          background: #fee2e2;
          color: #dc2626;
        }

        .locked-indicator {
          font-size: 0.875rem;
          color: #9ca3af;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          background: #f3f4f6;
          border-radius: 6px;
        }

        .status-indicator {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .level-actions {
          margin-top: 0.75rem;
        }

        .requirement-text {
          font-size: 0.875rem;
          color: #9ca3af;
          font-style: italic;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6366f1;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .processing-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .processing-note {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .action-buttons.single .action-btn {
          flex: 1;
        }

        .action-buttons.dual .action-btn {
          flex: 1;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .action-btn:hover {
          text-decoration: none;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: 1px solid #3b82f6;
        }

        .action-btn.primary:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border-color: #2563eb;
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .action-btn.secondary:hover {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          color: #1f2937;
          border-color: #d1d5db;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .action-btn:disabled:hover {
          transform: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .card-footer {
          padding: 1rem 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
        }

        .creation-date {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .instructions-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 2rem;
          margin-top: 3rem;
        }

        .instructions-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .instructions-header h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .instructions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .instruction-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #f3f4f6;
        }

        .instruction-number {
          width: 28px;
          height: 28px;
          background:rgb(121, 121, 123);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .instruction-item span {
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .loading-modal {
          background: white;
          border-radius: 20px;
          padding: 3rem 2rem;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease;
        }

        .loading-animation {
          position: relative;
          margin-bottom: 2rem;
        }

        .spinner {
          width: 80px;
          height: 80px;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .quiz-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-content {
          margin-bottom: 2rem;
        }

        .loading-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .loading-subtitle {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .loading-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .step.active {
          background: #dcfce7;
          color: #166534;
        }

        .step.processing {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .step-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step.active .step-icon {
          background: #10b981;
          color: white;
        }

        .step.processing .step-icon {
          background: #6366f1;
          color: white;
        }

        .mini-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-note {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
          text-align: center;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .header-section {
            padding: 2rem 0;
            margin-bottom: 2rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .main-subtitle {
            font-size: 1rem;
          }

          .quiz-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .level-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .action-buttons.dual {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
            width: 100%;
          }

          .instructions-grid {
            grid-template-columns: 1fr;
          }

          .loading-modal {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .header-section {
            padding: 1.5rem 0;
          }

          .main-title {
            font-size: 1.75rem;
          }

          .quiz-title {
            font-size: 1.125rem;
          }

          .level-section {
            padding: 1.25rem;
          }

          .progress-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .progress-bar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

QuizzesPage.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return { quizzes: [], errors: null };
  }

  try {
    const { data } = await client.get('/api/quizzes');
    return { quizzes: data, errors: null };
  } catch (error) {
    return { 
      quizzes: [], 
      errors: error.response?.data?.errors?.[0]?.message || 'Failed to load quizzes' 
    };
  }
};

export default QuizzesPage;