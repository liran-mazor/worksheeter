import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const WorksheetDetail = ({ currentUser, worksheet: initialWorksheet }) => {
  const router = useRouter();
  const [worksheet, setWorksheet] = useState(initialWorksheet);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('keywords-definitions');
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to fetch worksheet data from API
  const fetchWorksheet = async () => {
    if (!router.query.worksheetId) return;
    
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/worksheets/${router.query.worksheetId}`);
      if (response.ok) {
        const data = await response.json();
        setWorksheet(data);
      }
    } catch (error) {
      console.error('Error fetching worksheet:', error);
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
    setIsMounted(true);
  }, [currentUser, router]);

  useEffect(() => {
    if (initialWorksheet) {
      setWorksheet(initialWorksheet);
    }
  }, [initialWorksheet]);

  // Auto-refresh when worksheet is processing and missing definitions/answers
  useEffect(() => {
    if (!worksheet || !isMounted) return;

    const needsRefresh = 
      worksheet.status === 'processing' || 
      (worksheet.status === 'completed' && 
       (!worksheet.keywordDefinitions || worksheet.keywordDefinitions.length === 0) &&
       (!worksheet.questionAnswers || worksheet.questionAnswers.length === 0));

    if (needsRefresh) {
      const interval = setInterval(fetchWorksheet, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [worksheet, isMounted]);

  // Listen for focus events to refresh when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      if (worksheet && (worksheet.status === 'processing' || 
          (!worksheet.keywordDefinitions?.length && !worksheet.questionAnswers?.length))) {
        fetchWorksheet();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [worksheet]);

  // Check for refresh query parameter
  useEffect(() => {
    if (router.query.refresh === 'true') {
      fetchWorksheet();
      // Clean up the URL
      router.replace(`/worksheets/${router.query.worksheetId}`, undefined, { shallow: true });
    }
  }, [router.query.refresh]);
  
  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirecting to sign in...</p>
      </div>
    );
  }

  if (!worksheet) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Worksheet not found or you don't have permission to view it.</p>
        <Link href="/worksheets" className="btn btn-primary">
          Back to Worksheets
        </Link>
      </div>
    );
  }
  
  const { doRequest: deleteWorksheet } = useRequest({
    url: `/api/worksheets/${worksheet?.id}`,
    method: 'delete',
    body: {},
    onSuccess: () => router.push('/worksheets')
  });

  // Safe date formatter that works consistently on server and client
  const formatDate = (dateString) => {
    if (!dateString || !isMounted) return 'Loading...';
    
    try {
      const date = new Date(dateString);
      // Only format on client side to avoid hydration issues
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this worksheet? This action cannot be undone.')) {
      setIsLoading(true);
      await deleteWorksheet();
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchWorksheet();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'processing':
        return '#f59e0b';
      case 'failed':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'processing':
        return 'fas fa-clock';
      case 'failed':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const isProcessingOrIncomplete = worksheet.status === 'processing' || 
    (worksheet.status === 'completed' && 
     (!worksheet.keywordDefinitions?.length && !worksheet.questionAnswers?.length));

  return (
    <div className={`worksheet-detail ${isVisible ? 'visible' : ''}`}>
      {/* Processing Banner */}
      {isProcessingOrIncomplete && (
        <div className="processing-banner">
          <div className="container">
            <div className="processing-content">
              <i className="fas fa-cogs fa-spin me-2"></i>
              <span>
                {worksheet.status === 'processing' 
                  ? 'Processing definitions and answers...' 
                  : 'Loading definitions and answers...'}
              </span>
              <button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="btn btn-sm btn-outline refresh-btn"
              >
                <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i>
                {isRefreshing ? 'Checking...' : 'Check Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="worksheet-header">
        <div className="container">
          <div className="header-content">
            <div className="worksheet-info">
              <div className="worksheet-title-section">
                <h1 className="worksheet-title">
                  {worksheet.title}
                  {isRefreshing && (
                    <i className="fas fa-spinner fa-spin ms-3" style={{ fontSize: '1.5rem' }}></i>
                  )}
                </h1>
                <div className="worksheet-meta">
                  <div className="meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Created: {formatDate(worksheet.createdAt)}</span>
                  </div>
                  <div className="meta-item">
                    <i className={getStatusIcon(worksheet.status)}></i>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(worksheet.status)}15`,
                        color: getStatusColor(worksheet.status),
                        border: `1px solid ${getStatusColor(worksheet.status)}30`
                      }}
                    >
                      {worksheet.status?.charAt(0).toUpperCase() + worksheet.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="worksheet-actions">
                <button 
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={isLoading}
                >
                  <i className="fas fa-trash"></i>
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="worksheet-content">
        <div className="container">
          {/* Tabs */}
          <div className="content-tabs">
            <button
              className={`tab-button ${selectedTab === 'keywords-definitions' ? 'active' : ''}`}
              onClick={() => setSelectedTab('keywords-definitions')}
            >
              <i className="fas fa-key"></i>
              Keywords & Definitions ({worksheet.keywords?.length || 0})
            </button>
            <button
              className={`tab-button ${selectedTab === 'questions-answers' ? 'active' : ''}`}
              onClick={() => setSelectedTab('questions-answers')}
            >
              <i className="fas fa-question-circle"></i>
              Questions & Answers ({worksheet.questions?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {selectedTab === 'keywords-definitions' && (
              <div className="keywords-definitions-section">
                {/* Keywords & Definitions Section */}
                <div className="section-header" style={{ marginTop: '3rem' }}>
                  <h2>Keywords & Definitions</h2>
                </div>
                {worksheet.keywordDefinitions?.length > 0 ? (
                  <div className="definitions-list">
                    {worksheet.keywordDefinitions.map((def, index) => (
                      <div key={index} className="definition-card">
                        <div className="definition-number">{index + 1}</div>
                        <div className="definition-content">
                          <h3 className="definition-keyword">{def.keyword}</h3>
                          <p className="definition-text">{def.definition}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-content">
                    <div className="empty-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <h3>No Definitions Available</h3>
                    <p>
                      {worksheet.status === 'processing' 
                        ? 'Definitions are being generated...' 
                        : 'Definitions will appear here once processing is complete.'}
                    </p>
                    {worksheet.status !== 'processing' && (
                      <button onClick={handleRefresh} className="btn btn-primary">
                        <i className="fas fa-sync-alt"></i>
                        Refresh
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'questions-answers' && (
              <div className="questions-answers-section">
                {/* Questions & Answers Section */}
                <div className="section-header" style={{ marginTop: '3rem' }}>
                  <h2>Question & Answers</h2>
                </div>
                {worksheet.questionAnswers?.length > 0 ? (
                  <div className="answers-list">
                    {worksheet.questionAnswers.map((qa, index) => (
                      <div key={index} className="answer-card">
                        <div className="answer-number">{index + 1}</div>
                        <div className="answer-content">
                          <h3 className="answer-question">{qa.question}</h3>
                          <p className="answer-text">{qa.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-content">
                    <div className="empty-icon">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <h3>No Answers Available</h3>
                    <p>
                      {worksheet.status === 'processing' 
                        ? 'Answers are being generated...' 
                        : 'Answers will appear here once processing is complete.'}
                    </p>
                    {worksheet.status !== 'processing' && (
                      <button onClick={handleRefresh} className="btn btn-primary">
                        <i className="fas fa-sync-alt"></i>
                        Refresh
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .worksheet-detail {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .worksheet-detail.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .processing-banner {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border-bottom: 1px solid #f59e0b;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .processing-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #92400e;
          font-weight: 500;
        }

        .refresh-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          min-width: 100px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .loading-container {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .worksheet-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem 0;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .breadcrumb-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .breadcrumb-link:hover {
          color: #6366f1;
          text-decoration: none;
        }

        .worksheet-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .worksheet-title {
          font-size: 3rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .worksheet-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 1.1rem;
        }

        .meta-item i {
          width: 16px;
          text-align: center;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .worksheet-actions {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: 1px solid transparent;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #5855eb, #7c3aed);
          text-decoration: none;
          color: white;
        }

        .btn-secondary {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
          color: #475569;
          text-decoration: none;
        }

        .btn-danger {
          background: transparent;
          color: #64748b;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .btn-danger:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.3);
          color: #dc2626;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
          transform: translateY(-1px);
        }

        .btn-outline {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .btn-outline:hover {
          background: #f8fafc;
          color: #475569;
          text-decoration: none;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .worksheet-content {
          padding: 2rem 0;
        }

        .content-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          font-size: 1.3rem;
        }

        .tab-button:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .tab-button.active {
          color: #6366f1;
          border-bottom-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .tab-content {
          min-height: 400px;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 2.4rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
          font-size: 1.15rem;
        }

        .keywords-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .keyword-item-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .keyword-number {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .keyword-text {
          font-weight: 600;
          color: #1e293b;
          font-size: 1.3rem;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .question-number {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .question-text {
          color: #1e293b;
          font-weight: 500;
          line-height: 1.6;
          font-size: 1.3rem;
        }

        .definitions-list,
        .answers-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .definition-card,
        .answer-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .definition-number,
        .answer-number {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .definition-content,
        .answer-content {
          flex: 1;
        }

        .definition-keyword,
        .answer-question {
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .definition-text,
        .answer-text {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          font-size: 1.3rem;
        }

        .empty-content {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #64748b;
          font-size: 2rem;
        }

        .empty-content h3 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .empty-content p {
          color: #64748b;
          margin-bottom: 2rem;
          font-size: 1.15rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .worksheet-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .worksheet-title {
            font-size: 2.5rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .worksheet-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .content-tabs {
            flex-wrap: wrap;
          }

          .keyword-item-card,
          .definition-card,
          .answer-card {
            flex-direction: column;
            text-align: center;
          }

          .question-card {
            flex-direction: column;
            text-align: center;
          }

          .processing-content {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

WorksheetDetail.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return { worksheet: null };
  }

  try {
    const { worksheetId } = context.query;
    const { data } = await client.get(`/api/worksheets/${worksheetId}`);
    return { worksheet: data };
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    return { worksheet: null };
  }
};

export default WorksheetDetail;