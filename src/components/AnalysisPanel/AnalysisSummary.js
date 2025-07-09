<<<<<<< HEAD
import React, { useState, useMemo } from 'react';

const AnalysisSummary = ({ toolResults = [] }) => {
  const [expanded, setExpanded] = useState(true);

  // Calculate summary data from tool results
  const summaryData = useMemo(() => {
    const totalMeasurements = toolResults.length;
    
    const spinalParameters = toolResults.filter(result => 
      ['PI', 'PT', 'SS', 'All', 'Cervical Lordosis', 'Thoracic Kyphosis', 'Lumbar Lordosis'].includes(result.tool)
    ).length;
    
    const lastResult = toolResults.length > 0 ? toolResults[toolResults.length - 1] : null;
    const lastUpdated = lastResult ? 
      new Date(lastResult.timestamp || Date.now()).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Never';

    // Calculate average processing time (simulated for now)
    const avgProcessingTime = totalMeasurements > 0 ? '1.2s' : '0s';
    
    // Determine status
    let status = 'No Analysis';
    if (totalMeasurements === 0) {
      status = 'Waiting for Input';
    } else if (spinalParameters >= 3) {
      status = 'Analysis Complete';
    } else if (totalMeasurements >= 1) {
      status = 'Partial Analysis';
    }

    return {
      totalMeasurements,
      parametersCalculated: spinalParameters,
      accuracy: totalMeasurements > 0 ? '95.8%' : 'N/A',
      lastUpdated: totalMeasurements > 0 ? `Today at ${lastUpdated.split(' ')[3]} ${lastUpdated.split(' ')[4]}` : 'Never',
      status,
      analysisTime: avgProcessingTime,
      imageQuality: 'Good' // This could be calculated based on image properties
    };
  }, [toolResults]);

=======
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

>>>>>>> 6780040092ba58fa4421663a4ecf5f61837205b0
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
        
<<<<<<< HEAD
        <div className={`status-badge ${summaryData.status.toLowerCase().replace(' ', '-')}`}>
          {summaryData.status === 'Analysis Complete' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {summaryData.status === 'Partial Analysis' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {summaryData.status === 'Waiting for Input' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
=======
        <div className="status-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
>>>>>>> 6780040092ba58fa4421663a4ecf5f61837205b0
          <span>{summaryData.status}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;
