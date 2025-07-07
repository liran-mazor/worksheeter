import Link from 'next/link';
import { useState, useEffect } from 'react';

const LandingPage = ({ currentUser }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`landing-page ${currentUser ? 'dashboard-layout' : 'guest-layout'} ${isVisible ? 'visible' : ''}`}>
      {currentUser ? (
        // Authenticated User Dashboard
        <div className="dashboard-content">
          {/* Platform Overview */}
          <section className="platform-section">
            <div className="container">
              <div className="platform-content">
                <div className="platform-intro">
                  <h2 className="platform-title">What Worksheeter Does</h2>
                  <p className="platform-description">
                    Worksheeter transforms traditional learning with AI-powered analysis, 
                    personalized feedback, and adaptive content that grows with you. 
                    Every interaction helps us understand your learning style better.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Thomas Introduction */}
          <section className="thomas-intro-section">
            <div className="container">
              <div className="thomas-showcase">
                <div className="thomas-visual">
                  <div className="thomas-avatar">
                    <svg viewBox="0 0 100 100" className="robot-svg">
                      <defs>
                        <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#f1f3f4" />
                        </linearGradient>
                      </defs>
                      
                      {/* Robot Head */}
                      <rect x="25" y="20" width="50" height="45" rx="8" fill="url(#robotGradient)" />
                      
                      {/* Antenna */}
                      <circle cx="50" cy="15" r="3" fill="#ffffff" />
                      <line x1="50" y1="18" x2="50" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Eyes */}
                      <circle cx="38" cy="35" r="6" fill="url(#eyeGradient)" />
                      <circle cx="62" cy="35" r="6" fill="url(#eyeGradient)" />
                      <circle cx="38" cy="35" r="3" fill="#6366f1" />
                      <circle cx="62" cy="35" r="3" fill="#6366f1" />
                      
                      {/* Mouth */}
                      <rect x="43" y="48" width="14" height="8" rx="4" fill="#ffffff" />
                      <rect x="45" y="50" width="2" height="4" fill="#6366f1" />
                      <rect x="48" y="50" width="2" height="4" fill="#6366f1" />
                      <rect x="51" y="50" width="2" height="4" fill="#6366f1" />
                      <rect x="54" y="50" width="2" height="4" fill="#6366f1" />
                      
                      {/* Robot Body */}
                      <rect x="30" y="65" width="40" height="25" rx="6" fill="url(#robotGradient)" />
                      
                      {/* Control Panel */}
                      <rect x="35" y="70" width="30" height="15" rx="3" fill="#ffffff" />
                      <circle cx="42" cy="77" r="2" fill="#6366f1" />
                      <circle cx="50" cy="77" r="2" fill="#8b5cf6" />
                      <circle cx="58" cy="77" r="2" fill="#6366f1" />
                      
                      {/* Arms */}
                      <rect x="15" y="68" width="12" height="8" rx="4" fill="url(#robotGradient)" />
                      <rect x="73" y="68" width="12" height="8" rx="4" fill="url(#robotGradient)" />
                      
                      {/* Hands */}
                      <circle cx="21" cy="80" r="4" fill="#ffffff" />
                      <circle cx="79" cy="80" r="4" fill="#ffffff" />
                    </svg>
                  </div>
                </div>
                <div className="thomas-info">
                  <h2 className="thomas-title">Meet Thomas</h2>
                  <p className="thomas-description">
                    Your AI learning assistant understands your unique learning patterns 
                    and provides personalized guidance. Thomas analyzes your progress, 
                    identifies areas for improvement, and suggests the most effective 
                    learning strategies tailored specifically for you.
                  </p>
                  <div className="thomas-capabilities">
                    <div className="capability">
                      <span className="capability-icon">💡</span>
                      <span>Personalized Learning Insights</span>
                    </div>
                    <div className="capability">
                      <span className="capability-icon">📊</span>
                      <span>Progress Analysis & Feedback</span>
                    </div>
                    <div className="capability">
                      <span className="capability-icon">🎯</span>
                      <span>Adaptive Content Recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="philosophy-section">
            <div className="container">
              <div className="philosophy-content">
                <h2 className="philosophy-title">Our Learning Philosophy</h2>
                <p className="philosophy-text">
                  We believe that every learner is unique. Traditional one-size-fits-all 
                  approaches often leave students behind or hold them back. Worksheeter 
                  adapts to your individual learning style, pace, and goals—creating a 
                  truly personalized educational experience that evolves with you.
                </p>
                <div className="philosophy-principles">
                  <div className="principle">
                    <h3>Adaptive Learning</h3>
                    <p>Content that adjusts to your understanding</p>
                  </div>
                  <div className="principle">
                    <h3>Continuous Feedback</h3>
                    <p>Real-time insights to guide your progress</p>
                  </div>
                  <div className="principle">
                    <h3>Holistic Growth</h3>
                    <p>Supporting both knowledge and critical thinking</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        // Guest Landing Page (unchanged)
        <section className="hero-section hero-centered">
          <div className="hero-background-elements">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>
          
          <div className="container">
            <div className="hero-content-modern">
              <h5 className="hero-title-modern">
                <span className="brand-text">Worksheeter</span>
                <span className="main-title">Transform Your Learning Journey</span>
                <span className="subtitle-gradient">with AI-Driven Insights</span>
              </h5>
              
              <p className="hero-description-modern">
                Experience personalized education like never before. Upload worksheets, solve coding challenges, 
                take interactive quizzes, and receive AI-powered feedback that adapts to your learning style.
              </p>
              
              <div className="hero-actions-modern">
                <Link href="/auth/signup" className="btn btn-primary btn-xl">
                  <span className="btn-text">Start Learning Free</span>
                  <span className="btn-icon">→</span>
                </Link>
                <Link href="/auth/signin" className="btn btn-outline-primary btn-xl">
                  <span className="btn-text">Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .landing-page.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Dashboard Layout */
        .dashboard-layout {
          background: white;
          min-height: 100vh;
        }

        .dashboard-content {
          padding-top: 2rem;
        }

        /* Platform Section */
        .platform-section {
          padding: 4rem 0;
          background: rgba(248, 250, 252, 0.5);
        }

        .platform-intro {
          text-align: center;
          margin-bottom: 4rem;
        }

        .platform-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        .platform-description {
          font-size: 1.2rem;
          color: #475569;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 400;
        }

        /* Thomas Section */
        .thomas-intro-section {
          padding: 5rem 0;
        }

        .thomas-showcase {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .thomas-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .thomas-avatar {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
        }

        .robot-svg {
          width: 120px;
          height: 120px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .thomas-title {
          font-size: 2.2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        .thomas-description {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .thomas-capabilities {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .capability {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
          color: #64748b;
          font-weight: 500;
        }

        .capability-icon {
          font-size: 1.2rem;
        }

        /* Philosophy Section */
        .philosophy-section {
          padding: 5rem 0;
          background: rgba(248, 250, 252, 0.5);
        }

        .philosophy-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .philosophy-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2rem;
          letter-spacing: -0.01em;
        }

        .philosophy-text {
          font-size: 1.2rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        .philosophy-principles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .principle {
          text-align: center;
          padding: 1.5rem;
        }

        .principle h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .principle p {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* Guest Layout (unchanged styles) */
        .guest-layout {
          background: 
            linear-gradient(135deg, #667eea 0%, #764ba2 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .guest-layout::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-section {
          padding: 4rem 2rem;
          text-align: center;
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-background-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .floating-shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(2px);
        }

        .shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: -5%;
          animation: float1 15s ease-in-out infinite;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: -3%;
          animation: float2 12s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          top: 30%;
          right: 20%;
          animation: float3 18s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-30px) translateX(20px) rotate(180deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(25px) translateX(-15px) scale(1.1); }
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(-180deg); }
        }

        .hero-content-modern {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          animation: heroFadeIn 1s ease-out;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title-modern {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
          animation: titleSlideUp 0.8s ease-out 0.4s both;
        }

        .brand-text {
          font-size: 7rem;
          font-weight: 900;
          background: linear-gradient(135deg,rgb(235, 225, 194) 0%,rgb(230, 227, 227) 25%, #ffffff 50%,rgb(247, 223, 218) 75%,rgb(235, 225, 194) 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          display: block;
          animation: shimmer 3s ease-in-out infinite, brandGlow 2s ease-in-out infinite alternate;
          text-shadow: 0 0 30px rgba(255, 234, 167, 0.5);
          filter: drop-shadow(0 4px 20px rgba(255, 234, 167, 0.3));
        }

        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes brandGlow {
          0% { 
            filter: drop-shadow(0 4px 20px rgba(255, 234, 167, 0.3)) brightness(1);
          }
          100% { 
            filter: drop-shadow(0 4px 30px rgba(255, 234, 167, 0.6)) brightness(1.1);
          }
        }

        .main-title {
          font-size: 4rem;
          font-weight: 700;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .subtitle-gradient {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg,rgb(86, 87, 88),rgb(80, 80, 82));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        @keyframes titleSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-description-modern {
          font-size: 1.5rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          animation: descriptionFadeIn 0.8s ease-out 0.6s both;
        }

        @keyframes descriptionFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-actions-modern {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 4rem;
          animation: actionsSlideUp 0.8s ease-out 0.8s both;
        }

        @keyframes actionsSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn-text {
          font-weight: 700;
        }

        .btn-icon {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .btn:hover .btn-icon {
          transform: translateX(4px);
        }

        .btn {
          padding: 1.5rem 3rem;
          border-radius: 20px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          border: none;
          font-size: 1.25rem;
          letter-spacing: 0.01em;
          min-width: 220px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1e40af 0%, #3730a3 25%, #4338ca 50%, #3730a3 75%, #1e40af 100%);
          background-size: 300% 100%;
          color: white;
          box-shadow: 
            0 8px 32px rgba(30, 64, 175, 0.4),
            0 4px 16px rgba(30, 64, 175, 0.3);
        }

        .btn-primary:hover {
          background-position: 100% 0;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 
            0 16px 48px rgba(30, 64, 175, 0.5),
            0 8px 24px rgba(30, 64, 175, 0.4);
          color: white;
          text-decoration: none;
        }

        .btn-outline-primary {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .btn-outline-primary:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.4);
        }

        .btn-xl {
          padding: 1.5rem 3rem;
          font-size: 1.25rem;
          border-radius: 20px;
          min-width: 220px;
          font-weight: 800;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .thomas-showcase {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .features-showcase {
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .welcome-title {
            font-size: 2.5rem;
          }

          .welcome-subtitle {
            font-size: 1.1rem;
          }

          .platform-title {
            font-size: 2rem;
          }

          .platform-description {
            font-size: 1.1rem;
          }

          .feature-display {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
            padding: 1.5rem;
          }

          .thomas-title {
            font-size: 1.8rem;
          }

          .thomas-description {
            font-size: 1rem;
          }

          .thomas-avatar {
            width: 150px;
            height: 150px;
          }

          .robot-svg {
            width: 90px;
            height: 90px;
          }

          .philosophy-title {
            font-size: 2rem;
          }

          .philosophy-text {
            font-size: 1.1rem;
          }

          .philosophy-principles {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .container {
            padding: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .platform-title {
            font-size: 1.7rem;
          }

          .thomas-title {
            font-size: 1.5rem;
          }

          .philosophy-title {
            font-size: 1.7rem;
          }

          .brand-text {
            font-size: 2.5rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .subtitle-gradient {
            font-size: 1.5rem;
          }

          .hero-description-modern {
            font-size: 1rem;
          }

          .hero-actions-modern {
            flex-direction: column;
            align-items: center;
            margin-bottom: 1rem;
          }

          .btn-xl {
            width: 100%;
            max-width: 280px;
          }

          .thomas-avatar {
            width: 120px;
            height: 120px;
          }

          .robot-svg {
            width: 70px;
            height: 70px;
          }

          .capability {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;