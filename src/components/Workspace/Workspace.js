import React, { useState } from 'react';
import ImageEditingToolbar from './ImageEditingToolbar';
<<<<<<< HEAD
import ImageViewer from '../ImageViewer/ImageViewer';
import './Workspace.css';

const Workspace = ({ selectedTool, onToolResults }) => {
  const [toolResults, setToolResults] = useState([]);
  const [imageControls, setImageControls] = useState(null);

  const handleToolResult = (result) => {
    const newResults = [...toolResults, result];
    setToolResults(newResults);
    console.log('Tool result:', result);
    
    // Pass results to parent (App)
    if (onToolResults) {
      onToolResults(newResults);
    }
  };

  const handleImageControlsReady = (controls) => {
    setImageControls(controls);
  };

  return (
    <main className="workspace">
      <div className="workspace-content">
        <ImageViewer 
          selectedTool={selectedTool} 
          onToolResult={handleToolResult}
          onImageControlsReady={handleImageControlsReady}
        />
      </div>
      <ImageEditingToolbar imageControls={imageControls} />
=======
import './Workspace.css';

const Workspace = () => {
  return (
    <main className="workspace">
      <div className="workspace-header">
        <h1>Analysis Workspace</h1>
        <div className="workspace-controls">
          <button className="control-btn" title="Zoom In">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button className="control-btn" title="Zoom Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button className="control-btn" title="Reset View">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="upload-area">
        <div className="upload-content">
          <div className="upload-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Upload Medical Image</h2>
          <p>Drag and drop your X-ray, MRI, or CT scan here, or click to browse</p>
          <div className="supported-formats">
            <span>Supported formats: JPEG, PNG, DICOM, TIFF</span>
          </div>
          <button className="upload-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Select Image
          </button>
        </div>
      </div>
      
      <ImageEditingToolbar />
>>>>>>> 6780040092ba58fa4421663a4ecf5f61837205b0
    </main>
  );
};

export default Workspace;
