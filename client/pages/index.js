import Link from 'next/link';
import { useState, useEffect } from 'react';

const LandingPage = ({ currentUser }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "fas fa-robot",
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your worksheets and extract the most important concepts automatically.",
      stat: "95% accuracy",
      color: "#6366f1"
    },
    {
      icon: "fas fa-key",
      title: "Smart Keyword Detection",
      description: "Instantly identify and learn key terms from any subject with intelligent keyword recognition and definition lookup.",
      stat: "10x faster",
      color: "#8b5cf6"
    },
    {
      icon: "fas fa-comments",
      title: "Instant Q&A",
      description: "Ask any question about your study material and get immediate, contextual answers powered by advanced AI.",
      stat: "24/7 available",
      color: "#06b6d4"
    },
    {
      icon: "fas fa-chart-line",
      title: "Progress Insights",
      description: "Track your learning progress with detailed analytics and personalized recommendations for improvement.",
      stat: "Deep insights",
      color: "#10b981"
    },
    {
      icon: "fas fa-clock",
      title: "Time Optimization",
      description: "Reduce study time by up to 60% with intelligent content prioritization and adaptive learning paths.",
      stat: "60% time saved",
      color: "#f59e0b"
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Cross-Platform",
      description: "Study anywhere, anytime with seamless synchronization across all your devices and platforms.",
      stat: "Any device",
      color: "#ef4444"
    }
  ];

  return (
    <>
      <div className={`landing-page ${isVisible ? 'visible' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="floating-shapes">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`shape shape-${i + 1}`}></div>
              ))}
            </div>
            <div className="gradient-overlay"></div>
          </div>

          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title animate-slide-up">
                  Transform Your Study Process with
                  <br />
                  <span className="gradient-text">Smart AI Tools</span>
                </h1>
                
                <p className="hero-description animate-slide-up">
                  Upload worksheets, extract keywords automatically, get instant answers, 
                  and master your subjects with intelligent study assistance. 
                  Experience the future of personalized learning powered by advanced AI.
                </p>
                
                <div className="hero-actions animate-bounce-in">
                  {currentUser ? (
                    <div className="user-actions">
                      <Link href="/worksheets/new" className="btn btn-primary btn-xl">
                        <i className="fas fa-plus"></i>
                        <span>Create Worksheet</span>
                      </Link>
                      <Link href="/worksheets" className="btn btn-outline-primary btn-xl">
                        <i className="fas fa-file-alt"></i>
                        <span>My Worksheets</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="guest-actions">
                      <Link href="/auth/signup" className="btn btn-primary btn-xl">
                        <i className="fas fa-rocket"></i>
                        <span>Start Learning Free</span>
                      </Link>
                      <Link href="/auth/signin" className="btn btn-outline-primary btn-xl">
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Sign In</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="hero-visual animate-slide-up">
                <div className="simple-demo">
                  <div className="demo-card">
                    <div className="demo-icon">
                      <i className="fas fa-brain"></i>
                    </div>
                    <h3>AI-Powered Learning</h3>
                    <p>Upload your worksheets and let AI extract key concepts automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Powerful Features That Make Learning Effortless</h2>
              <p className="section-subtitle">
                Advanced AI technology combined with intuitive design to revolutionize how you study
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card" style={{ '--feature-color': feature.color }}>
                  <div className="feature-header">
                    <div className="feature-icon">
                      <i className={feature.icon}></i>
                    </div>
                    <div className="feature-stat">
                      {feature.stat}
                    </div>
                  </div>
                  <div className="feature-body">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                  <div className="feature-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How Worksheeter Works</h2>
              <p className="section-subtitle">
                Get started in minutes with our intuitive, AI-powered platform
              </p>
            </div>

            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">01</div>
                <div className="step-icon">
                  <i className="fas fa-upload"></i>
                </div>
                <div className="step-content">
                  <h3>Upload Your Content</h3>
                  <p>Simply upload any PDF, image, or text document containing your study material</p>
                </div>
              </div>

              <div className="step-connector"></div>

              <div className="step-card">
                <div className="step-number">02</div>
                <div className="step-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <div className="step-content">
                  <h3>AI Analysis</h3>
                  <p>Our advanced AI analyzes the content and extracts key terms, concepts, and relationships</p>
                </div>
              </div>

              <div className="step-connector"></div>

              <div className="step-card">
                <div className="step-number">03</div>
                <div className="step-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="step-content">
                  <h3>Learn & Master</h3>
                  <p>Study keywords, ask questions, and track your progress with personalized insights</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;