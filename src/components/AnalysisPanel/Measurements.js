import React, { useState } from 'react';

const measurementsData = [
  {
    label: 'Thoracic Angle T1-T12',
    value: '22°',
    sublabel: 'Kyphosis measurement',
    confidence: '98%',
    date: 'Today 14:32'
  },
  {
    label: 'Lumbar Curve L1-L5',
    value: '45°',
    sublabel: 'Lordosis measurement',
    confidence: '95%',
    date: 'Today 14:30'
  },
  {
    label: 'Cervical Lordosis C2-C7',
    value: '35°',
    sublabel: 'Cervical curvature',
    confidence: '92%',
    date: 'Today 14:28'
  },
  {
    label: 'Pelvic Incidence',
    value: '52°',
    sublabel: 'Sagittal balance',
    confidence: '97%',
    date: 'Today 14:25'
  }
];

const Measurements = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="panel-section">
      <div 
        className={`section-header ${!expanded ? 'collapsed' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="section-title">Measurements</span>
        <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className={`section-content ${!expanded ? 'collapsed' : ''}`}>
        <div className="measurements-list">
          {measurementsData.map((measurement) => (
            <div key={measurement.label} className="measurement-item">
              <div className="measurement-header">
                <span className="measurement-label">{measurement.label}</span>
                <span className="measurement-value">{measurement.value}</span>
              </div>
              <div className="measurement-details">
                <span className="measurement-sublabel">{measurement.sublabel}</span>
                <div className="measurement-meta">
                  <span className="confidence">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.76 0 5.26 1.24 6.93 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {measurement.confidence}
                  </span>
                  <span className="timestamp">{measurement.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Measurements;
