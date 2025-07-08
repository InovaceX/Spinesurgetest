import React, { useState } from 'react';
import ImageEditingToolbar from './ImageEditingToolbar';
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
    </main>
  );
};

export default Workspace;
