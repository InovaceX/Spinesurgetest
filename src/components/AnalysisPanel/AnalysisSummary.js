import React, { useState } from 'react';

const summaryData = {
  totalMeasurements: 12,
  parametersCalculated: 8,
  accuracy: '96.5%',
  lastUpdated: 'Today at 14:32',
  status: 'Analysis Complete',
  analysisTime: '2.3s',
  imageQuality: 'Excellent'
};

const AnalysisSummary = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="panel-section">
      <div 
        className={`section-header ${!expanded ? 'collapsed' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="section-title">Analysis Summary</span>
        <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className={`section-content ${!expanded ? 'collapsed' : ''}`}>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Measurements</span>
            <span className="summary-value">{summaryData.totalMeasurements}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Parameters Calculated</span>
            <span className="summary-value">{summaryData.parametersCalculated}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Accuracy</span>
            <span className="summary-value accuracy">{summaryData.accuracy}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Analysis Time</span>
            <span className="summary-value">{summaryData.analysisTime}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Image Quality</span>
            <span className="summary-value quality">{summaryData.imageQuality}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Last Updated</span>
            <span className="summary-value timestamp">{summaryData.lastUpdated}</span>
          </div>
        </div>
        
        <div className="status-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{summaryData.status}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;
