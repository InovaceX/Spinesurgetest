import React, { useState } from 'react';
import './Navigation.css';

const navigationItems = [
  {
    label: 'Measure',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 16v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="21 16 12 3 3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="3 16 9 16 9 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    options: [
      { name: 'Distance Measurement', description: 'Measure linear distances between points' },
      { name: 'Angle Measurement', description: 'Calculate angles between lines or structures' },
      { name: 'Curve Length', description: 'Measure curved anatomical structures' },
      { name: 'Area Calculation', description: 'Calculate enclosed areas and regions' },
      { name: 'Point-to-Point', description: 'Simple point-to-point measurements' },
      { name: 'Multi-Point Distance', description: 'Complex multi-point measurements' },
      { name: 'Perpendicular Distance', description: 'Calculate perpendicular distances' },
      { name: 'Radius Measurement', description: 'Measure radius of circular structures' }
    ]
  },
  {
    label: 'Spine',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    ),
    options: [
      { name: 'Cobb Angle Analysis', description: 'Primary scoliosis measurement tool' },
      { name: 'Pelvic Parameters', description: 'Sagittal balance assessment' },
      { name: 'Vertebral Height', description: 'Compression fracture analysis' },
      { name: 'Scoliosis Measurement', description: 'Complete spinal deformity analysis' },
      { name: 'Kyphosis Analysis', description: 'Thoracic curvature assessment' },
      { name: 'Lordosis Assessment', description: 'Lumbar curvature evaluation' },
      { name: 'Spinous Process Alignment', description: 'Posterior element analysis' },
      { name: 'Disc Space Analysis', description: 'Intervertebral space measurement' }
    ]
  },
  {
    label: 'Geometric',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <polygon points="12 2 19 21 5 21 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    options: [
      { name: 'Circle Fitting', description: 'Fit circles to anatomical curves' },
      { name: 'Line Intersection', description: 'Find intersection points of lines' },
      { name: 'Polygon Analysis', description: 'Complex shape measurements' },
      { name: 'Arc Measurements', description: 'Curved structure analysis' },
      { name: 'Tangent Lines', description: 'Calculate tangent relationships' },
      { name: 'Geometric Centers', description: 'Find centroids and centers' },
      { name: 'Symmetry Analysis', description: 'Assess bilateral symmetry' },
      { name: 'Shape Recognition', description: 'Automated shape detection' }
    ]
  },
  {
    label: 'Surgical',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    options: [
      { name: 'Implant Planning', description: 'Surgical hardware placement planning' },
      { name: 'Screw Trajectory', description: 'Pedicle screw path optimization' },
      { name: 'Fusion Assessment', description: 'Post-operative fusion evaluation' },
      { name: 'Hardware Placement', description: 'Surgical device positioning' },
      { name: 'Surgical Approach', description: 'Optimal surgical corridor planning' },
      { name: 'Bone Density Analysis', description: 'Trabecular bone assessment' },
      { name: 'Post-Op Evaluation', description: 'Surgical outcome analysis' },
      { name: 'Complication Assessment', description: 'Identify surgical complications' }
    ]
  }
];

const Navigation = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  const clearDropdownTimeout = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
  };

  const handleNavItemMouseEnter = (index) => {
    clearDropdownTimeout();
    setHoveredItem(index);
  };

  const handleNavItemMouseLeave = () => {
    // Add a delay before closing to allow mouse to move to dropdown
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
    setDropdownTimeout(timeout);
  };

  const handleDropdownMouseEnter = (index) => {
    clearDropdownTimeout();
    setHoveredItem(index);
  };

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
    setDropdownTimeout(timeout);
  };

  const handleContainerMouseEnter = (index) => {
    clearDropdownTimeout();
    setHoveredItem(index);
  };

  const handleContainerMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
    setDropdownTimeout(timeout);
  };

  return (
    <nav className="navigation">
      {navigationItems.map((item, index) => (
        <div 
          key={item.label} 
          className="nav-item"
          onMouseEnter={() => handleContainerMouseEnter(index)}
          onMouseLeave={handleContainerMouseLeave}
        >
          <button
            className={`nav-button ${activeItem === index ? 'active' : ''}`}
            onClick={() => setActiveItem(index)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
          
          <div 
            className={`nav-dropdown ${hoveredItem === index ? 'visible' : ''}`}
          >
            <div className="dropdown-content">
              <div className="dropdown-header">
                <h3>{item.label} Tools</h3>
              </div>
              <div className="dropdown-options">
                {item.options.map((option, optIndex) => (
                  <div key={optIndex} className="dropdown-option">
                    <span className="option-name">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
