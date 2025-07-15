import { useState, useEffect } from 'react';
import Link from 'next/link';

const CodingLandingPage = ({ categories, allProblems }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredProblems = allProblems.filter(problem => {
    const categoryMatch = selectedCategory === 'all' || problem.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const searchMatch = searchTerm === '' || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && difficultyMatch && searchMatch;
  });

  const difficultyLevels = {
    'easy': 'Easy',
    'medium': 'Medium', 
    'hard': 'Hard'
  };

  const getDifficultyColor = (difficulty) => {
    const lowerDifficulty = difficulty?.toLowerCase();
    console.log('Difficulty:', difficulty, 'Lower:', lowerDifficulty);
    switch(lowerDifficulty) {
      case 'easy': return '#15803d';
      case 'medium': return '#a16207';
      case 'hard': return '#b91c1c';
      default: 
        console.log('Unknown difficulty:', difficulty);
        return '#4b5563';
    }
  };

  return (
    <div className={`coding-dashboard ${isVisible ? 'visible' : ''}`}>
      {/* Header Section */}
      <div className="creator-header">
        <div className="container">
          <div className="header-content">
            <h1 className="elegant-silver-title-v2">
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
        {/* Modern Filter System */}
        <div className="modern-filter-system">
          {/* Filter Stats Header */}
          <div className="filter-stats-header">
            <div className="stats-content">
                Showing {filteredProblems.length} of {allProblems.length} problems
            </div>
            <div className="active-filters">
              {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchTerm !== '') && (
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSearchTerm('');
                  }}
                  className="clear-all-filters"
                >
                  <i className="fas fa-times-circle"></i>
                  Clear All
                </button>
              )}
              {searchTerm !== '' && (
                <span className="active-filter-tag">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="active-filter-tag">
                  {categories[selectedCategory]}
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedDifficulty !== 'all' && (
                <span className="active-filter-tag">
                  {difficultyLevels[selectedDifficulty]}
                  <button 
                    onClick={() => setSelectedDifficulty('all')}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Search Filter */}
          <div className="filter-group">
            <div className="filter-group-header">
              <h3 className="filter-group-title">
                <i className="fas fa-search"></i>
                Search Problems
              </h3>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by problem title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="search-clear-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="filter-group">
            <div className="filter-group-header">
              <h3 className="filter-group-title">
                <i className="fas fa-tag"></i>
                Categories
              </h3>
            </div>
            <div className="filter-options">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`modern-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                All Categories
                <span className="count-badge">
                  {allProblems.filter(p => {
                    const difficultyMatch = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
                    const searchMatch = searchTerm === '' || 
                      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchTerm.toLowerCase());
                    return difficultyMatch && searchMatch;
                  }).length}
                </span>
              </button>
              {Object.entries(categories).map(([key, label]) => {
                const count = allProblems.filter(p => {
                  const categoryMatch = p.category === key;
                  const difficultyMatch = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
                  const searchMatch = searchTerm === '' || 
                    p.title.toLowerCase().includes(searchTerm.toLowerCase());
                  return categoryMatch && difficultyMatch && searchMatch;
                }).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`modern-filter-btn ${selectedCategory === key ? 'active' : ''}`}
                  >
                    {label}
                    <span className="count-badge">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="filter-group">
            <div className="filter-group-header">
              <h3 className="filter-group-title">
                <i className="fas fa-layer-group"></i>
                Difficulty Level
              </h3>
            </div>
            <div className="filter-options">
              <button
                onClick={() => setSelectedDifficulty('all')}
                className={`modern-filter-btn ${selectedDifficulty === 'all' ? 'active' : ''}`}
              >
                All Levels
                <span className="count-badge">
                  {allProblems.filter(p => {
                    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
                    const searchMatch = searchTerm === '' || 
                      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchTerm.toLowerCase());
                    return categoryMatch && searchMatch;
                  }).length}
                </span>
              </button>
              {Object.entries(difficultyLevels).map(([key, label]) => {
                const count = allProblems.filter(p => {
                  const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
                  const difficultyMatch = p.difficulty === key;
                  const searchMatch = searchTerm === '' || 
                    p.title.toLowerCase().includes(searchTerm.toLowerCase());
                  return categoryMatch && difficultyMatch && searchMatch;
                }).length;
                const isActive = selectedDifficulty === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`modern-filter-btn difficulty-${key} ${isActive ? 'active' : ''}`}
                    style={{ '--difficulty-color': getDifficultyColor(key) }}
                  >
                    <div className="difficulty-indicator" style={{ backgroundColor: getDifficultyColor(key) }}></div>
                    {label}
                    <span className="count-badge">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="problems-grid">
          {filteredProblems.map(problem => (
            <Link key={problem.id} href={`/coding/problem/${problem.id}`}>
              <div className="problem-card">
                {/* Accent line */}
                <div 
                  className="accent-line"
                  style={{ 
                    background: getDifficultyColor(problem.difficulty),
                    '--difficulty-color': getDifficultyColor(problem.difficulty)
                  }}
                />
                
                {/* Card Header */}
                <div className="card-header">
                  <h3 className="problem-title">{problem.title}</h3>
                  
                  {/* Category and Difficulty Row */}
                  <div className="badges-container">
                    <span className="category-badge">
                      {categories[problem.category]}
                    </span>
                    <span 
                      className="difficulty-badge"
                      style={{
                        '--difficulty-bg-color': getDifficultyColor(problem.difficulty) + '20',
                        '--difficulty-text-color': getDifficultyColor(problem.difficulty)
                      }}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div 
                  className="coding-card-content-custom"
                                      style={{
                      '--card-bg': 'linear-gradient(135deg, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.5))',
                      background: 'var(--card-bg) !important',
                      backgroundColor: 'rgba(51, 65, 85, 0.6) !important'
                    }}
                >
                  <p className="problem-description">
                    {problem.description}
                  </p>

                  {/* Example */}
                  {problem.examples?.[0] && (
                    <div 
                      className="coding-example-section-custom"
                      style={{
                        background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.6), rgba(71, 85, 105, 0.4)) !important',
                        backgroundColor: 'rgba(51, 65, 85, 0.5) !important',
                        border: '2px solid rgba(71, 85, 105, 0.3)',
                        borderRadius: '16px',
                        padding: '1rem',
                        marginTop: 'auto'
                      }}
                    >
                      <div className="example-label">Example:</div>
                      <div className="example-code">
                        <span className="example-input">Input:</span> {problem.examples[0].input}<br/>
                        <span className="example-output">Output:</span> {problem.examples[0].output}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <span className="test-case-count">
                    <i className="fas fa-vial"></i>
                    {problem.testCases.length} test cases
                  </span>
                  <span className="solve-arrow">
                    Solve <i className="fas fa-arrow-right"></i>
                  </span>
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
          max-width: 800px;
          margin: 0 auto;
        }

        .elegant-silver-title-v2 {
          font-family: 'Playfair Display', serif !important;
          font-size: 3rem !important;
          font-weight: 900 !important;
          color: #c0c4cc !important;
          text-shadow: 0 6px 24px rgba(0, 0, 0, 0.5), 0 3px 12px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2) !important;
          margin-bottom: 1rem !important;
          line-height: 1.2 !important;
          background: none !important;
          background-image: none !important;
          background-clip: unset !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
          text-fill-color: unset !important;
        }

        h1.elegant-silver-title-v2,
        .coding-dashboard h1.elegant-silver-title-v2 {
          color: #c0c4cc !important;
          background: none !important;
          -webkit-text-fill-color: unset !important;
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          margin: 0;
        }

        /* Modern Filter System */
        .modern-filter-system {
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9));
          border-radius: 20px;
          padding: 0.75rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Filter Stats Header */
        .filter-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-content {
          flex: 1;
          margin-left: 0.5rem;
        }

        .filter-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.125rem;
          background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
        }

        .filter-subtitle {
          font-size: 0.9rem;
          color: #94a3b8;
          margin: 0;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
        }

        .active-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .active-filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
        }

        .remove-filter {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          font-size: 1.25rem;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .remove-filter:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .clear-all-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.8));
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
        }

        .clear-all-filters:hover {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(185, 28, 28, 0.8));
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        /* Filter Groups */
        .filter-group {
          margin-bottom: 0.75rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-group-header {
          margin-bottom: 0.5rem;
        }

        .filter-group-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          transform: translateZ(0);
        }

        .filter-group-title i {
          color: #8b5cf6;
          font-size: 1.2rem;
          transform: translateZ(0);
        }

        /* Search Container */
        .search-container {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 1rem;
          padding-right: 3rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(71, 85, 105, 0.5), rgba(51, 65, 85, 0.3));
          color: #e2e8f0;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .search-input::placeholder {
          color: #94a3b8;
          opacity: 1;
        }

        .search-input:focus {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(99, 102, 241, 0.1));
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          color: #f1f5f9;
        }

        .search-clear-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-clear-btn:hover {
          color: #f1f5f9;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Filter Options */
        .filter-options {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .modern-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(71, 85, 105, 0.5), rgba(51, 65, 85, 0.3));
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .modern-filter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .modern-filter-btn:hover::before {
          left: 100%;
        }

        .modern-filter-btn:hover {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.1));
          transform: translate3d(0, -2px, 0);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
          color: #e2e8f0;
        }

        .modern-filter-btn.active {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          color: white;
          transform: translate3d(0, -2px, 0);
          box-shadow: 0 12px 30px rgba(139, 92, 246, 0.3);
        }

        .modern-filter-btn.active:hover {
          background: linear-gradient(135deg, #7c3aed, #5855eb);
          box-shadow: 0 16px 35px rgba(139, 92, 246, 0.4);
        }

        .count-badge {
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
          padding: 0.25rem 0.625rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }

        .modern-filter-btn.active .count-badge {
          background: rgba(255, 255, 255, 0.25);
        }

        .difficulty-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
          display: block;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        /* Force difficulty indicator colors */
        .modern-filter-btn .difficulty-indicator {
          background-color: var(--difficulty-color) !important;
        }

        /* Specific difficulty colors */
        .difficulty-easy .difficulty-indicator {
          background-color: #16a34a !important;
        }

        .difficulty-medium .difficulty-indicator {
          background-color: #ca8a04 !important;
        }

        .difficulty-hard .difficulty-indicator {
          background-color: #dc2626 !important;
        }



        /* Dark Mode Support */
        :global([data-theme="dark"]) .modern-filter-system {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
          border-color: rgba(139, 92, 246, 0.3);
        }

        :global([data-theme="dark"]) .filter-stats-header {
          border-bottom-color: rgba(71, 85, 105, 0.3);
        }

        :global([data-theme="dark"]) .modern-filter-btn {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.5));
          border-color: rgba(71, 85, 105, 0.3);
        }

        :global([data-theme="dark"]) .modern-filter-btn:hover {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.15));
        }

        :global([data-theme="dark"]) .filter-title {
          color: #f8fafc;
        }

        :global([data-theme="dark"]) .filter-subtitle {
          color: #64748b;
        }

        :global([data-theme="dark"]) .search-input {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.5));
          border-color: rgba(71, 85, 105, 0.3);
        }

        :global([data-theme="dark"]) .search-input:focus {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.15));
        }

        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .problem-card {
          background: linear-gradient(135deg, #fafbff 0%, #f8fafc 50%, #f1f5f9 100%);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.8);
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 360px;
        }

        .problem-card:hover {
          transform: translate3d(0, -8px, 0);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 20px 25px -5px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
          background: linear-gradient(135deg, #ffffff 0%, #fafbff 50%, #f8fafc 100%);
        }



        .problem-card:hover .accent-line {
          height: 6px !important;
          opacity: 1 !important;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3) !important;
          transform: scaleY(1.3) !important;
          background-color: var(--difficulty-color) !important;
        }

        .accent-line {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 4px !important;
          opacity: 0 !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          z-index: 1 !important;
          border-radius: 0 0 4px 4px !important;
          background-color: transparent !important;
        }

        .card-header {
          padding: 1.5rem 1.25rem 1.25rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          flex-direction: column;
          text-align: center;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .badges-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 1rem;
        }

        .problem-title {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 1rem;
          color: #1e293b;
          line-height: 1.3;
          text-align: center;
          width: 100%;
        }

        .difficulty-badge {
          padding: 0.5rem 1.25rem !important;
          border-radius: 9999px !important;
          font-size: 0.8rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          white-space: nowrap !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
        }

        /* Force difficulty badge colors with !important */
        .problem-card .difficulty-badge {
          background-color: var(--difficulty-bg-color) !important;
          color: var(--difficulty-text-color) !important;
        }



        .category-badge {
          display: inline-block !important;
          padding: 0.5rem 1rem !important;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)) !important;
          color:rgb(186, 189, 194) !important;
          border: 2px solid rgba(99, 102, 241, 0.2) !important;
          border-radius: 12px !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .coding-card-content-custom {
          padding: 1.25rem !important;
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 0.75rem !important;
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.5)) !important;
        }

        /* Override any potential white background conflicts */
        .coding-card-content-custom,
        .coding-card-content-custom * {
          background-color: transparent !important;
        }

        .coding-card-content-custom {
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8)) !important;
        }

        /* Aggressive override for any white backgrounds */
        .problem-card .coding-card-content-custom {
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.5)) !important;
        }

        /* Target any divs within card content that might have white backgrounds */
        .problem-card .coding-card-content-custom div,
        .problem-card .coding-card-content-custom p {
          background: transparent !important;
        }

        /* Ensure no global white background overrides */
        .coding-dashboard .problem-card .coding-card-content-custom {
          background: var(--card-bg, linear-gradient(135deg, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.5))) !important;
          background-color: rgba(51, 65, 85, 0.6) !important;
        }

        /* Main card content styling */
        .coding-card-content-custom {
          background: var(--card-bg, linear-gradient(135deg, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.5))) !important;
        }

        /* Even more specific selector */
        .coding-dashboard .problems-grid .problem-card .coding-card-content-custom {
          background: var(--card-bg, linear-gradient(135deg, rgba(51, 65, 85, 0.7), rgba(71, 85, 105, 0.5))) !important;
          background-color: rgba(51, 65, 85, 0.6) !important;
        }

        .problem-description {
          font-size: 1.15rem;
          line-height: 1.5;
          color: #e2e8f0;
          margin: 0;
          flex: 1;
        }

        .example-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
        }

        .example-code {
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Menlo', monospace;
          font-size: 1.2rem;
          line-height: 1.5;
          color: #e2e8f0;
        }

        .example-input {
          color: #059669;
          font-weight: 600;
        }

        .example-output {
          color: #dc2626;
          font-weight: 600;
        }

        .card-footer {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
          border-top: 2px solid rgba(226, 232, 240, 0.5);
          margin-top: auto;
        }

        .test-case-count {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .test-case-count i {
          color: #94a3b8;
        }

        .solve-arrow {
          font-size: 1rem;
          font-weight: 600;
          color: #6366f1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .problem-card:hover .solve-arrow {
          color: #4f46e5;
          transform: translateX(4px);
        }

        /* Dark Mode Support */
        :global([data-theme="dark"]) .problem-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #0a0f1a 100%);
          border-color: rgba(99, 102, 241, 0.3);
        }

        :global([data-theme="dark"]) .problem-card:hover {
          background: linear-gradient(135deg, #334155 0%, #1e293b 50%, #0f172a 100%);
          border-color: rgba(99, 102, 241, 0.5);
        }

        :global([data-theme="dark"]) .card-header {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8));
          border-bottom-color: rgba(71, 85, 105, 0.5);
        }

        :global([data-theme="dark"]) .problem-title {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .problem-description {
          color: #cbd5e1;
        }

        :global([data-theme="dark"]) .category-badge {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2)) !important;
          color: #cbd5e1 !important;
          border-color: rgba(99, 102, 241, 0.4) !important;
        }

        :global([data-theme="dark"]) .coding-card-content-custom {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8)) !important;
        }

        :global([data-theme="dark"]) .coding-example-section-custom {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.7)) !important;
          border-color: rgba(71, 85, 105, 0.4) !important;
        }

        :global([data-theme="dark"]) .example-label {
          color: #e2e8f0;
        }

        :global([data-theme="dark"]) .example-code {
          color: #f1f5f9;
        }

        :global([data-theme="dark"]) .card-footer {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.8));
          border-top-color: rgba(71, 85, 105, 0.5);
        }

        :global([data-theme="dark"]) .test-case-count {
          color: #94a3b8;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .problems-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
          }

          .problem-card {
            min-height: 380px;
          }
        }

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

          .problems-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .problem-card {
            min-height: 360px;
          }

          .card-header {
            padding: 1.75rem 1.25rem 1.25rem;
          }

          .badges-container {
            flex-direction: row;
            justify-content: space-between;
          }

          .active-filters {
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
          }

          .coding-card-content-custom {
            padding: 1.25rem !important;
          }

          .card-footer {
            padding: 1.25rem;
          }

          .problem-title {
            font-size: 1.25rem;
          }

          .modern-filter-system {
            padding: 2rem;
            margin-bottom: 2rem;
          }

          .filter-stats-header {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
          }

          .filter-options {
            gap: 0.75rem;
          }

          .modern-filter-btn {
            padding: 0.875rem 1.25rem;
            font-size: 0.9rem;
          }

          .filter-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .creator-header {
            padding: 1.5rem 0;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .problem-card {
            min-height: 340px;
          }

          .card-header {
            padding: 1.5rem 1rem 1rem;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .badges-container {
            flex-direction: column;
            gap: 0.75rem;
            align-items: center;
          }

          .coding-card-content-custom {
            padding: 1rem !important;
          }

          .card-footer {
            padding: 1rem;
            flex-direction: column;
            gap: 0.75rem;
            align-items: center;
            text-align: center;
          }

          .problem-title {
            font-size: 1.25rem;
          }



          .modern-filter-system {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .filter-stats-header {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
          }

          .filter-group {
            margin-bottom: 2rem;
          }

          .filter-options {
            gap: 0.5rem;
          }

          .modern-filter-btn {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            flex: 1;
            min-width: 0;
            justify-content: space-between;
          }

          .filter-title {
            font-size: 1.5rem;
          }

          .filter-group-title {
            font-size: 1.125rem;
          }

          .active-filters {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

CodingLandingPage.getInitialProps = async (context, client, currentUser) => {
  try {
    if (!currentUser) {
      if (context.res) {
        context.res.writeHead(302, { Location: '/auth/signup' });
        context.res.end();
      }
      return {};
    }
    const [categoriesRes, problemsRes] = await Promise.all([
      client.get('/api/coding/categories'),
      client.get('/api/coding/problems/all') 
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