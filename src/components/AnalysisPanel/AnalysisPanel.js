import React, { useState } from 'react';
import SpinalParameters from './SpinalParameters';
import Measurements from './Measurements';
import AnalysisSummary from './AnalysisSummary';
import './AnalysisPanel.css';

const AnalysisPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const togglePanel = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <aside className={`analysis-panel ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <div className="header-content">
            <h2>Analysis Results</h2>
            <div className="status-indicator live">LIVE</div>
          </div>
          <button 
            className="collapse-btn"
            onClick={togglePanel}
            aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path 
                d={isCollapsed ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="panel-content">
            <SpinalParameters />
            <Measurements />
            <AnalysisSummary />
          </div>
        )}
      </aside>
      
      {isCollapsed && (
        <div className="collapsed-panel-toggle">
          <button 
            className="expand-btn"
            onClick={togglePanel}
            aria-label="Expand analysis panel"
            title="Expand Analysis Panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M15 18l-6-6 6-6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default AnalysisPanel;
