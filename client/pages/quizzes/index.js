import { useState, useEffect } from 'react';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const QuizzesPage = ({ quizzes, errors }) => {
  const [loadingQuiz, setLoadingQuiz] = useState(null);
  const [processingQuizzes, setProcessingQuizzes] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingQuizInfo, setLoadingQuizInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { doRequest, errors: requestErrors } = useRequest({
    url: '/api/quizzes',
    method: 'post',
    onSuccess: (quiz) => {
      setLoadingQuiz(null);
      if (quiz.status === 'PROCESSING') {
        setProcessingQuizzes(prev => new Set([...prev, quiz.id]));
        setShowLoadingOverlay(true);
      } else if (quiz.status === 'AVAILABLE') {
        setShowLoadingOverlay(false);
        window.location.href = `/quizzes/${quiz.id}`;
      }
    },
    onError: (error) => {
      setLoadingQuiz(null);
      setShowLoadingOverlay(false);
    }
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (processingQuizzes.size === 0) return;

    const pollQuiz = async (quizId) => {
      try {
        const response = await fetch(`/api/quizzes/${quizId}`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const quiz = await response.json();
        
        if (quiz.status === 'AVAILABLE') {
          setProcessingQuizzes(prev => {
            const newSet = new Set(prev);
            newSet.delete(quizId);
            return newSet;
          });
          setShowLoadingOverlay(false);
          
          setTimeout(() => {
            window.location.href = `/quizzes/${quiz.id}`;
          }, 1000);
          
        } else if (quiz.status === 'FAILED') {
          setProcessingQuizzes(prev => {
            const newSet = new Set(prev);
            newSet.delete(quizId);
            return newSet;
          });
          setShowLoadingOverlay(false);
          window.location.reload();
          
        } else if (quiz.status !== 'PROCESSING') {
          setProcessingQuizzes(prev => {
            const newSet = new Set(prev);
            newSet.delete(quizId);
            return newSet;
          });
          setShowLoadingOverlay(false);
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
    }, 2000); 

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
        difficulty: difficulty.toUpperCase()
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

  // Determines if a level is unlocked based on quiz progress
  const isLevelUnlocked = (quizProgress, difficulty) => {
    if (difficulty === 'beginner') return true;
    if (difficulty === 'intermediate') {
      return quizProgress.beginner.status === 'completed';
    }
    if (difficulty === 'advanced') {
      return quizProgress.intermediate.status === 'completed';
    }
    return false;
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
        isAvailable: beginner.status === 'completed',
        isUnlocked: beginner.status === 'completed'
      },
      advanced: {
        isAvailable: intermediate.status === 'completed',
        isUnlocked: intermediate.status === 'completed'
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

  const renderQuizAction = (status, difficulty, worksheetId, quizProgress) => {
    const loadingKey = `${worksheetId}-${difficulty}`;
    const isLoading = loadingQuiz === loadingKey;
    const isUnlocked = isLevelUnlocked(quizProgress, difficulty);
    const isInPollingQueue = processingQuizzes.has(status?.quizId);

    if (status?.status === 'processing' || status?.status === 'PROCESSING' || isInPollingQueue) {
      return (
        <div className="quiz-actions">
          <div className="processing-message">
            Generating quiz...
          </div>
        </div>
      );
    }

    switch (status?.status) {
      case 'completed':
        return (
          <div className="quiz-actions">
            <Link href={`/quizzes/quiz-review/${status.quizId}`} className="btn btn-secondary">
              Review Quiz
            </Link>
          </div>
        );
      case 'failed':
        return (
          <div className="quiz-actions">
            <span className="score-display failed">Failed</span>
          </div>
        );
      case 'available':
      case 'AVAILABLE':
        if (status.quizId) {
          return (
            <div className="quiz-actions">
              <Link href={`/quizzes/${status.quizId}`} className="btn btn-primary">
                Start Quiz
              </Link>
            </div>
          );
        }
        // If available but no quizId, fall through to default
      default:
        // Show Generate Quiz button if no quiz exists or unknown state, and level is unlocked
        if (!isUnlocked) {
          return (
            <div className="quiz-actions">
            </div>
          );
        }
        
        return (
          <div className="quiz-actions">
            <button 
              className="btn btn-primary"
              onClick={() => handleStartQuiz(worksheetId, difficulty)}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Quiz'}
            </button>
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

  // Filter and sort quizzes
  const filteredAndSortedQuizzes = quizzes
    .filter(quiz => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return quiz.worksheetTitle.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'alphabetical':
          return a.worksheetTitle.localeCompare(b.worksheetTitle);
        default:
          return 0;
      }
    });

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
            <h1 className="elegant-silver-title-v2">
              <i className="fas fa-brain me-3"></i>
              Quiz Dashboard
            </h1>
            <div className="elegant-separator"></div>
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
                {Array.isArray(requestErrors)
                  ? requestErrors.map((err) => (
                      <li key={err.message || err}>{err.message || err}</li>
                    ))
                  : requestErrors
                    ? <li>{requestErrors}</li>
                    : null
                }
              </ul>
            </div>
          </div>
        )}

        {/* Controls Section */}
        {quizzes.length > 0 && (
          <div className="controls-section">
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search quizzes by worksheet title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="sort-controls">
              <label className="sort-label">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="empty-state-wrapper">
            <div className="empty-state">
              <h3 className="empty-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>
                No Quizzes Yet
              </h3>
              <Link href="/worksheets/new" className="btn btn-primary" style={{ fontSize: '1.3rem', padding: '1.2rem 2rem' }}>
                <i className="fas fa-plus me-2"></i>
                Create Your First Worksheet
              </Link>
            </div>
          </div>
        ) : (
          <>
            {filteredAndSortedQuizzes.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="no-results-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  No quizzes match your search
                </h3>
                <p className="no-results-description" style={{ fontSize: '1.6rem', marginBottom: '2rem' }}>
                  Try adjusting your search terms or create a new worksheet.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn btn-outline"
                  style={{ fontSize: '1.3rem', padding: '1.2rem 2rem' }}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="quiz-grid">
                {filteredAndSortedQuizzes.map((quiz) => {
              const availability = getQuizAvailability(quiz.quizProgress);
              const cardColorClass = getCardColorClass(quiz.quizProgress);
              const progress = getOverallProgress(quiz.quizProgress);
              
              return (
                <div key={quiz.worksheetId} className={`quiz-card ${cardColorClass}`}>
                  <div className="card-header">
                    <div className="quiz-title-section">
                      <h3 className="quiz-title">{quiz.worksheetTitle}</h3>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    {['beginner', 'intermediate', 'advanced'].map((difficulty) => {
                      const status = quiz.quizProgress[difficulty];
                      const levelAvailability = availability[difficulty];
                      const difficultyInfo = getDifficultyInfo(difficulty);
                      const isInPollingQueue = processingQuizzes.has(status?.quizId);
                      
                      return (
                        <div key={difficulty} className={`level-section ${!levelAvailability.isUnlocked ? 'locked' : ''}`}>
                                                      <div className="level-content">
                            <div className="level-header">
                              <div className="level-title">
                                <span className="level-medal">{difficultyInfo.icon}</span>
                              </div>
                              
                              <div className="level-status">
                                                              {status.status === 'completed' && status.score !== undefined ? (
                                <span className={`score-display ${
                                  status.score === 100 ? 'perfect' : 
                                  status.score >= 90 ? 'good' : 
                                  status.score >= 50 ? 'average' : 'poor'
                                }`}>
                                  {status.score}%
                                </span>
                              ) : status.status === 'failed' && status.score !== undefined ? (
                                <span className={`score-display ${
                                  status.score >= 90 ? 'good' : 
                                  status.score >= 50 ? 'average' : 'poor'
                                }`}>
                                  {status.score}%
                                </span>
                              ) : !levelAvailability.isUnlocked ? (
                                  <span className="locked-indicator">Locked</span>
                                ) : (
                                  <span className="status-indicator">
                                    {status.status === 'processing' || status.status === 'PROCESSING' || isInPollingQueue ? 'Generating...' : 
                                     (status.status === 'available' || status.status === 'AVAILABLE') && status.quizId ? 'Ready' : 'Not Generated'}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="level-action">
                              {renderQuizAction(
                                status,
                                difficulty,
                                quiz.worksheetId,
                                quiz.quizProgress
                              )}
                            </div>
                          </div>
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
          </>
        )}
      </div>

      {/* Enhanced Loading Overlay */}
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
          background: transparent;
          border-bottom: none;
          padding: 2rem 0 1rem;
          margin-bottom: 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
        }

        .empty-state-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding-top: 2rem;
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
        .quiz-dashboard h1.elegant-silver-title-v2 {
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

        .controls-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .search-box {
          position: relative;
          max-width: 800px;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1.1rem;
          transition: all 0.2s ease;
          background: #fafafa;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          color: #64748b;
          background: #f1f5f9;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sort-label {
          font-weight: 600;
          color: #475569;
          font-size: 1.1rem;
          margin: 0;
        }

        .sort-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1.1rem;
          background: white;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .no-results {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          width: 90%;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-icon {
          width: 140px;
          height: 140px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2.5rem;
          color: #64748b;
          font-size: 4rem;
        }

        .empty-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .empty-description {
          font-size: 1.5rem;
          color: #64748b;
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .quiz-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          min-height: 500px;
          position: relative;
        }

        .quiz-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
        }

        .quiz-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .quiz-card:hover::before {
          height: 4px;
           background: linear-gradient(90deg,rgba(78, 70, 229, 0.61), #7c3aed,rgba(240, 224, 231, 0));
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
        padding: 2rem 1.5rem 1.5rem;
        border-bottom: 1px solid #f8fafc;
        background:rgba(223, 225, 226, 0.29);
        }

        .quiz-title {
          font-size: 1.8rem;
          text-align: center;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1rem 0;
          line-height: 1.3;
          background: linear-gradient(135deg, #1e293b, #374151);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .progress-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-text {
          font-size: 1rem;
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
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .level-section {
          padding: 1.5rem;
          position: relative;
          transition: all 0.3s ease;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .level-section:not(:last-child)::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 1.5rem;
          right: 1.5rem;
          height: 2px;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.8) 20%, 
            rgba(255, 255, 255, 1) 50%, 
            rgba(255, 255, 255, 0.8) 80%, 
            rgba(255, 255, 255, 0.1) 100%
          );
          border-radius: 1px;
        }

        .level-section:hover {
          background: linear-gradient(135deg, #fafbff, #f8fafc);
        }

        .level-section.locked {
          opacity: 0.6;
          background: #fafafa;
        }

        .level-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .level-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .level-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .level-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #374151;
        }

        .level-medal {
          font-size: 1.5rem;
        }

        .level-status {
          display: flex;
          align-items: center;
        }

        .level-action {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .score-display {
          font-size: 1.3rem !important;
          font-weight: 700 !important;
          background: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          border: none !important;
        }

        .score-display.perfect {
          color: #10b981 !important;
          background: transparent !important;
        }

        .score-display.good {
          color: #f59e0b !important;
          background: transparent !important;
        }

        .score-display.average {
          color: #f59e0b !important;
          background: transparent !important;
        }

        .score-display.poor {
          color: #ef4444 !important;
          background: transparent !important;
        }

        .quiz-card .score-display {
          background: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          border: none !important;
        }

        .quiz-card .score-display.perfect {
          color: #10b981 !important;
          background: transparent !important;
        }

        .quiz-card .score-display.good {
          color: #f59e0b !important;
          background: transparent !important;
        }

        .quiz-card .score-display.average {
          color: #f59e0b !important;
          background: transparent !important;
        }

        .quiz-card .score-display.poor {
          color: #ef4444 !important;
          background: transparent !important;
        }

        .locked-indicator {
          font-size: 1rem;
          color: #9ca3af;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          background: #f3f4f6;
          border-radius: 6px;
        }

        .status-indicator {
          font-size: 1rem;
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

        .processing-message {
          font-size: 1rem;
          color: #6366f1;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-align: center;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          min-height: 48px;
        }

        .processing-message::before {
          content: '';
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .locked-message {
          font-size: 1rem;
          color: #9ca3af;
          font-style: italic;
          text-align: center;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quiz-actions {
          display: flex;
          justify-content: center;
          width: 100%;
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
          font-size: 1rem;
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
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: 1px solid #6366f1;
        }

        .action-btn.primary:hover {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-color: #6366f1;
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .action-btn.secondary:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border-color: #6366f1;
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
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-top: 1px solid #f1f5f9;
          position: relative;
        }

        .card-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 1.5rem;
          right: 1.5rem;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        }

        .creation-date {
          font-size: 1rem;
          color: #6b7280;
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
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
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
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          color: white;
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          color: #374151;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          text-decoration: none;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
          border-color: #6366f1;
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

        .loading-details {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .loading-message {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0 0 1rem 0;
          text-align: center;
          line-height: 1.5;
        }

        .processing-status {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: #dbeafe;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #1e40af;
          font-weight: 500;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse-grow 2s ease-in-out infinite;
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

        @keyframes pulse-grow {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.7;
          }
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