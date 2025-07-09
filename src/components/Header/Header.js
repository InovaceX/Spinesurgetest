import React, { useState } from 'react';
import Navigation from './Navigation';
import ThemeToggle from './ThemeToggle';
import ActionButtons from './ActionButtons';
import ActionPopups from './ActionPopups';
import './Header.css';

<<<<<<< HEAD
const Header = ({ darkMode, setDarkMode, onToolSelect, selectedTool }) => {
=======
const Header = ({ darkMode, setDarkMode }) => {
>>>>>>> 6780040092ba58fa4421663a4ecf5f61837205b0
  const [activePopup, setActivePopup] = useState(null);

  return (
    <header className="header">
      <div className="header-content">
        {/* Left section - Logo and Navigation */}
        <div className="header-left">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-9-5z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
<<<<<<< HEAD
          <Navigation onToolSelect={onToolSelect} selectedTool={selectedTool} />
=======
          <Navigation />
>>>>>>> 6780040092ba58fa4421663a4ecf5f61837205b0
        </div>
        
        {/* Right section - Action buttons */}
        <div className="header-right">
          <ActionButtons activePopup={activePopup} setActivePopup={setActivePopup} />
          <div className="actions-divider"></div>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="actions-divider"></div>
          <button className="logout-btn" title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <ActionPopups activePopup={activePopup} setActivePopup={setActivePopup} />
    </header>
  );
};

export default Header;
