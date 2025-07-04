import React, { useState } from 'react';

const favoriteItems = [
  {
    name: 'Cobb Angle Analysis',
    description: 'Most used scoliosis measurement',
    frequency: 'Used 47 times',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    name: 'Distance Measurement',
    description: 'Quick linear measurements',
    frequency: 'Used 32 times',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 16v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="21 16 12 3 3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Pelvic Incidence',
    description: 'Sagittal balance parameter',
    frequency: 'Used 28 times',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    name: 'Angle Measurement',
    description: 'General angle calculations',
    frequency: 'Used 19 times',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 19c-5 0-9-4-9-9s4-9 9-9 9 4 9 9-4 9-9 9z" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 10l5 5" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 10h5v5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  }
];

const Favorites = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="sidebar-section">
      <div 
        className={`section-header ${!expanded ? 'collapsed' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="section-title">Favorites</span>
        <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className={`section-content ${!expanded ? 'collapsed' : ''}`}>
        <div className="favorites-list">
          {favoriteItems.map((item) => (
            <button key={item.name} className="favorite-item" title={item.description}>
              <div className="favorite-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="item-icon">{item.icon}</div>
              <div className="favorite-content">
                <span className="favorite-name">{item.name}</span>
                <span className="favorite-description">{item.description}</span>
                <span className="favorite-frequency">{item.frequency}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
