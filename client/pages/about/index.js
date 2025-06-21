import { useState, useEffect } from 'react';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Smart Keyword Extraction",
      description: "AI automatically identifies and highlights the most important terms and concepts from your worksheets.",
      icon: "fas fa-key",
      color: "#6366f1"
    },
    {
      title: "Instant Question Answers",
      description: "Get immediate, accurate answers to any question from your study materials with AI assistance.",
      icon: "fas fa-brain",
      color: "#8b5cf6"
    },
    {
      title: "Adaptive Learning",
      description: "The system learns your pace and adjusts difficulty to optimize your learning experience.",
      icon: "fas fa-chart-line",
      color: "#06b6d4"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and performance insights.",
      icon: "fas fa-trophy",
      color: "#10b981"
    }
  ];

  return (
    <div className={`about-page ${isVisible ? 'visible' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transforming How
              <br />
              <span className="gradient-text">Students Learn</span>
            </h1>
            
            <p className="hero-description">
              Worksheeter revolutionizes the traditional study process with AI-powered automation. 
              Upload your study materials and watch as our intelligent system extracts key concepts, 
              generates comprehensive definitions, and provides instant answers to your questions. 
              Experience the future of personalized education where technology adapts to your learning style, 
              making every study session more efficient and effective than ever before.
            </p>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">60%</div>
                <div className="stat-label">Time Saved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful AI Features</h2>
            <p className="section-subtitle">
              Advanced technology that makes learning effortless and engaging
            </p>
          </div>

          <div className="features-showcase">
            <div className="features-nav">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-nav-item ${activeFeature === index ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="feature-nav-icon" style={{ backgroundColor: feature.color }}>
                    <i className={feature.icon}></i>
                  </div>
                  <div className="feature-nav-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="features-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-interface">
                    <div className="app-header">
                      <div className="app-title">Worksheeter</div>
                      <div className="app-status">●</div>
                    </div>
                    <div className="app-content">
                      {activeFeature === 0 && (
                        <div className="demo-content">
                          <div className="demo-title">📝 Keywords Found</div>
                          <div className="keyword-list">
                            <div className="keyword-item">Photosynthesis</div>
                            <div className="keyword-item">Chlorophyll</div>
                            <div className="keyword-item">Glucose</div>
                          </div>
                          <div className="demo-footer">12 terms extracted</div>
                        </div>
                      )}
                      {activeFeature === 1 && (
                        <div className="demo-content">
                          <div className="demo-question">❓ What is photosynthesis?</div>
                          <div className="demo-answer">💡 Photosynthesis is the process by which plants convert sunlight into energy...</div>
                          <div className="demo-footer">95% confidence</div>
                        </div>
                      )}
                      {activeFeature === 2 && (
                        <div className="demo-content">
                          <div className="demo-title">🎯 Difficulty: Intermediate</div>
                          <div className="progress-ring">
                            <div className="progress-text">78%</div>
                          </div>
                          <div className="demo-footer">Next: Cell Structure</div>
                        </div>
                      )}
                      {activeFeature === 3 && (
                        <div className="demo-content">
                          <div className="demo-title">📊 Learning Analytics</div>
                          <div className="progress-stats">
                            <div className="stat">Study Time: 2h 15m</div>
                            <div className="stat">Accuracy: 87%</div>
                          </div>
                          <div className="demo-footer">Keep it up!</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-description">
                At Worksheeter, we believe that every student deserves access to personalized, 
                efficient learning tools. Our mission is to democratize education by making 
                advanced AI technology accessible to learners worldwide, helping them achieve 
                their academic goals faster and more effectively.
              </p>
              <div className="mission-features">
                <div className="mission-feature">
                  <i className="fas fa-globe"></i>
                  <span>Global Accessibility</span>
                </div>
                <div className="mission-feature">
                  <i className="fas fa-users"></i>
                  <span>For Every Student</span>
                </div>
                <div className="mission-feature">
                  <i className="fas fa-rocket"></i>
                  <span>Future-Ready Learning</span>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="globe-container">
                <div className="globe">
                  <div className="globe-inner">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="orbit-ring ring-1"></div>
                  <div className="orbit-ring ring-2"></div>
                  <div className="orbit-ring ring-3"></div>
                  <div className="floating-icons">
                    <div className="floating-icon icon-1">📚</div>
                    <div className="floating-icon icon-2">🧠</div>
                    <div className="floating-icon icon-3">💡</div>
                    <div className="floating-icon icon-4">🎓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
          color: #1e293b;
        }

        .about-page.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 8rem 0;
          overflow: hidden;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #ddd6fe 100%);
          text-align: center;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .floating-shapes {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          width: 120px;
          height: 120px;
          top: 20%;
          left: 10%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          animation-delay: 0s;
        }

        .shape-2 {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 15%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          animation-delay: 7s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          bottom: 20%;
          left: 60%;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          animation-delay: 14s;
        }

        .shape-4 {
          width: 60px;
          height: 60px;
          top: 30%;
          right: 30%;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          25% { transform: translateY(-20px) translateX(10px) scale(1.1); }
          50% { transform: translateY(20px) translateX(-10px) scale(0.9); }
          75% { transform: translateY(-10px) translateX(15px) scale(1.05); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 900;
          color: #1e293b;
          line-height: 1.1;
          margin: 0;
        }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.3rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 900;
          color: #6366f1;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-label {
          font-size: 1rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.3rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Features Section */
        .features-section {
          padding: 8rem 0;
          background: white;
        }

        .features-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .features-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature-nav-item {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.4s ease;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .feature-nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .feature-nav-item:hover::before {
          left: 100%;
        }

        .feature-nav-item.active {
          border-color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15);
        }

        .feature-nav-item:hover {
          border-color: #8b5cf6;
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.1);
        }

        .feature-nav-icon {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          color: white;
          transition: all 0.3s ease;
        }

        .feature-nav-item.active .feature-nav-icon {
          transform: scale(1.1);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
        }

        .feature-nav-content h4 {
          color: #1e293b;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .feature-nav-content p {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        .features-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .phone-mockup {
          width: 350px;
          height: 700px;
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: 50px;
          padding: 25px;
          box-shadow: 0 25px 100px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 35px;
          overflow: hidden;
        }

        .app-interface {
          padding: 2.5rem 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .app-title {
          color: #1e293b;
          font-weight: 800;
          font-size: 1.4rem;
        }

        .app-status {
          font-size: 1.8rem;
          color: #10b981;
        }

        .app-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .demo-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          color: #1e293b;
          width: 100%;
        }

        .demo-title,
        .demo-question {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .keyword-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .keyword-item {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .demo-answer {
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          padding: 1.25rem;
          border-radius: 16px;
          font-size: 0.9rem;
          width: 100%;
          line-height: 1.5;
        }

        .progress-ring {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.5rem;
        }

        .progress-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .stat {
          background: #f1f5f9;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .demo-footer {
          font-size: 0.9rem;
          color: #6366f1;
          font-weight: 600;
        }

        /* Mission Section */
        .mission-section {
          padding: 8rem 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }

        .mission-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .mission-title {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 2rem;
        }

        .mission-description {
          font-size: 1.3rem;
          line-height: 1.7;
          opacity: 0.95;
          margin-bottom: 3rem;
        }

        .mission-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mission-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .mission-feature i {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .mission-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .globe-container {
          position: relative;
          width: 450px;
          height: 450px;
        }

        .globe {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .globe-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 140px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }

        .ring-1 {
          width: 220px;
          height: 220px;
          transform: translate(-50%, -50%);
          animation-duration: 15s;
        }

        .ring-2 {
          width: 320px;
          height: 320px;
          transform: translate(-50%, -50%);
          animation-duration: 25s;
          animation-direction: reverse;
        }

        .ring-3 {
          width: 420px;
          height: 420px;
          transform: translate(-50%, -50%);
          animation-duration: 30s;
        }

        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .floating-icons {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .floating-icon {
          position: absolute;
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: floatIcon 8s ease-in-out infinite;
        }

        .icon-1 {
          top: 10%;
          left: 20%;
          animation-delay: 0s;
        }

        .icon-2 {
          top: 20%;
          right: 15%;
          animation-delay: 2s;
        }

        .icon-3 {
          bottom: 25%;
          left: 10%;
          animation-delay: 4s;
        }

        .icon-4 {
          bottom: 15%;
          right: 20%;
          animation-delay: 6s;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .features-showcase,
          .mission-content {
            grid-template-columns: 1fr;
            gap: 4rem;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .section-title,
          .mission-title {
            font-size: 3rem;
          }

          .hero-stats {
            gap: 2.5rem;
          }

          .features-visual {
            order: -1;
          }

          .phone-mockup {
            width: 300px;
            height: 600px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .hero-section,
          .features-section,
          .mission-section {
            padding: 6rem 0;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .section-title,
          .mission-title {
            font-size: 2.25rem;
          }

          .hero-description {
            font-size: 1.1rem;
          }

          .section-subtitle {
            font-size: 1.1rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 2rem;
          }

          .phone-mockup {
            width: 250px;
            height: 500px;
          }

          .globe-container {
            width: 350px;
            height: 350px;
          }

          .globe-inner {
            width: 100px;
            height: 100px;
            font-size: 2.5rem;
          }

          .ring-1 {
            width: 160px;
            height: 160px;
          }

          .ring-2 {
            width: 240px;
            height: 240px;
          }

          .ring-3 {
            width: 320px;
            height: 320px;
          }

          .floating-icon {
            width: 45px;
            height: 45px;
            font-size: 1.4rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section,
          .features-section,
          .mission-section {
            padding: 4rem 0;
          }

          .hero-title {
            font-size: 2rem;
          }

          .section-title,
          .mission-title {
            font-size: 1.75rem;
          }

          .hero-description,
          .mission-description {
            font-size: 1rem;
          }

          .feature-nav-item {
            padding: 1.5rem;
            flex-direction: column;
            text-align: center;
          }

          .phone-mockup {
            width: 200px;
            height: 400px;
            padding: 15px;
          }

          .app-interface {
            padding: 1.5rem 1rem;
          }

          .globe-container {
            width: 280px;
            height: 280px;
          }

          .globe-inner {
            width: 80px;
            height: 80px;
            font-size: 2rem;
          }

          .floating-icon {
            width: 35px;
            height: 35px;
            font-size: 1.2rem;
          }

          .stat-number {
            font-size: 2.5rem;
          }

          .stat-label {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;