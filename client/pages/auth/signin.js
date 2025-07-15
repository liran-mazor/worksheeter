import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { doRequest, errors } = useRequest({
    url: '/api/auth/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => {
      console.log('Signin successful!');
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
            <h2 className="auth-title">Welcome Back</h2>
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
                  placeholder="Enter your password"
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>Don't have an account? 
              <Link href="/auth/signup" className="auth-link"> Sign Up</Link>
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
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          font-family: 'Cinzel', serif;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 4rem 1rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-page::before {
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

        .auth-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
        }

        .app-title {
          font-family: 'Playfair Display', serif;
          font-size: 5rem;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0 0 3rem 0;
          text-align: center;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .app-title::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 3px;
          background: linear-gradient(90deg, 
            transparent, 
            #6366f1, 
            #8b5cf6, 
            #6366f1, 
            transparent);
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }

        .auth-card {
          background: rgba(51, 65, 85, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.25),
            0 10px 25px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(71, 85, 105, 0.3);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }



        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .auth-title {
          font-size: 2.2rem;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
          line-height: 1.3;
        }

        .auth-form {
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          color: #cbd5e1;
          font-weight: 500;
          font-size: 1.3rem;
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
          color: #94a3b8;
          font-size: 1rem;
          z-index: 2;
        }

        .form-input {
          width: 100%;
          padding: 1.2rem 1.2rem 1.2rem 3rem;
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 4px;
          font-size: 1.4rem;
          font-weight: 400;
          color: #f1f5f9;
          background: rgba(30, 41, 59, 0.5);
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-family: 'Cinzel', serif;
        }

        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          background: rgba(30, 41, 59, 0.7);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-input::placeholder {
          color: #64748b;
          font-weight: 400;
        }

        .error-container {
          margin-bottom: 1.5rem;
          padding: 1rem 1.2rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 1.2rem;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          font-size: 1.3rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
          font-family: 'Cinzel', serif;
        }



        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          text-align: center;
          padding-top: 1.5rem;
          position: relative;
          z-index: 2;
        }

        .auth-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(71, 85, 105, 0.5), 
            transparent);
        }

        .auth-footer p {
          color: #94a3b8;
          font-size: 1.1rem;
          margin: 0;
        }

        .auth-link {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
          margin-left: 0.5rem;
          transition: color 0.2s ease;
        }



        .bg-element {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .bg-element-1 {
          width: 400px;
          height: 400px;
          top: -10%;
          left: -15%;
          animation: float 12s ease-in-out infinite;
        }

        .bg-element-2 {
          width: 300px;
          height: 300px;
          bottom: -10%;
          right: -15%;
          animation: float 15s ease-in-out infinite reverse;
        }

        .bg-element-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 60%;
          animation: float 18s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 0.4; 
          }
          50% { 
            transform: translateY(-30px) scale(1.05); 
            opacity: 0.6; 
          }
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .auth-page {
            padding: 2rem 1rem;
          }

          .auth-card {
            padding: 2rem 1.5rem;
          }

          .app-title {
            font-size: 2.5rem;
          }

          .auth-title {
            font-size: 1.8rem;
          }

          .form-input {
            padding: 1rem 1rem 1rem 2.8rem;
            font-size: 1.2rem;
          }

          .submit-btn {
            padding: 1rem 1.25rem;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};