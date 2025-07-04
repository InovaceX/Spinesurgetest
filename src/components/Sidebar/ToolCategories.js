import React, { useState } from 'react';

const toolCategories = [
  {
    title: 'Measurement Tools',
    items: [
      {
        name: 'Distance Measurement',
        description: 'Measure linear distances',
        status: 'ACTIVE'
      },
      {
        name: 'Angle Measurement',
        description: 'Measure angles between lines',
        status: 'ACTIVE'
      },
      {
        name: 'Curve Length',
        description: 'Measure curved structures',
        status: 'PRO'
      },
      {
        name: 'Area Calculation',
        description: 'Calculate enclosed areas',
        status: 'PRO'
      }
    ]
  },
  {
    title: 'Spine Analysis',
    items: [
      {
        name: 'Cobb Angle',
        description: 'Scoliosis measurement',
        status: 'ACTIVE'
      },
      {
        name: 'Pelvic Parameters',
        description: 'Sagittal balance analysis',
        status: 'ACTIVE'
      },
      {
        name: 'Vertebral Height',
        description: 'Compression analysis',
        status: 'PRO'
      },
      {
        name: 'Disc Space Analysis',
        description: 'Intervertebral measurements',
        status: 'PRO'
      }
    ]
  }
];

const ToolCategories = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="sidebar-section">
      <div 
        className={`section-header ${!expanded ? 'collapsed' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="section-title">Tool Categories</span>
        <svg className="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className={`section-content ${!expanded ? 'collapsed' : ''}`}>
        {toolCategories.map((category) => (
          <div key={category.title} className="tool-category">
            <h4 className="category-title">{category.title}</h4>
            <div className="tool-list">
              {category.items.map((tool) => (
                <button key={tool.name} className="tool-item" title={tool.description}>
                  <div className="tool-content">
                    <span className="tool-name">{tool.name}</span>
                    <span className="tool-description">{tool.description}</span>
                  </div>
                  <span className={`tool-status ${tool.status.toLowerCase()}`}>
                    {tool.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolCategories;
