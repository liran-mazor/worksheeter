import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const WorksheetsIndex = ({ worksheets: initialWorksheets, currentUser }) => {
  const router = useRouter();
  const [worksheets, setWorksheets] = useState(initialWorksheets || []);
  const [isVisible, setIsVisible] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchWorksheets = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/worksheets');
      if (response.ok) {
        const data = await response.json();
        setWorksheets(data);
      }
    } catch (error) {
      console.error('Error fetching worksheets:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/signup');
      return;
    }
    setIsVisible(true);
  }, [currentUser, router]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === '/worksheets' && router.asPath !== '/worksheets') {
        fetchWorksheets();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const handleFocus = () => {
      const lastRefresh = localStorage.getItem('lastWorksheetRefresh');
      const now = Date.now();
      if (!lastRefresh || now - parseInt(lastRefresh) > 30000) { 
        fetchWorksheets();
        localStorage.setItem('lastWorksheetRefresh', now.toString());
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (router.query.refresh === 'true') {
      fetchWorksheets();
      router.replace('/worksheets', undefined, { shallow: true });
    }
  }, [router.query.refresh]);

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirecting to sign up...</p>
      </div>
    );
  }

  const handleDelete = async (worksheetId) => {
    if (!window.confirm('Are you sure you want to delete this worksheet? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/worksheets/${worksheetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorksheets(worksheets.filter(ws => ws.id !== worksheetId));
      } else {
        throw new Error('Failed to delete worksheet');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError('Failed to delete worksheet. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchWorksheets();
  };

  const filteredAndSortedWorksheets = worksheets
    .filter(worksheet => 
      worksheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (worksheet.keywords && worksheet.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        case 'oldest':
          return new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getWorksheetStats = (worksheet) => {
    const keywordCount = worksheet.keywords ? worksheet.keywords.length : 0;
    const questionCount = worksheet.questions ? worksheet.questions.length : 0;
    return { keywordCount, questionCount };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`worksheets-index ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="elegant-silver-title-v2">
              <i className="fas fa-file-alt me-3"></i>
              My Worksheets
              {isRefreshing && (
                <i className="fas fa-spinner fa-spin ms-3" style={{ fontSize: '1.5rem' }}></i>
              )}
            </h1>
            <p className="page-subtitle">
              {worksheets.length === 0 
                ? "You haven't created any worksheets yet"
                : `${filteredAndSortedWorksheets.length} of ${worksheets.length} worksheet${worksheets.length === 1 ? '' : 's'} shown`
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {worksheets.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon" style={{ fontSize: '4rem', width: '140px', height: '140px', marginBottom: '2.5rem' }}>
              <i className="fas fa-file-alt"></i>
            </div>
            <h3 className="empty-title" style={{ fontSize: '2.8rem', marginBottom: '1.5rem' }}>
              No Worksheets Yet
            </h3>
            <p className="empty-description" style={{ fontSize: '1.5rem', marginBottom: '2.5rem' }}>
              Create your first worksheet to start organizing your study materials with AI-powered keyword extraction and question generation.
            </p>
            <Link href="/worksheets/new" className="btn btn-primary" style={{ fontSize: '1.3rem', padding: '1.2rem 2rem' }}>
              <i className="fas fa-plus me-2"></i>
              Create Your First Worksheet
            </Link>
          </div>
        ) : (
          <>
            {/* Controls Section */}
            <div className="controls-section">
              <div className="search-box">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search worksheets by title or keywords..."
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

            {/* Results */}
            {filteredAndSortedWorksheets.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="no-results-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  No worksheets match your search
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
              <div className="worksheets-grid">
                {filteredAndSortedWorksheets.map(worksheet => {
                  const stats = getWorksheetStats(worksheet);
                  
                  return (
                    <div key={worksheet.id} className="worksheet-card">
                      <div className="card-header">
                        <Link href={`/worksheets/${worksheet.id}`} className="card-link">
                          <h3 className="card-title">{worksheet.title}</h3>
                        </Link>
                      </div>

                      <div className="card-content">
                        <div className="card-stats">
                          <div className="stat-item">
                            <div className="stat-icon keywords">
                              <i className="fas fa-key"></i>
                            </div>
                            <div className="stat-content">
                              <span className="stat-label">Keywords:</span>
                              <span className="stat-value">{stats.keywordCount}</span>
                            </div>
                          </div>
                          
                          <div className="stat-item">
                            <div className="stat-icon questions">
                              <i className="fas fa-question-circle"></i>
                            </div>
                            <div className="stat-content">
                              <span className="stat-label">Questions:</span>
                              <span className="stat-value">{stats.questionCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="card-date">
                          Created {formatDate(worksheet.createdAt || worksheet.updatedAt)}
                        </div>

                        {/* Processing Status Indicator */}
                        {worksheet.status === 'processing' && (
                          <div className="processing-indicator">
                            <i className="fas fa-cogs fa-spin me-2"></i>
                            <span>Processing definitions and answers...</span>
                          </div>
                        )}
                        
                        {worksheet.status === 'failed' && (
                          <div className="failed-indicator">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            <span>Processing failed</span>
                          </div>
                        )}
                      </div>

                      <div className="card-footer">
                        <Link 
                          href={`/worksheets/${worksheet.id}`} 
                          className="study-btn"
                          style={{
                            background: 'transparent',
                            color: '#6366f1',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontWeight: '500',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <i className="fas fa-play me-2"></i>
                          Start Studying
                        </Link>
                        <button
                          onClick={() => handleDelete(worksheet.id)}
                          className="action-btn delete-btn"
                          title="Delete worksheet"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 
                            <i className="fas fa-spinner fa-spin"></i> : 
                            <i className="fas fa-trash"></i>
                          }
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Toast */}
      {deleteError && (
        <div className="error-toast">
          <div className="toast-content">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {deleteError}
          </div>
          <button
            onClick={() => setDeleteError(null)}
            className="toast-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <style jsx>{`
        .worksheets-index {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .worksheets-index.visible {
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
        }

        .header-content {
          text-align: center;
        }

        .elegant-silver-title-v2 {
          font-family: 'Playfair Display', serif !important;
          font-size: 3rem !important;
          font-weight: 900 !important;
          color: #c0c4cc !important;
          text-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 3px 12px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2) !important;
          margin-bottom: 1rem !important;
          line-height: 1.2 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 1rem !important;
          background: none !important;
          background-image: none !important;
          background-clip: unset !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
          text-fill-color: unset !important;
        }

        h1.elegant-silver-title-v2,
        .worksheets-index h1.elegant-silver-title-v2 {
          color: #c0c4cc !important;
          background: none !important;
          -webkit-text-fill-color: unset !important;
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          margin: 0;
        }

        .btn {
          padding: 1.2rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: 1px solid transparent;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
          text-decoration: none;
          color: white;
        }

        .btn-outline {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 0.8rem 1.5rem;
        }

        .btn-outline:hover {
          background: #f8fafc;
          color: #475569;
          border-color: #cbd5e1;
          text-decoration: none;
        }

        .refresh-btn {
          min-width: 44px;
          justify-content: center;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: #64748b;
          font-size: 3rem;
        }

        .empty-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .empty-description {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
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

        .no-results-icon {
          color: #64748b;
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
        }

        .no-results-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .no-results-description {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 1.6rem;
        }

        .worksheets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          padding-bottom: 4rem;
        }

        .worksheet-card {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .worksheet-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
          background: linear-gradient(90deg,rgba(99, 101, 241, 0.7), #8b5cf6,rgba(240, 224, 231, 0));
          border-radius: 20px 20px 0 0;
          transition: all 0.3s ease;
        }

        .worksheet-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .worksheet-card:hover::before {
          height: 4px;
          background: linear-gradient(90deg,rgba(78, 70, 229, 0.61), #7c3aed,rgba(240, 224, 231, 0));
        }

        .card-header {
          padding: 1.25rem 1.25rem 0;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 1rem;
          text-align: center;
        }

        .card-date {
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          margin: 2rem 0 1rem 0;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          text-decoration: none;
        }

        .action-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
          text-decoration: none;
        }

        .edit-btn:hover {
          color: #6366f1;
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .delete-btn {
          background: transparent;
          border: 2px solid #e5e7eb;
          color: #9ca3af;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .delete-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: #dc2626;
          transition: left 0.2s ease;
          z-index: -1;
        }

        .delete-btn:hover {
          border-color: #dc2626;
          color: #dc2626;
        }

        .delete-btn:hover::before {
          left: 0;
        }

        .delete-btn:hover i {
          color: #dc2626;
          position: relative;
          z-index: 1;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .card-content {
          padding: 1.25rem;
          flex: 1;
        }

        .card-link {
          text-decoration: none;
          color: inherit;
        }

        .card-link:hover {
          text-decoration: none;
          color: inherit;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.3;
          transition: color 0.2s ease;
        }

        .card-link:hover .card-title {
          color: #6366f1;
        }

        .card-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.85rem;
        }

        .stat-icon.keywords {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }

        .stat-icon.questions {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
        }

        .stat-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          color: #64748b;
          font-size: 1rem;
          font-weight: 600;
        }

        .keywords-preview {
          margin-top: 1rem;
        }

        .keywords-label {
          color: #475569;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .keywords-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .keyword-tag {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(99, 102, 241, 0.2);
        }

        .more-keywords {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .processing-indicator {
          margin-top: 1rem;
          padding: 0.5rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          color: #92400e;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .failed-indicator {
          margin-top: 1rem;
          padding: 0.5rem;
          background: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 8px;
          color: #dc2626;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .card-footer {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .study-btn {
          background: white !important;
          color: #6366f1 !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 0.75rem 1.25rem !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-decoration: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          position: relative !important;
          overflow: hidden !important;
          width: auto !important;
        }

        .study-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .study-btn:hover {
          border-color: #6366f1 !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25) !important;
          background: transparent !important;
          text-decoration: none !important;
        }

        .study-btn:hover::before {
          left: 0;
        }

        .study-btn:hover::before {
          left: 0;
        }

        .study-btn:hover {
          background: #f8fafc !important;
          color: #475569 !important;
          text-decoration: none !important;
        }

        .study-btn:hover i {
          color: #475569 !important;
        }

        .error-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: #ef4444;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
          z-index: 1000;
          animation: slideIn 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background 0.2s ease;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .worksheets-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .controls-section {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .search-box {
            max-width: 600px;
          }

          .sort-controls {
            justify-content: space-between;
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
            flex-direction: column;
            gap: 0.5rem;
          }

          .page-subtitle {
            font-size: 1.1rem;
          }

          .worksheets-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .card-stats {
            gap: 0.75rem;
          }

          .stat-icon {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
          }

          .stat-value {
            font-size: 1rem;
          }

          .empty-state {
            padding: 3rem 1rem;
          }

          .empty-icon {
            width: 100px;
            height: 100px;
            font-size: 2.5rem;
          }

          .empty-title {
            font-size: 1.75rem;
          }

          .empty-description {
            font-size: 1rem;
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

          .controls-section {
            padding: 1rem;
          }

          .card-header,
          .card-content,
          .card-footer {
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card-title {
            font-size: 1.1rem;
          }

          .card-actions {
            gap: 0.25rem;
          }

          .action-btn {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
          }

          .error-toast {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            padding: 0.75rem 1rem;
          }

          .keywords-tags {
            gap: 0.25rem;
          }

          .keyword-tag {
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
          }
        }
      `}</style>
    </div>
  );
};

WorksheetsIndex.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return { worksheets: [] };
  }

  try {
    const { data } = await client.get('/api/worksheets');
    return { worksheets: data };
  } catch (error) {
    console.log('Error fetching worksheets:', error);
    return { worksheets: [] };
  }
};

export default WorksheetsIndex;