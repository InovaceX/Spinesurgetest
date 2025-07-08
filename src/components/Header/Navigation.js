import React, { useState } from 'react';
import './Navigation.css';

const navigationItems = [
  {
    label: 'Generic Tools',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 16v4a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="21 16 12 3 3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="3 16 9 16 9 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    options: [
      { name: 'Line Tool' },
      { name: 'Angle Tool (2pt) / Angle with Horizontal/Vertical' },
      { name: 'Angle Tool (3pt)' },
      { name: 'Angle Tool (4pt) / Cobb Angle' },
      { name: 'Multi-Line' },
      { name: 'Circle' },
      { name: 'Ellipse' },
      { name: 'Polygon (Area)' },
      { name: 'Pencil' }
    ]
  },
  {
    label: 'Spine Tools',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v20M8 5l4-3 4 3M8 19l4 3 4-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="8" r="1" fill="currentColor"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    ),
    columns: [
      {
        title: 'Spinopelvic Parameters',
        tools: [
          { name: 'PI', full: 'Pelvic Incidence' },
          { name: 'PT', full: 'Pelvic Tilt' },
          { name: 'SS', full: 'Sacral Slope' },
          { name: 'All', full: 'All Parameters' }
        ]
      },
      {
        title: 'Spinal Curvatures',
        tools: [
          { name: 'Cervical Lordosis' },
          { name: 'Thoracic Kyphosis' },
          { name: 'Lumbar Lordosis' },
          { name: 'Sacral Slope' },
          { name: 'Pelvic Tilt' },
          { name: 'Pelvic Incidence' },
          { name: 'Other Curvature' }
        ]
      },
      {
        title: 'Global Sagittal Params',
        tools: [
          { name: 'SVA', full: 'Sagittal Vertical Axis' },
          { name: 'cSVA', full: 'cervical Sagittal vertical Axis' },
          { name: 'TPA', full: 'T1 Pelvic Angle' },
          { name: 'SPA', full: 'Spinopelvic angle' },
          { name: 'SSA', full: 'Spinosacral Angle' },
          { name: 'T1SPi', full: 'T1 Spinopelvic incidence' },
          { name: 'T9SPi', full: 'T9 Spinopelvic incidence' },
          { name: 'OD-HA', full: 'Odontoid Hip Axis Angle' },
          { name: 'CBVA', full: 'Chin Brow Vertical Angle' }
        ]
      },
      {
        title: 'Global Coronal Params',
        tools: [
          { name: 'C7PL', full: 'C7 Plumb Line' },
          { name: 'CSVL', full: 'Central sacral vertical Line' },
          { name: 'TrunkShift' },
          { name: 'RVAD', full: 'Rib Vertebral Angle difference' },
          { name: 'AVT', full: 'Apex Vertebral Translation' },
          { name: 'PO', full: 'Pelvic Obliquity' }
        ]
      },
      {
        title: 'Vertebral Body Metrics (VBM)',
        tools: []
      }
    ]
  },
  {
    label: 'Abnormalities',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    options: [
      { name: 'Stenosis' },
      { name: 'Spondylolisthesis' },
      { name: 'Scoliosis' }
    ]
  }
];

const Navigation = ({ onToolSelect, selectedTool }) => {
  const [activeItem, setActiveItem] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  const handleToolClick = (toolName) => {
    if (onToolSelect) {
      onToolSelect(toolName);
      setHoveredItem(null); // Close dropdown after selection
    }
  };

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
      {navigationItems.map((item, index) => {
        const isSpineTools = item.label === 'Spine Tools';
        return (
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
              className={`nav-dropdown${isSpineTools ? ' spine-multicol' : ''} ${hoveredItem === index ? 'visible' : ''}`}
            >
              <div className="dropdown-content">
                <div className="dropdown-header">
                  <h3>{item.label}</h3>
                </div>
                <div className={`dropdown-options${isSpineTools ? ' multi-column' : ''}`}>
                  {item.columns ? (
                    <div className="dropdown-columns">
                      {item.columns.map((col, colIdx) => (
                        <div className="dropdown-column" key={colIdx}>
                          <div className="dropdown-col-title">{col.title}</div>
                          {col.tools.length > 0 ? (
                            col.tools.map((tool, toolIdx) => (
                              <div 
                                className={`dropdown-option ${selectedTool === tool.name ? 'selected' : ''}`} 
                                key={toolIdx}
                                onClick={() => handleToolClick(tool.name)}
                              >
                                <span className="option-name">{tool.name}{tool.full ? ` - ${tool.full}` : ''}</span>
                              </div>
                            ))
                          ) : (
                            <div className="dropdown-option"><span className="option-name">(No tools listed)</span></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    item.options.map((option, optIndex) => (
                      option.suboptions ? (
                        <div key={optIndex} className="dropdown-option">
                          <span className="option-name">{option.name}</span>
                          <div className="dropdown-suboptions">
                            {option.suboptions.map((sub, subIdx) => (
                              <div 
                                key={subIdx} 
                                className={`dropdown-suboption ${selectedTool === sub.name ? 'selected' : ''}`}
                                onClick={() => handleToolClick(sub.name)}
                              >
                                <span>{sub.name}{sub.full ? ` - ${sub.full}` : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div 
                          key={optIndex} 
                          className={`dropdown-option ${selectedTool === option.name ? 'selected' : ''}`}
                          onClick={() => handleToolClick(option.name)}
                        >
                          <span className="option-name">{option.name}{option.full ? ` - ${option.full}` : ''}</span>
                        </div>
                      )
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default Navigation;
