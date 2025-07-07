// pages/coding/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import buildClient from '../../api/build-client';

const CodingLandingPage = ({ categories, allProblems }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredProblems = selectedCategory === 'all' 
    ? allProblems 
    : allProblems.filter(p => p.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`coding-dashboard ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-code me-3"></i>
              Coding Challenges
            </h1>
            <p className="page-subtitle">
              Practice your programming skills with real-world problems
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Category Filter */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: '2px solid',
                borderColor: selectedCategory === 'all' ? '#6366f1' : '#e5e7eb',
                backgroundColor: selectedCategory === 'all' ? '#6366f1' : 'white',
                color: selectedCategory === 'all' ? 'white' : '#374151',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Problems ({allProblems.length})
            </button>
            {Object.entries(categories).map(([key, label]) => {
              const count = allProblems.filter(p => p.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    border: '2px solid',
                    borderColor: selectedCategory === key ? '#6366f1' : '#e5e7eb',
                    backgroundColor: selectedCategory === key ? '#6366f1' : 'white',
                    color: selectedCategory === key ? 'white' : '#374151',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Problems Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: 24 
        }}>
          {filteredProblems.map(problem => (
            <Link key={problem.id} href={`/coding/problem/${problem.id}`}>
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 24,
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}>
                {/* Problem Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827' }}>
                    {problem.title}
                  </h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: getDifficultyColor(problem.difficulty) + '20',
                    color: getDifficultyColor(problem.difficulty),
                    textTransform: 'uppercase'
                  }}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Category Badge */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    backgroundColor: '#f3f4f6',
                    color: '#374151'
                  }}>
                    {categories[problem.category]}
                  </span>
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: 16, 
                  color: '#6b7280', 
                  lineHeight: 1.5,
                  margin: '0 0 16px 0'
                }}>
                  {problem.description}
                </p>

                {/* Example */}
                {problem.examples?.[0] && (
                  <div style={{ 
                    backgroundColor: '#f9fafb', 
                    padding: 12, 
                    borderRadius: 8,
                    marginBottom: 16
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      Example:
                    </div>
                    <div style={{ fontSize: 14, fontFamily: 'monospace' }}>
                      <span style={{ color: '#059669' }}>Input:</span> {problem.examples[0].input}<br/>
                      <span style={{ color: '#dc2626' }}>Output:</span> {problem.examples[0].output}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>
                    {problem.testCases.length} test cases
                  </div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#6366f1'
                  }}>
                    Solve →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .coding-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .coding-dashboard.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .creator-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 3rem 0 2rem;
          margin-bottom: 3rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .header-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 900;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .creator-header {
            padding: 2rem 0;
            margin-bottom: 2rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .creator-header {
            padding: 1.5rem 0;
          }

          .page-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

// Fetch data on server side
CodingLandingPage.getInitialProps = async (context, client) => {
  try {
    const [categoriesRes, problemsRes] = await Promise.all([
      client.get('/api/coding/categories'),
      client.get('/api/coding/problems/all') // You'll need this route
    ]);

    return {
      categories: categoriesRes.data,
      allProblems: problemsRes.data
    };
  } catch (error) {
    return { categories: {}, allProblems: [] };
  }
};

export default CodingLandingPage;