import React, { useState, useMemo } from 'react';

const SpinalParameters = ({ toolResults = [] }) => {
  const [expanded, setExpanded] = useState(true);

  // Extract spinal parameter results from tool results
  const spinalParametersData = useMemo(() => {
    const parameterResults = toolResults.filter(result => 
      ['PI', 'PT', 'SS', 'All', 'Cervical Lordosis', 'Thoracic Kyphosis', 'Lumbar Lordosis'].includes(result.tool)
    );

    const getParameterValue = (toolName) => {
      const result = parameterResults.find(r => r.tool === toolName);
      if (!result || !result.result) return null;
      
      if (typeof result.result === 'object' && result.result.angle !== undefined) {
        return `${Math.round(result.result.angle)}°`;
      }
      if (typeof result.result === 'number') {
        return `${Math.round(result.result)}°`;
      }
      if (typeof result.result === 'string') {
        return result.result;
      }
      return null;
    };

    const getParameterStatus = (value, normalMin, normalMax) => {
      if (!value) return 'unknown';
      const numValue = parseInt(value);
      if (isNaN(numValue)) return 'unknown';
      
      if (numValue >= normalMin && numValue <= normalMax) return 'normal';
      if (numValue < normalMin) return 'low';
      return 'high';
    };

    const parameters = [
      {
        label: 'Pelvic Incidence',
        value: getParameterValue('PI'),
        normalRange: '45-75°',
        normalMin: 45,
        normalMax: 75,
        tool: 'PI'
      },
      {
        label: 'Pelvic Tilt',
        value: getParameterValue('PT'),
        normalRange: '10-25°',
        normalMin: 10,
        normalMax: 25,
        tool: 'PT'
      },
      {
        label: 'Sacral Slope',
        value: getParameterValue('SS'),
        normalRange: '30-50°',
        normalMin: 30,
        normalMax: 50,
        tool: 'SS'
      },
      {
        label: 'Cervical Lordosis',
        value: getParameterValue('Cervical Lordosis'),
        normalRange: '20-40°',
        normalMin: 20,
        normalMax: 40,
        tool: 'Cervical Lordosis'
      },
      {
        label: 'Thoracic Kyphosis',
        value: getParameterValue('Thoracic Kyphosis'),
        normalRange: '20-40°',
        normalMin: 20,
        normalMax: 40,
        tool: 'Thoracic Kyphosis'
      },
      {
        label: 'Lumbar Lordosis',
        value: getParameterValue('Lumbar Lordosis'),
        normalRange: '40-60°',
        normalMin: 40,
        normalMax: 60,
        tool: 'Lumbar Lordosis'
      }
    ];

    return parameters.map(param => ({
      ...param,
      status: param.value ? getParameterStatus(param.value, param.normalMin, param.normalMax) : 'unknown',
      trend: 'stable'
    })).filter(param => param.value !== null);
  }, [toolResults]);

  const handleCalculateAll = () => {
    // This would trigger calculation of all spinal parameters
    console.log('Calculate all parameters requested');
  };

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
        {spinalParametersData.length > 0 ? (
          <>
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
            
            <button className="calculate-button" onClick={handleCalculateAll}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.76 0 5.26 1.24 6.93 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Calculate Parameters
            </button>
          </>
        ) : (
          <div className="no-data-message">
            <p>No spinal parameters calculated yet.</p>
            <p>Use the spine tools to measure parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinalParameters;
