import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { doRequest, errors } = useRequest({
    url: '/api/auth/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: (data) => {
      console.log('Signup successful!', data);
      
      // Force a full page reload to refresh the currentUser
      window.location.href = '/';
    }
  });

  const onSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    await doRequest();
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="app-title">Worksheeter</h1>
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h2 className="auth-title">Create Your Account</h2>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  className="form-input"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Error Display */}
            {errors && (
              <div className="error-container">
                {errors}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading && <i className="fas fa-spinner fa-spin"></i>}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>Already have an account? 
              <Link href="/auth/signin" className="auth-link"> Sign In</Link>
            </p>
          </div>
        </div>

        {/* Background Elements */}
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 6rem 1rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 580px;
        }

        .auth-card {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.85) 0%, 
            rgba(255, 255, 255, 0.75) 100%);
          backdrop-filter: blur(32px) saturate(200%) brightness(110%);
          border-radius: 32px;
          padding: 5rem 4rem;
          box-shadow: 
            0 40px 80px rgba(102, 126, 234, 0.08),
            0 24px 48px rgba(0, 0, 0, 0.06),
            0 12px 24px rgba(0, 0, 0, 0.04),
            0 6px 12px rgba(0, 0, 0, 0.02),
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            inset 0 -2px 4px rgba(0, 0, 0, 0.02),
            inset 0 0 0 1px rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .auth-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 48px 96px rgba(102, 126, 234, 0.12),
            0 32px 64px rgba(0, 0, 0, 0.08),
            0 16px 32px rgba(0, 0, 0, 0.06),
            0 8px 16px rgba(0, 0, 0, 0.04),
            inset 0 2px 4px rgba(255, 255, 255, 0.9),
            inset 0 -2px 4px rgba(0, 0, 0, 0.02),
            inset 0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .auth-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.8) 20%, 
            rgba(255, 255, 255, 1) 50%, 
            rgba(255, 255, 255, 0.8) 80%, 
            transparent 100%);
          z-index: 1;
          border-radius: 32px 32px 0 0;
        }

        .auth-card::after {
          content: '';
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: 
            radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%);
          opacity: 0.8;
          z-index: 0;
          pointer-events: none;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: rotate(0deg) scale(1); 
            opacity: 0.8; 
          }
          50% { 
            transform: rotate(1deg) scale(1.02); 
            opacity: 0.6; 
          }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
        }

        .app-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 2.5rem 0;
          line-height: 1.1;
          letter-spacing: -0.03em;
          text-shadow: 
            0 0 40px rgba(255, 255, 255, 0.5),
            0 8px 24px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.2);
          position: relative;
          text-align: center;
          z-index: 3;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
          font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .app-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.8), 
            transparent);
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .brand-link {
          display: inline-block;
          text-decoration: none;
          margin-bottom: 1.5rem;
        }

        .brand-name {
          font-size: 2rem;
          font-weight: 900;
          color: #667eea;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
          line-height: 1.3;
        }

        .auth-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }

        .auth-form {
          margin-bottom: 3rem;
          position: relative;
          z-index: 2;
        }

        .form-group {
          margin-bottom: 2.5rem;
        }

        .form-label {
          display: block;
          color: #374151;
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 1.25rem;
          z-index: 2;
        }

        .form-input {
          width: 100%;
          padding: 1.25rem 1.5rem 1.25rem 3.25rem;
          border: 2px solid rgba(229, 231, 235, 0.6);
          border-radius: 16px;
          font-size: 1.5rem;
          font-weight: 400;
          color: #1e293b;
          background: rgba(255, 255, 255, 0.95);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.02),
            inset 0 1px 2px rgba(255, 255, 255, 0.8);
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 255, 255, 0.85) 100%);
          box-shadow: 
            0 0 0 4px rgba(102, 126, 234, 0.08),
            0 4px 16px rgba(102, 126, 234, 0.04),
            inset 0 1px 2px rgba(255, 255, 255, 0.9);
          transform: translateY(-1px);
        }

        .form-input::placeholder {
          color: #6b7280;
          font-weight: 400;
        }

        .error-container {
          margin-bottom: 2.5rem;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, 
            #667eea 0%, 
            #764ba2 50%, 
            #667eea 100%);
          background-size: 200% 100%;
          color: white;
          border: none;
          border-radius: 16px;
          padding: 1.5rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 
            0 8px 24px rgba(102, 126, 234, 0.25),
            0 4px 12px rgba(102, 126, 234, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent);
          transition: left 0.6s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background-position: 100% 0;
          transform: translateY(-3px);
          box-shadow: 
            0 16px 40px rgba(102, 126, 234, 0.35),
            0 8px 20px rgba(102, 126, 234, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .submit-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.loading {
          pointer-events: none;
        }

        .auth-footer {
          text-align: center;
          padding-top: 2rem;
          position: relative;
          z-index: 2;
        }

        .auth-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(148, 163, 184, 0.2) 10%, 
            rgba(100, 116, 139, 0.6) 30%, 
            rgba(71, 85, 105, 0.9) 50%, 
            rgba(100, 116, 139, 0.6) 70%, 
            rgba(148, 163, 184, 0.2) 90%, 
            transparent 100%);
          border-radius: 1px;
          filter: blur(0.5px);
          box-shadow: 
            0 0 2px rgba(71, 85, 105, 0.3),
            0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .auth-footer p {
          color: #64748b;
          font-size: 1.2rem;
          margin: 0;
        }

        .auth-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: #5855eb;
          text-decoration: underline;
        }

        .bg-element {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .bg-element-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: -10%;
          animation: float 8s ease-in-out infinite;
        }

        .bg-element-2 {
          width: 200px;
          height: 200px;
          bottom: 20%;
          right: -5%;
          animation: float 6s ease-in-out infinite reverse;
        }

        .bg-element-3 {
          width: 150px;
          height: 150px;
          top: 60%;
          left: 20%;
          animation: float 10s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .auth-page {
            padding: 3rem 0.75rem;
          }

          .auth-card {
            padding: 3.5rem 2.25rem;
            border-radius: 28px;
          }

          .app-title {
            font-size: 2.5rem;
          }

          .brand-name {
            font-size: 1.75rem;
          }

          .auth-title {
            font-size: 1.75rem;
          }

          .auth-subtitle {
            font-size: 1rem;
          }

          .form-input {
            padding: 1.125rem 1.125rem 1.125rem 3rem;
            font-size: 1.25rem;
          }

          .submit-btn {
            padding: 1.25rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};