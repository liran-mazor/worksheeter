import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default ({ currentUser }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  if (!currentUser) {
    return null;
  }

  const navigationItems = [
    { 
      label: 'Dashboard', 
      href: '/', 
      icon: 'fas fa-home',
      tooltip: 'Home'
    },
    { 
      label: 'Chat with Thomas', 
      href: '/thomas', 
      icon: 'fas fa-comment',
      tooltip: 'Chat Thomas'
    },
    { 
      label: 'My Worksheets', 
      href: '/worksheets', 
      icon: 'fas fa-file-alt',
      tooltip: 'Worksheets'
    },
    { 
      label: 'Create Worksheet', 
      href: '/worksheets/new', 
      icon: 'fas fa-plus-circle',
      tooltip: 'New worksheet'
    },
    { 
      label: 'Quizzes', 
      href: '/quizzes', 
      icon: 'fas fa-brain',
      tooltip: 'Quizzes'
    },
    { 
      label: 'Coding Practice', 
      href: '/coding', 
      icon: 'fas fa-code',
      tooltip: 'Coding'
    },
  ];

  const isActiveRoute = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    // Exact match for /worksheets to avoid conflict with /worksheets/new
    if (href === '/worksheets') {
      return router.pathname === '/worksheets';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Logo & Brand */}
        <div className="sidebar-header">
          <div 
            className="sidebar-logo"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="logo-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <span className="brand-name">Worksheeter</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {navigationItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`nav-item ${isActiveRoute(item.href) ? 'active' : ''}`}
                title={isCollapsed ? item.tooltip : ''}
              >
                <div className="nav-icon" data-tooltip={item.tooltip}>
                  {item.icon.startsWith('fas') ? (
                    <i className={item.icon}></i>
                  ) : (
                    <span className="emoji-icon">{item.icon}</span>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <Link 
            href="/auth/signout" 
            className="signout-btn"
            title="Sign out"
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span>Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className={`content-spacer ${isCollapsed ? 'collapsed' : ''}`} />

      <style jsx global>{`
        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 280px;
          background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        }

        .sidebar.collapsed {
          width: 72px;
        }

        /* Sidebar Header */
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .sidebar-logo:hover {
          text-decoration: none;
          color: inherit;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.4rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          position: relative;
          overflow: hidden;
        }

        .logo-icon i {
          transition: all 0.3s ease;
          z-index: 2;
          position: relative;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 6px;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .sidebar-logo:hover .logo-icon {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
        }

        .sidebar-logo:hover .logo-icon i {
          opacity: 0;
          transform: scale(0.8);
        }

        .sidebar-logo:hover .logo-icon::before {
          transform: translate(-50%, -50%) scale(1);
        }

        .sidebar-logo:hover .logo-icon::after {
          content: '→';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #6366f1;
          font-size: 1.1rem;
          font-weight: bold;
          z-index: 3;
          opacity: 1;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        /* Brand name styling - with maximum specificity to override global CSS */
        .sidebar .sidebar-header .sidebar-logo .logo-text .brand-name,
        .sidebar .logo-text .brand-name,
        .sidebar .brand-name {
          font-size: 1.3rem !important;
          font-weight: 800 !important;
          color: #1f2937 !important;
          text-decoration: none !important;
          background: none !important;
          -webkit-background-clip: unset !important;
          -webkit-text-fill-color: unset !important;
          background-clip: unset !important;
          text-shadow: none !important;
          filter: none !important;
          animation: none !important;
          letter-spacing: normal !important;
          margin-bottom: 0 !important;
        }

        .brand-tagline {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 12px;
          text-decoration: none;
          color: #64748b;
          transition: all 0.2s ease;
          position: relative;
          border: 1px solid transparent;
        }

        .nav-item:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.03));
          border-color: rgba(99, 102, 241, 0.1);
          color: #374151;
          text-decoration: none;
          transform: translateX(2px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .nav-item.active:hover {
          background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
          transform: translateX(2px);
        }

        /* Dashboard (homepage) should have no background when active */
        .nav-item[href="/"].active {
          background: transparent;
          color: #64748b;
          box-shadow: none;
        }

        .nav-item[href="/"].active:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.03));
          border-color: rgba(99, 102, 241, 0.1);
          color: #374151;
          transform: translateX(2px);
          box-shadow: none;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          position: relative;
        }

        /* Tooltip for collapsed sidebar - Fixed positioning */
        .sidebar.collapsed .nav-icon::after {
          content: attr(data-tooltip);
          position: fixed;
          left: 90px;
          top: 50%;
          transform: translateY(-50%);
          background: #1f2937;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
          z-index: 2000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .sidebar.collapsed .nav-icon::before {
          content: '';
          position: fixed;
          left: 82px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6px 8px 6px 0;
          border-color: transparent #1f2937 transparent transparent;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
          z-index: 2000;
        }

        .sidebar.collapsed .nav-item:hover .nav-icon::after {
          opacity: 1;
        }

        .sidebar.collapsed .nav-item:hover .nav-icon::before {
          opacity: 1;
        }

        .emoji-icon {
          font-size: 1.3rem;
        }

        .nav-content {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
          min-width: 0;
        }

        .nav-label {
          font-size: 1rem;
          font-weight: 600;
        }

        .nav-description {
          font-size: 0.85rem;
          opacity: 0.7;
          font-weight: 400;
        }

        .nav-item.active .nav-description {
          opacity: 0.9;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .user-profile:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
          min-width: 0;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          truncate: true;
        }

        .user-email {
          font-size: 0.75rem;
          color: #6b7280;
          truncate: true;
        }

        .signout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 12px;
          text-decoration: none;
          color: #6b7280;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid transparent;
        }

        .signout-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
          text-decoration: none;
        }

        /* Content Spacer */
        .content-spacer {
          width: 280px;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-spacer.collapsed {
          width: 72px;
        }

        /* Collapsed state adjustments */
        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 0.75rem 0.5rem;
        }

        .sidebar.collapsed .user-profile {
          justify-content: center;
          padding: 0.75rem 0.5rem;
        }

        .sidebar.collapsed .signout-btn {
          justify-content: center;
          padding: 0.75rem 0.5rem;
        }

        /* Smooth scrolling */
        .sidebar-nav {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};