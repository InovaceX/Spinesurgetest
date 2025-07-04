import React, { useState } from 'react';

const quickAccessItems = [
  {
    name: 'Measure',
    description: 'Distance and angle measurements',
    shortcut: 'M',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 16v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="21 16 12 3 3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Zoom In',
    description: 'Zoom into the image',
    shortcut: 'Ctrl + +',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
        <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2"/>
        <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    name: 'Zoom Out',
    description: 'Zoom out of the image',
    shortcut: 'Ctrl + -',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
        <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    name: 'Pan',
    description: 'Pan around the image',
    shortcut: 'Space',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 1v6l-1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 15v6l-1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 9h6l-1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 23h6l-1-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const QuickAccess = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="sidebar-section">
      <div 
        className={`section-header ${!expanded ? 'collapsed' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="section-title">Quick Access</span>
        <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className={`section-content ${!expanded ? 'collapsed' : ''}`}>
        <div className="quick-access-grid">
          {quickAccessItems.map((item) => (
            <button key={item.name} className="quick-access-item" title={item.description}>
              <div className="item-icon">{item.icon}</div>
              <div className="item-content">
                <span className="item-name">{item.name}</span>
                <span className="item-shortcut">{item.shortcut}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;
