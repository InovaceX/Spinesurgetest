import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Workspace from './components/Workspace/Workspace';
import AnalysisPanel from './components/AnalysisPanel/AnalysisPanel';
import './styles/globals.css';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="app">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="app-content">
        <Sidebar />
        <Workspace />
        <AnalysisPanel />
      </div>
    </div>
  );
}

export default App;
