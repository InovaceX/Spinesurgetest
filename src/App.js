import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Workspace from './components/Workspace/Workspace';
import AnalysisPanel from './components/AnalysisPanel/AnalysisPanel';
import './styles/globals.css';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);
  const [toolResults, setToolResults] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleToolSelect = (toolName) => {
    setSelectedTool(toolName);
    console.log('Tool selected:', toolName);
  };

  const handleToolResults = (results) => {
    setToolResults(results);
  };

  return (
    <div className="app">
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onToolSelect={handleToolSelect}
        selectedTool={selectedTool}
      />
      <div className="app-content">
        <Sidebar />
        <Workspace 
          selectedTool={selectedTool} 
          onToolResults={handleToolResults}
        />
        <AnalysisPanel toolResults={toolResults} />
      </div>
    </div>
  );
}

export default App;
