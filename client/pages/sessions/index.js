import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SessionsIndex = ({ currentUser }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/signup');
      return;
    }
    setIsVisible(true);
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirecting to sign up...</p>
      </div>
    );
  }

  return (
    <div className={`sessions-index ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="elegant-silver-title-v2">
              <i className="fas fa-user-clock me-3"></i>
              My Sessions
            </h1>
            <div className="elegant-separator"></div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Empty State for now */}
        <div className="empty-state">
          <div className="empty-icon" style={{ fontSize: '4rem', width: '140px', height: '140px', marginBottom: '2.5rem' }}>
            <i className="fas fa-user-clock"></i>
          </div>
          <h3 className="empty-title" style={{ fontSize: '2.8rem', marginBottom: '1.5rem' }}>
            Sessions Coming Soon
          </h3>
          <p className="empty-description" style={{ fontSize: '1.5rem', marginBottom: '2.5rem' }}>
            This feature will allow you to have online sessions with AI-powered transcription and summarization using Whisper AI.
          </p>
          <div className="coming-soon-features">
            <div className="feature-item">
              <i className="fas fa-microphone"></i>
              <span>Real-time audio transcription</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-brain"></i>
              <span>AI-powered session summaries</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-history"></i>
              <span>Session history and analytics</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sessions-index {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .sessions-index.visible {
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
        .sessions-index h1.elegant-silver-title-v2 {
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

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #334155;
          border-radius: 16px;
          border: 1px solid #475569;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #475569, #64748b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: #cbd5e1;
          font-size: 3rem;
        }

        .empty-title {
          font-size: 2rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 1rem;
        }

        .empty-description {
          font-size: 1.1rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .coming-soon-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #475569;
          border: 1px solid #64748b;
          border-radius: 12px;
          color: #cbd5e1;
          font-weight: 500;
        }

        .feature-item i {
          color: #8b5cf6;
          font-size: 1.2rem;
          width: 20px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #475569;
          border-top: 4px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .creator-header {
            padding: 2rem 0 1.5rem;
            margin-bottom: 2rem;
          }

          .elegant-silver-title-v2 {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .page-subtitle {
            font-size: 1.1rem;
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

          .elegant-silver-title-v2 {
            font-size: 1.75rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

SessionsIndex.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
    return {};
  }

  return {};
};

export default SessionsIndex;
