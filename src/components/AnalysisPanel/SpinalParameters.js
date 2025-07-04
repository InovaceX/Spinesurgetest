import React, { useState } from 'react';

const spinalParametersData = [
  {
    label: 'Pelvic Incidence',
    value: '52°',
    normalRange: '45-75°',
    status: 'normal',
    trend: 'stable'
  },
  {
    label: 'Pelvic Tilt',
    value: '18°',
    normalRange: '10-25°',
    status: 'improved',
    trend: 'improving'
  },
  {
    label: 'Sacral Slope',
    value: '34°',
    normalRange: '30-50°',
    status: 'normal',
    trend: 'stable'
  },
  {
    label: 'Lumbar Lordosis',
    value: '48°',
    normalRange: '40-60°',
    status: 'normal',
    trend: 'stable'
  }
];

const SpinalParameters = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="panel-section">
      <div 
        className={`section-header ${!expanded ? 'collapsed' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="section-title">Spinal Parameters</span>
        <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className={`section-content ${!expanded ? 'collapsed' : ''}`}>
        <div className="parameters-grid">
          {spinalParametersData.map((param) => (
            <div key={param.label} className="parameter-item">
              <div className="parameter-header">
                <span className="parameter-label">{param.label}</span>
                <span className={`parameter-value ${param.status}`}>{param.value}</span>
              </div>
              <div className="parameter-details">
                <span className="normal-range">Normal: {param.normalRange}</span>
                <span className={`trend ${param.trend}`}>
                  {param.trend === 'improving' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <polyline points="7 13l3-3 3 3 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="17 6h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {param.trend === 'stable' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                  {param.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="calculate-button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.76 0 5.26 1.24 6.93 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Calculate Parameters
        </button>
      </div>
    </div>
  );
};

export default SpinalParameters;
