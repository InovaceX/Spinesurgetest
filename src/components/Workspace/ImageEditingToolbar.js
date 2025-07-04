import React, { useState } from 'react';
import './ImageEditingToolbar.css';

const ImageEditingToolbar = () => {
  const [hoveredTool, setHoveredTool] = useState(null);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [activeValues, setActiveValues] = useState({});

  const tools = [
    {
      id: 'brightness',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Brightness',
      type: 'slider',
      value: brightness,
      setValue: setBrightness,
      min: 0,
      max: 100,
      unit: '%'
    },
    {
      id: 'contrast',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2a10 10 0 0 0 0 20" fill="currentColor"/>
        </svg>
      ),
      label: 'Contrast',
      type: 'slider',
      value: contrast,
      setValue: setContrast,
      min: 0,
      max: 100,
      unit: '%'
    },
    {
      id: 'saturation',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 3a9 9 0 0 1 6.36 15.36" stroke="currentColor" strokeWidth="2"/>
          <path d="M5.64 18.36A9 9 0 0 1 12 3" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Saturation',
      type: 'slider',
      value: saturation,
      setValue: setSaturation,
      min: 0,
      max: 100,
      unit: '%'
    },
    {
      id: 'rotate-left',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Rotate Left',
      type: 'action',
      action: () => console.log('Rotate left')
    },
    {
      id: 'rotate-right',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2"/>
          <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Rotate Right',
      type: 'action',
      action: () => console.log('Rotate right')
    },
    {
      id: 'flip-h',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 20v2M12 14v2M12 8v2M12 2v2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Flip Horizontal',
      type: 'action',
      action: () => console.log('Flip horizontal')
    },
    {
      id: 'zoom-in',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Zoom In',
      type: 'action',
      action: () => console.log('Zoom in')
    },
    {
      id: 'zoom-out',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Zoom Out',
      type: 'action',
      action: () => console.log('Zoom out')
    },
    {
      id: 'reset',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 16l-5 3v-5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Reset All',
      type: 'action',
      action: () => {
        setBrightness(50);
        setContrast(50);
        setSaturation(50);
      }
    }
  ];

  return (
    <div className="macos-toolbar">
      <div className="toolbar-track">
        {tools.map((tool, index) => {
          const isHovered = hoveredTool === tool.id;
          const shouldScale = hoveredTool && (
            hoveredTool === tool.id ||
            Math.abs(tools.findIndex(t => t.id === hoveredTool) - index) <= 1
          );
          
          return (
            <div 
              key={tool.id} 
              className={`tool-container ${isHovered ? 'active' : ''} ${shouldScale ? 'scaled' : ''}`}
              onMouseEnter={() => setHoveredTool(tool.id)}
              onMouseLeave={() => setHoveredTool(null)}
            >
              <div className="tool-icon">
                <button 
                  className="tool-btn"
                  onClick={tool.action}
                  title={tool.label}
                >
                  {tool.icon}
                </button>
              </div>
              
              {isHovered && tool.type === 'slider' && (
                <div className="tool-popup compact">
                  <div className="slider-container">
                    <input
                      type="range"
                      min={tool.min}
                      max={tool.max}
                      value={tool.value}
                      onChange={(e) => tool.setValue(parseInt(e.target.value))}
                      className="tool-slider"
                    />
                    <div className="slider-track">
                      <div 
                        className="slider-fill" 
                        style={{ width: `${(tool.value - tool.min) / (tool.max - tool.min) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {isHovered && tool.type === 'action' && (
                <div className="tool-tooltip">
                  <span>{tool.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageEditingToolbar;
