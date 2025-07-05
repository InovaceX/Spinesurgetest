import React, { useState, useContext } from 'react';
import './ActionPopups.css';
import { ImageContext } from '../../context/ImageContext';

const ActionPopups = ({ activePopup, setActivePopup }) => {
const [importSettings, setImportSettings] = useState({
  autoDetect: true,
  enhance: true,
  batch: false
});

  const [selectedFile, setSelectedFile] = useState(null);

  const { setImageSrc } = useContext(ImageContext);
  
  const [exportSettings, setExportSettings] = useState({
    format: 'pdf',
    measurements: true,
    analysis: true,
    images: true,
    rawData: false
  });
  
  const [saveSettings, setSaveSettings] = useState({
    name: 'Spinal Analysis - ' + new Date().toLocaleDateString(),
    location: 'local',
    measurements: true,
    parameters: true,
    annotations: true,
    autoSave: false
  });
  
  const [settingsTab, setSettingsTab] = useState('general');
  
  const closePopup = () => setActivePopup(null);

  const handleImport = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        closePopup();
      };
      reader.readAsDataURL(selectedFile);
    } else {
      console.log('Import with settings:', importSettings);
      closePopup();
    }
  };

  const handleExport = () => {
    console.log('Export with settings:', exportSettings);
    closePopup();
  };

  const handleSave = () => {
    console.log('Save with settings:', saveSettings);
    closePopup();
  };

  const popups = {
    import: {
      title: 'Import Medical Image',
      content: (
        <div className="popup-content">
          <div className="upload-zone" onClick={() => document.getElementById('file-input').click()}>
            <input 
              id="file-input" 
              type="file" 
              hidden 
              accept=".dcm,.jpg,.jpeg,.png,.tiff,.tif"
              multiple
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Drag & Drop or Click to Browse</h3>
            <p>Supported formats: DICOM, JPEG, PNG, TIFF</p>
            <button className="primary-btn">Select Files</button>
          </div>
          <div className="import-options">
            <label>
              <input 
                type="checkbox" 
                checked={importSettings.autoDetect}
                onChange={(e) => setImportSettings({...importSettings, autoDetect: e.target.checked})}
              />
              Auto-detect spinal landmarks
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={importSettings.enhance}
                onChange={(e) => setImportSettings({...importSettings, enhance: e.target.checked})}
              />
              Apply image enhancement
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={importSettings.batch}
                onChange={(e) => setImportSettings({...importSettings, batch: e.target.checked})}
              />
              Batch import multiple images
            </label>
          </div>
          <div className="popup-actions">
            <button className="secondary-btn" onClick={closePopup}>Cancel</button>
            <button className="primary-btn" onClick={handleImport}>Import</button>
          </div>
        </div>
      )
    },
    export: {
      title: 'Export Analysis Results',
      content: (
        <div className="popup-content">
          <div className="export-options">
            <div className="option-group">
              <h4>Export Format</h4>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="format" 
                    value="pdf" 
                    checked={exportSettings.format === 'pdf'}
                    onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                  /> 
                  PDF Report
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="format" 
                    value="json"
                    checked={exportSettings.format === 'json'}
                    onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                  /> 
                  JSON Data
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="format" 
                    value="csv"
                    checked={exportSettings.format === 'csv'}
                    onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                  /> 
                  CSV Measurements
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="format" 
                    value="dicom"
                    checked={exportSettings.format === 'dicom'}
                    onChange={(e) => setExportSettings({...exportSettings, format: e.target.value})}
                  /> 
                  DICOM with Annotations
                </label>
              </div>
            </div>
            <div className="option-group">
              <h4>Include</h4>
              <label>
                <input 
                  type="checkbox" 
                  checked={exportSettings.measurements}
                  onChange={(e) => setExportSettings({...exportSettings, measurements: e.target.checked})}
                /> 
                Measurements
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={exportSettings.analysis}
                  onChange={(e) => setExportSettings({...exportSettings, analysis: e.target.checked})}
                /> 
                Analysis Results
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={exportSettings.images}
                  onChange={(e) => setExportSettings({...exportSettings, images: e.target.checked})}
                /> 
                Images with Annotations
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={exportSettings.rawData}
                  onChange={(e) => setExportSettings({...exportSettings, rawData: e.target.checked})}
                /> 
                Raw Data
              </label>
            </div>
          </div>
          <div className="popup-actions">
            <button className="secondary-btn" onClick={closePopup}>Cancel</button>
            <button className="primary-btn" onClick={handleExport}>Export</button>
          </div>
        </div>
      )
    },
    save: {
      title: 'Save Project',
      content: (
        <div className="popup-content">
          <div className="save-options">
            <div className="input-group">
              <label>Project Name</label>
              <input 
                type="text" 
                placeholder="Enter project name..." 
                value={saveSettings.name}
                onChange={(e) => setSaveSettings({...saveSettings, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Location</label>
              <select 
                value={saveSettings.location}
                onChange={(e) => setSaveSettings({...saveSettings, location: e.target.value})}
              >
                <option value="local">Local Storage</option>
                <option value="cloud">Cloud Storage</option>
                <option value="network">Network Drive</option>
              </select>
            </div>
            <div className="save-options-list">
              <label>
                <input 
                  type="checkbox" 
                  checked={saveSettings.measurements}
                  onChange={(e) => setSaveSettings({...saveSettings, measurements: e.target.checked})}
                /> 
                Save measurements
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={saveSettings.parameters}
                  onChange={(e) => setSaveSettings({...saveSettings, parameters: e.target.checked})}
                /> 
                Save analysis parameters
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={saveSettings.annotations}
                  onChange={(e) => setSaveSettings({...saveSettings, annotations: e.target.checked})}
                /> 
                Save image annotations
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={saveSettings.autoSave}
                  onChange={(e) => setSaveSettings({...saveSettings, autoSave: e.target.checked})}
                /> 
                Auto-save enabled
              </label>
            </div>
          </div>
          <div className="popup-actions">
            <button className="secondary-btn" onClick={closePopup}>Cancel</button>
            <button className="primary-btn" onClick={handleSave}>Save Project</button>
          </div>
        </div>
      )
    },
    settings: {
      title: 'Application Settings',
      content: (
        <div className="popup-content">
          <div className="settings-tabs">
            <div className="tab-nav">
              <button 
                className={`tab-btn ${settingsTab === 'general' ? 'active' : ''}`}
                onClick={() => setSettingsTab('general')}
              >
                General
              </button>
              <button 
                className={`tab-btn ${settingsTab === 'analysis' ? 'active' : ''}`}
                onClick={() => setSettingsTab('analysis')}
              >
                Analysis
              </button>
              <button 
                className={`tab-btn ${settingsTab === 'display' ? 'active' : ''}`}
                onClick={() => setSettingsTab('display')}
              >
                Display
              </button>
              <button 
                className={`tab-btn ${settingsTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setSettingsTab('advanced')}
              >
                Advanced
              </button>
            </div>
            <div className="tab-content">
              {settingsTab === 'general' && (
                <>
                  <div className="settings-group">
                    <h4>Measurement Units</h4>
                    <select>
                      <option>Degrees (°)</option>
                      <option>Radians</option>
                    </select>
                  </div>
                  <div className="settings-group">
                    <h4>Interface</h4>
                    <label><input type="checkbox" defaultChecked /> Show tooltips</label>
                    <label><input type="checkbox" /> Compact sidebar</label>
                    <label><input type="checkbox" /> Auto-hide panels</label>
                  </div>
                </>
              )}
              {settingsTab === 'analysis' && (
                <div className="settings-group">
                  <h4>Default Analysis</h4>
                  <label><input type="checkbox" defaultChecked /> Auto-calculate Cobb angles</label>
                  <label><input type="checkbox" defaultChecked /> Enable pelvic parameters</label>
                  <label><input type="checkbox" /> Show measurement confidence</label>
                </div>
              )}
              {settingsTab === 'display' && (
                <div className="settings-group">
                  <h4>Display Options</h4>
                  <label><input type="checkbox" defaultChecked /> High contrast mode</label>
                  <label><input type="checkbox" /> Show grid overlay</label>
                  <label><input type="checkbox" /> Animation effects</label>
                </div>
              )}
              {settingsTab === 'advanced' && (
                <div className="settings-group">
                  <h4>Advanced Settings</h4>
                  <label><input type="checkbox" /> Debug mode</label>
                  <label><input type="checkbox" /> Hardware acceleration</label>
                  <label><input type="checkbox" /> Export diagnostics</label>
                </div>
              )}
            </div>
          </div>
          <div className="popup-actions">
            <button className="secondary-btn" onClick={closePopup}>Cancel</button>
            <button className="primary-btn">Save Settings</button>
          </div>
        </div>
      )
    }
  };

  if (!activePopup || !popups[activePopup]) return null;

  const popup = popups[activePopup];

  return (
    <div className="popup-overlay" onClick={closePopup}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{popup.title}</h2>
          <button className="close-btn" onClick={closePopup}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        {popup.content}
      </div>
    </div>
  );
};

export default ActionPopups;
