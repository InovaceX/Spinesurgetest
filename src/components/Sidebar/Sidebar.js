import React, { useState } from 'react';
import QuickAccess from './QuickAccess';
import ToolCategories from './ToolCategories';
import Favorites from './Favorites';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-content">
          <QuickAccess />
          <ToolCategories />
          <Favorites />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
