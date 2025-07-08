import React, { useState, useMemo } from 'react';

const Measurements = ({ toolResults = [] }) => {
  const [expanded, setExpanded] = useState(true);

  // Extract measurement results from tool results
  const measurementsData = useMemo(() => {
    return toolResults.map((result, index) => {
      const timestamp = new Date(result.timestamp || Date.now());
      const timeString = timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      let value = 'N/A';
      let sublabel = 'Measurement';
      let confidence = '95%';

      // Extract value based on result type
      if (result.result) {
        if (typeof result.result === 'object') {
          if (result.result.angle !== undefined) {
            value = `${Math.round(result.result.angle)}°`;
            sublabel = 'Angle measurement';
          } else if (result.result.distance !== undefined) {
            value = `${Math.round(result.result.distance)}mm`;
            sublabel = 'Distance measurement';
          } else if (result.result.area !== undefined) {
            value = `${Math.round(result.result.area)}mm²`;
            sublabel = 'Area measurement';
          } else if (result.result.length !== undefined) {
            value = `${Math.round(result.result.length)}mm`;
            sublabel = 'Length measurement';
          } else if (result.result.value !== undefined) {
            value = typeof result.result.value === 'number' ? 
              `${Math.round(result.result.value)}°` : 
              result.result.value;
            sublabel = result.result.description || 'Calculated value';
          }
        } else if (typeof result.result === 'number') {
          value = `${Math.round(result.result)}°`;
          sublabel = 'Angle measurement';
        } else if (typeof result.result === 'string') {
          value = result.result;
          sublabel = 'Calculated value';
        }
      }

      // Determine measurement type for sublabel
      if (result.tool.includes('Angle')) {
        sublabel = 'Angle measurement';
      } else if (result.tool.includes('Line')) {
        sublabel = 'Distance measurement';
      } else if (result.tool.includes('Circle') || result.tool.includes('Area')) {
        sublabel = 'Area measurement';
      } else if (['PI', 'PT', 'SS'].includes(result.tool)) {
        sublabel = 'Spinopelvic parameter';
      } else if (result.tool.includes('Lordosis') || result.tool.includes('Kyphosis')) {
        sublabel = 'Spinal curvature';
      } else if (['SVA', 'cSVA', 'TPA', 'SPA'].includes(result.tool)) {
        sublabel = 'Sagittal balance';
      }

      return {
        label: result.tool,
        value: value,
        sublabel: sublabel,
        confidence: confidence,
        date: `Today ${timeString}`,
        timestamp: result.timestamp || Date.now()
      };
    }).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
  }, [toolResults]);

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
        {measurementsData.length > 0 ? (
          <div className="measurements-list">
            {measurementsData.map((measurement, index) => (
              <div key={index} className="measurement-item">
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
        ) : (
          <div className="no-data-message">
            <p>No measurements taken yet.</p>
            <p>Use the measurement tools to take measurements.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Measurements;
