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
          {/* Welcome Hero */}
          <section className="welcome-hero">
            <div className="container">
              <div className="hero-content">
                <div className="hero-text">
                  <h1 className="elegant-silver-title-v2">Welcome back to Worksheeter</h1>
                  
                  {/* Diamond Separator */}
                  <div className="diamond-separator">
                    <div className="separator-line"></div>
                    <div className="separator-icon">
                      <div className="icon-diamond"></div>
                    </div>
                    <div className="separator-line"></div>
                  </div>

                  <p className="hero-subtitle">
                    Experience personalized education like never before. Upload worksheets, solve coding challenges, 
                    take interactive quizzes, and receive AI-powered feedback that adapts to your learning style.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Core Features Overview */}
          <section className="features-overview">
            <div className="container">
              <div className="thomas-layout">
                <div className="thomas-info">
                  <h2>Meet Thomas: <br></br>Your Learning AI Assistant</h2>
                  <p className="thomas-description">
                    Thomas is an advanced AI assistant that understands your unique learning style 
                    and provides personalized guidance throughout your educational journey. Using 
                    sophisticated analysis of your progress, Thomas offers targeted recommendations, 
                    identifies knowledge gaps, and suggests optimal learning strategies.
                  </p>
                  
                  <div className="thomas-capabilities">
                    <div className="capability-row">
                      <div className="capability-icon">🧠</div>
                      <div className="capability-content">
                        <h4>Cognitive Pattern Recognition</h4>
                        <p>Analyzes how you learn best and adapts accordingly</p>
                    </div>
                    </div>
                    <div className="capability-row">
                      <div className="capability-icon">📈</div>
                      <div className="capability-content">
                        <h4>Performance Optimization</h4>
                        <p>Identifies areas for improvement and suggests targeted practice</p>
                    </div>
                  </div>
                    <div className="capability-row">
                      <div className="capability-icon">🎓</div>
                      <div className="capability-content">
                        <h4>Educational Strategy Planning</h4>
                        <p>Creates personalized study plans and learning pathways</p>
                </div>
              </div>
            </div>
                </div>

                <div className="thomas-visual">
                  <div className="ai-interface">
                    <div className="interface-header">
                      <div className="interface-dots">
                        <span></span><span></span><span></span>
                  </div>
                      <div className="interface-title">Thomas AI Assistant</div>
                  </div>
                    <div className="interface-content">
                      <div className="ai-message">
                        <div className="message-avatar">T</div>
                        <div className="message-bubble">
                          Based on your recent quiz performance, I recommend focusing on algebra 
                          fundamentals. Would you like me to create a personalized study plan?
                        </div>
                      </div>
                      <div className="ai-indicators">
                        <div className="typing-indicator">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    </div>
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
                <span className="elegant-silver-title-v2">Worksheeter</span>
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
                <Link href="/auth/signin" className="btn btn-primary btn-xl">
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
          background: rgba(255, 255, 255, 0.95);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .dashboard-layout::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          background-image: 
            radial-gradient(circle at 15% 20%, transparent 40px, transparent 41px),
            radial-gradient(circle at 85% 10%, transparent 60px, transparent 61px),
            radial-gradient(circle at 25% 80%, transparent 35px, transparent 36px),
            radial-gradient(circle at 75% 60%, transparent 50px, transparent 51px),
            radial-gradient(circle at 10% 60%, transparent 45px, transparent 46px),
            radial-gradient(circle at 90% 85%, transparent 55px, transparent 56px),
            radial-gradient(circle at 60% 15%, transparent 40px, transparent 41px),
            radial-gradient(circle at 40% 90%, transparent 48px, transparent 49px);
          background-size: 100% 100%;
          opacity: 0.03;
        }

        .dashboard-layout::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          background: 
            /* Top section bubbles */
            radial-gradient(circle 40px at 15% 8%, transparent 38px, rgba(99, 102, 241, 0.4) 40px, transparent 42px),
            radial-gradient(circle 60px at 85% 5%, transparent 58px, rgba(139, 92, 246, 0.35) 60px, transparent 62px),
            radial-gradient(circle 35px at 45% 12%, transparent 33px, rgba(99, 102, 241, 0.3) 35px, transparent 37px),
            
            /* Middle section bubbles */
            radial-gradient(circle 50px at 25% 35%, transparent 48px, rgba(139, 92, 246, 0.45) 50px, transparent 52px),
            radial-gradient(circle 45px at 75% 40%, transparent 43px, rgba(99, 102, 241, 0.38) 45px, transparent 47px),
            radial-gradient(circle 38px at 10% 45%, transparent 36px, rgba(139, 92, 246, 0.32) 38px, transparent 40px),
            radial-gradient(circle 55px at 90% 50%, transparent 53px, rgba(99, 102, 241, 0.42) 55px, transparent 57px),
            
            /* Bottom section bubbles */
            radial-gradient(circle 42px at 30% 75%, transparent 40px, rgba(139, 92, 246, 0.36) 42px, transparent 44px),
            radial-gradient(circle 48px at 70% 80%, transparent 46px, rgba(99, 102, 241, 0.44) 48px, transparent 50px),
            radial-gradient(circle 35px at 15% 85%, transparent 33px, rgba(139, 92, 246, 0.31) 35px, transparent 37px),
            radial-gradient(circle 52px at 85% 90%, transparent 50px, rgba(99, 102, 241, 0.39) 52px, transparent 54px),
            
            /* Additional scattered bubbles */
            radial-gradient(circle 30px at 60% 25%, transparent 28px, rgba(139, 92, 246, 0.28) 30px, transparent 32px),
            radial-gradient(circle 44px at 5% 65%, transparent 42px, rgba(99, 102, 241, 0.34) 44px, transparent 46px),
            radial-gradient(circle 36px at 95% 30%, transparent 34px, rgba(139, 92, 246, 0.29) 36px, transparent 38px),
            radial-gradient(circle 40px at 50% 65%, transparent 38px, rgba(99, 102, 241, 0.26) 40px, transparent 42px);
          animation: bubbleFloat 20s ease-in-out infinite;
        }

        .dashboard-content {
          padding-top: 2rem;
          position: relative;
          z-index: 1;
        }

        @keyframes bubbleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-10px) scale(1.02);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-5px) scale(0.98);
            opacity: 0.7;
          }
          75% {
            transform: translateY(-15px) scale(1.01);
            opacity: 0.9;
          }
        }

        /* Welcome Hero */
        .welcome-hero {
          padding: 2rem 0 1rem;
          background: transparent;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
        }

        .hero-text {
          text-align: center;
          position: relative;
        }

                .elegant-silver-title-v2 {
          font-family: 'Playfair Display', serif !important;
          font-size: 4.5rem !important;
          font-weight: 800 !important;
          margin-bottom: 1rem !important;
          letter-spacing: -0.02em !important;
          color: #c0c4cc !important;
          text-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 3px 12px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2) !important;
          position: relative !important;
          animation: fadeInUp 1s ease-out !important;
          background: none !important;
          background-image: none !important;
          background-clip: unset !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
          text-fill-color: unset !important;
        }

        .diamond-separator {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 1.5rem 0 !important;
          width: 100% !important;
          opacity: 0.8 !important;
        }

        .separator-line {
          flex: 1 !important;
          height: 1px !important;
          background: linear-gradient(to right, transparent, #c0c4cc 20%, #c0c4cc 80%, transparent) !important;
          max-width: 200px !important;
        }

        .separator-icon {
          margin: 0 2rem !important;
          position: relative !important;
        }

        .icon-diamond {
          width: 12px !important;
          height: 12px !important;
          background: #c0c4cc !important;
          transform: rotate(45deg) !important;
          box-shadow: 0 0 20px rgba(192, 196, 204, 0.3) !important;
          animation: diamondPulse 3s infinite ease-in-out !important;
        }

        @keyframes diamondPulse {
          0%, 100% {
            transform: rotate(45deg) scale(1) !important;
            box-shadow: 0 0 20px rgba(192, 196, 204, 0.3) !important;
          }
          50% {
            transform: rotate(45deg) scale(1.1) !important;
            box-shadow: 0 0 30px rgba(192, 196, 204, 0.5) !important;
          }
        }

        h1.elegant-silver-title-v2,
        .landing-page h1.elegant-silver-title-v2,
        .dashboard-layout h1.elegant-silver-title-v2 {
          color: #c0c4cc !important;
          background: none !important;
          -webkit-text-fill-color: unset !important;
        }

        .hero-title::after {
          content: '';
          position: absolute;
          bottom: -25px;
          left: -1%;
          transform: translateX(-50%);
          width: 1000px;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), rgba(138, 92, 246, 0.6), transparent);
          border-radius: 2px;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

 

        .hero-subtitle {
          font-size: 1.3rem;
          opacity: 0.8;
          font-weight: 300;
          max-width: 1000px;
          margin: 0 auto;
          color:rgb(142, 102, 234);
          text-shadow: 0 1px 8px rgb(187, 187, 187);
          animation: fadeInUp 1s ease-out 0.5s both;
          
          }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.95);
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          opacity: 0.8;
          font-weight: 500;
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .progress-ring {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .progress-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-circle {
          animation: progressFill 2s ease-out 0.5s both;
        }

        @keyframes progressFill {
          from { stroke-dashoffset: 502; }
          to { stroke-dashoffset: 50; }
        }

        .progress-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .progress-percent {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .progress-text {
          display: block;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Modern Separators */
        .section-separator {
          padding: 2rem 0;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .separator-content {
          display: flex;
          align-items: center;
          gap: 2rem;
          width: 100%;
          max-width: 1000px;
        }

        .separator-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3), transparent);
          border-radius: 1px;
        }

        .separator-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .icon-diamond {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transform: rotate(45deg);
          border-radius: 2px;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
          animation: diamondPulse 3s ease-in-out infinite;
        }

        @keyframes diamondPulse {
          0%, 100% {
            transform: rotate(45deg) scale(1);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
          }
          50% {
            transform: rotate(45deg) scale(1.1);
            box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
          }
        }

        /* Modern Separator */
        .modern-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          gap: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .separator-line-modern {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(99, 102, 241, 0.2) 20%, 
            rgba(139, 92, 246, 0.3) 50%, 
            rgba(99, 102, 241, 0.2) 80%, 
            transparent
          );
          position: relative;
        }

        .separator-line-modern::after {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.8) 20%, 
            rgba(255, 255, 255, 0.9) 50%, 
            rgba(255, 255, 255, 0.8) 80%, 
            transparent
          );
          filter: blur(0.5px);
        }

        .separator-dots {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .separator-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          opacity: 0.7;
          animation: dotPulse 2s ease-in-out infinite;
        }

        .separator-dots span:nth-child(2) {
          animation-delay: 0.3s;
          width: 8px;
          height: 8px;
          opacity: 0.9;
        }

        .separator-dots span:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }



        /* Features Overview */
        .features-overview {
          padding: 6rem 0;
          background: transparent;
          position: relative;
          z-index: 1;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color:rgb(24, 24, 26);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .section-description {
          font-size: 1.2rem;
          color: #64748b;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.7;
        }



        /* Thomas Showcase */

        .thomas-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .thomas-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ai-interface {
          width: 100%;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .interface-header {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .interface-dots {
          display: flex;
          gap: 0.5rem;
        }

        .interface-dots span {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
        }

        .interface-title {
          font-size: 1.1rem;
          font-weight: 600;
          opacity: 0.95;
        }

        .interface-content {
          padding: 2rem 1.5rem;
        }

        .ai-message {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .message-bubble {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          font-size: 1.05rem;
          line-height: 1.5;
          color: #475569;
        }

        .ai-indicators {
          display: flex;
          justify-content: flex-start;
          padding-left: 3rem;
        }

        .typing-indicator {
          display: flex;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
          background: #f1f5f9;
          border-radius: 12px;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .thomas-info {
          text-align: left;
        }



        .thomas-info h2 {
          font-size: 3rem;
          font-weight: 700;
          color:rgb(69, 74, 83);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .thomas-description {
          font-size: 1.25rem;
          color: #475569;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .thomas-capabilities {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .capability-row {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .capability-icon {
          font-size: 1.8rem;
          width: 40px;
          flex-shrink: 0;
          text-align: center;
        }

        .capability-content h4 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .capability-content p {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }



        /* Guest Layout - Dark Theme */
        .guest-layout {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          font-family: 'Cinzel', serif;
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
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
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
          background: rgba(99, 102, 241, 0.03);
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

        /* Guest page specific styling for larger brand text */
        .guest-layout .elegant-silver-title-v2 {
          font-size: 5rem !important;
          display: block !important;
        }

        .brand-text::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
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

        .main-title {
          font-size: 3rem;
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.1;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .subtitle-gradient {
          font-size: 2rem;
          font-weight: 500;
          color: #94a3b8;
          line-height: 1.2;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
          font-size: 1.3rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
          background: #6366f1;
          color: white;
          border: 1px solid #6366f1;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #4f46e5;
          border: 1px solid #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
          color: white;
          text-decoration: none;
        }

        .btn-outline-primary {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(8px);
          color: #f1f5f9;
          border: 1px solid rgba(148, 163, 184, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: rgba(51, 65, 85, 0.95);
          color: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
          text-decoration: none;
          border: 1px solid rgba(148, 163, 184, 0.5);
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
          .hero-content {
            min-height: 50vh;
            padding: 2rem 1rem;
          }

          .thomas-layout {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            min-height: 45vh;
            padding: 1.5rem 1rem;
          }

          .hero-title {
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }

          .guest-layout .elegant-silver-title-v2 {
            font-size: 3.5rem !important;
          }

          .main-title {
            font-size: 2.2rem;
          }

          .subtitle-gradient {
            font-size: 1.5rem;
          }

          .hero-subtitle {
            font-size: 1.3rem;
          }

          .section-title {
            font-size: 1rem;
          }

          .section-description {
            font-size: 1.1rem;
          }

          .thomas-info h2 {
            font-size: 2.2rem;
          }

          .thomas-description {
            font-size: 1.15rem;
          }

          .ai-interface {
            max-width: 350px;
          }



          .container {
            padding: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .progress-ring {
            width: 120px;
            height: 120px;
          }

          .progress-percent {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .thomas-info h2 {
            font-size: 1.8rem;
          }

          .ai-interface {
            max-width: 300px;
          }

          .interface-content {
            padding: 1.5rem 1rem;
          }

          .message-bubble {
            font-size: 1rem;
          }

          .guest-layout .elegant-silver-title-v2 {
            font-size: 2.5rem !important;
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



          .capability-row {
            gap: 0.75rem;
          }

          .capability-icon {
            font-size: 1.5rem;
            width: 35px;
          }

          .separator-content {
            max-width: 400px;
            gap: 1rem;
          }

          .separator-line {
            height: 1px;
          }

          .icon-diamond {
            width: 16px;
            height: 16px;
          }

          .modern-separator {
            padding: 2rem 0;
            max-width: 300px;
            gap: 1rem;
          }

          .separator-dots span {
            width: 5px;
            height: 5px;
          }

          .separator-dots span:nth-child(2) {
            width: 6px;
            height: 6px;
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