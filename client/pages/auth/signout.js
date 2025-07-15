import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

export default () => {
  console.log('🔥 SignoutPage: Component function called');
  const [isVisible, setIsVisible] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/auth/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      console.log('🔥 useRequest onSuccess called');
      console.log('🔥 About to redirect using window.location.href');
      
      // Use window.location instead of Router.push to avoid React navigation issues
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  });

  useEffect(() => {
    console.log('🔥 useEffect: Calling doRequest');
    setIsVisible(true);
    doRequest();
  }, []);

  return (
    <div className={`signout-container ${isVisible ? 'visible' : ''}`}>
      <div className="signout-content">
        
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        
        <div className="signout-text">
          <h3 className="signout-title">Signing Out...</h3>
        </div>
        
      </div>

      <style jsx>{`
        .signout-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          font-family: 'Cinzel', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
          position: relative;
          overflow: hidden;
        }

        .signout-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .signout-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .signout-content {
          background: rgba(51, 65, 85, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          text-align: center;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 10px 25px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(71, 85, 105, 0.3);
          max-width: 400px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .brand-section {
          margin-bottom: 2rem;
          animation: brandFadeIn 0.8s ease-out 0.2s both;
        }

        .app-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .app-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            #6366f1, 
            #8b5cf6, 
            #6366f1, 
            transparent);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
        }

        .signout-icon {
          margin-bottom: 1.5rem;
          animation: iconSlideUp 0.6s ease-out 0.4s both;
        }

        .signout-icon i {
          font-size: 3rem;
          color: #6366f1;
          opacity: 0.8;
          text-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .signout-text {
          margin-bottom: 2rem;
        }

        .signout-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
          animation: titleSlideUp 0.6s ease-out 0.6s both;
        }

        .signout-description {
          font-size: 1rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.5;
          animation: descriptionFadeIn 0.6s ease-out 0.8s both;
        }

        @keyframes brandFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes titleSlideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes descriptionFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .loading-spinner {
          margin-bottom: 2rem;
          animation: spinnerAppear 0.6s ease-out 1s both;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(99, 102, 241, 0.15);
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spinnerAppear {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .signout-footer {
          animation: footerFadeIn 0.6s ease-out 1.2s both;
        }

        .signout-footer p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        @keyframes footerFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .signout-container {
            padding: 1.5rem;
          }

          .signout-content {
            padding: 2.5rem 2rem;
          }

          .app-title {
            font-size: 2rem;
          }

          .signout-title {
            font-size: 1.5rem;
          }

          .signout-icon i {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .signout-content {
            padding: 2rem 1.5rem;
          }

          .app-title {
            font-size: 1.8rem;
          }

          .signout-title {
            font-size: 1.3rem;
          }

          .signout-description {
            font-size: 0.9rem;
          }

          .signout-icon i {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};