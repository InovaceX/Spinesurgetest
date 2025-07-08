import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  handleLineTool,
  handleAngleTool2Pt,
  handleAngleTool3Pt,
  handleAngleTool4Pt,
  handleMultiLineTool,
  handleCircleTool,
  handleEllipseTool,
  handlePolygonTool,
  handlePencilTool
} from '../../logic/Generic_Tools';

import {
  calculatePI,
  calculatePT,
  calculateSS,
  calculateSpinopelvicParams,
  calculateSpinalCurvatureAngle,
  calculateSVA,
  calculateCSVA,
  calculateTPA,
  calculateSPA,
  calculateSSA,
  calculateT1SPi,
  calculateT9SPi,
  calculateODHA,
  calculateCBVA,
  drawC7PL,
  drawCSVL,
  calculateTrunkShift,
  calculateRVAD,
  calculateAVT,
  calculatePO,
  VBM
} from '../../logic/Spine_Tools';

import { clearCanvas } from '../../canvas/Canvas';
import './ImageViewer.css';

const TOOL_HANDLERS = {
  // Generic Tools
  'Line Tool': handleLineTool,
  'Angle Tool (2pt) / Angle with Horizontal/Vertical': handleAngleTool2Pt,
  'Angle Tool (3pt)': handleAngleTool3Pt,
  'Angle Tool (4pt) / Cobb Angle': handleAngleTool4Pt,
  'Multi-Line': handleMultiLineTool,
  'Circle': handleCircleTool,
  'Ellipse': handleEllipseTool,
  'Polygon (Area)': handlePolygonTool,
  'Pencil': handlePencilTool,
  
  // Spine Tools - Spinopelvic Parameters
  'PI': (points, ctx) => points.length === 4 ? calculatePI(points[0], points[1], points[2], points[3], ctx) : null,
  'PT': (points, ctx) => points.length === 4 ? calculatePT(points[0], points[1], points[2], points[3], ctx) : null,
  'SS': (points, ctx) => points.length === 2 ? calculateSS(points[0], points[1], ctx) : null,
  'All': (points, ctx) => points.length === 4 ? calculateSpinopelvicParams(points[0], points[1], points[2], points[3], ctx) : null,
  
  // Spine Tools - Spinal Curvatures
  'Cervical Lordosis': (points, ctx) => points.length === 4 ? calculateSpinalCurvatureAngle([points[0], points[1]], [points[2], points[3]], 'cervical_lordosis', ctx) : null,
  'Thoracic Kyphosis': (points, ctx) => points.length === 4 ? calculateSpinalCurvatureAngle([points[0], points[1]], [points[2], points[3]], 'thoracic_kyphosis', ctx) : null,
  'Lumbar Lordosis': (points, ctx) => points.length === 4 ? calculateSpinalCurvatureAngle([points[0], points[1]], [points[2], points[3]], 'lumbar_lordosis', ctx) : null,
  
  // Spine Tools - Global Sagittal Parameters
  'SVA': (points, ctx) => points.length === 2 ? calculateSVA(points[0], points[1], ctx) : null,
  'cSVA': (points, ctx) => points.length === 2 ? calculateCSVA(points[0], points[1], ctx) : null,
  'TPA': (points, ctx) => points.length === 4 ? calculateTPA(points[0], points[1], points[2], points[3], ctx) : null,
  'SPA': (points, ctx) => points.length === 3 ? calculateSPA(points[0], points[1], points[2], ctx) : null,
  'T1SPi': (points, ctx) => points.length === 5 ? calculateT1SPi(points[0], points[1], points[2], points[3], points[4], ctx) : null,
  'T9SPi': (points, ctx) => points.length === 5 ? calculateT9SPi(points[0], points[1], points[2], points[3], points[4], ctx) : null,
  'OD-HA': (points, ctx) => points.length === 3 ? calculateODHA(points[0], points[1], points[2], ctx) : null,
  'CBVA': (points, ctx) => points.length === 2 ? calculateCBVA(points[0], points[1], ctx) : null,
  
  // Spine Tools - Global Coronal Parameters
  'C7PL': (points, ctx) => points.length === 1 ? drawC7PL(points[0], ctx) : null,
  'CSVL': (points, ctx) => points.length === 1 ? drawCSVL(points[0], ctx) : null,
  'TrunkShift': (points, ctx) => points.length === 2 ? calculateTrunkShift(points[0], points[1], ctx) : null,
  'RVAD': (points, ctx) => points.length === 4 ? calculateRVAD(points[0], points[1], points[2], points[3], ctx) : null,
  'AVT': (points, ctx) => points.length === 3 ? calculateAVT(points[0], points[1], points[2], ctx) : null,
  'PO': (points, ctx) => points.length === 2 ? calculatePO(points[0], points[1], ctx) : null,
  
  // Spine Tools - VBM
  'Vertebral Body Metrics (VBM)': (points, ctx) => points.length >= 4 ? VBM(points, ctx) : null,
  
  // Abnormalities
  'Stenosis': (points, ctx) => points.length >= 2 ? handleLineTool(points.slice(0, 2), ctx) : null,
  'Spondylolisthesis': (points, ctx) => points.length >= 4 ? handleAngleTool4Pt(points.slice(0, 4), ctx) : null,
  'Scoliosis': (points, ctx) => points.length >= 4 ? calculateSpinalCurvatureAngle([points[0], points[1]], [points[2], points[3]], 'scoliosis', ctx) : null
};

const ImageViewer = ({ selectedTool, onToolResult, onImageControlsReady }) => {
  const canvasRef = useRef(null);
  const minimapRef = useRef(null);
  const containerRef = useRef(null);
  const [image, setImage] = useState(null);
  const [points, setPoints] = useState([]);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [results, setResults] = useState([]);
  const [imageTransforms, setImageTransforms] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    flipH: false,
    flipV: false
  });

  // Get mouse position relative to image coordinates
  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale
    };
  }, [scale, offset]);

  // Get mouse position relative to canvas
  const getCanvasPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.clientX === 0 ? 0 : (e.touches && e.touches[0] ? e.touches[0].clientX : 0));
    const clientY = e.clientY || (e.clientY === 0 ? 0 : (e.touches && e.touches[0] ? e.touches[0].clientY : 0));
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  // Apply image filters and transformations
  const applyImageTransforms = useCallback((ctx, img) => {
    const { brightness, contrast, saturation, rotation, flipH, flipV } = imageTransforms;
    ctx.save();
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    const centerX = img.width / 2;
    const centerY = img.height / 2;
    ctx.translate(centerX, centerY);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }, [imageTransforms]);

  // Redraw the main canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image if loaded
    if (image) {
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);
      applyImageTransforms(ctx, image);
      ctx.restore();
    }
    
    // Redraw all annotations
    results.forEach(result => {
      if (result.handler && result.points) {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);
        result.handler(result.points, ctx);
        ctx.restore();
      }
    });
  }, [image, scale, offset, results, applyImageTransforms]);

  // Update minimap
  const updateMinimap = useCallback(() => {
    const minimap = minimapRef.current;
    if (!minimap || !image) return;
    
    const ctx = minimap.getContext('2d');
    ctx.clearRect(0, 0, minimap.width, minimap.height);
    
    // Draw full image scaled to minimap
    const scaleX = minimap.width / image.width;
    const scaleY = minimap.height / image.height;
    const minimapScale = Math.min(scaleX, scaleY);
    
    const drawWidth = image.width * minimapScale;
    const drawHeight = image.height * minimapScale;
    const drawX = (minimap.width - drawWidth) / 2;
    const drawY = (minimap.height - drawHeight) / 2;
    
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    
    // Draw viewport rectangle
    const canvas = canvasRef.current;
    if (canvas) {
      const viewportWidth = canvas.width / scale;
      const viewportHeight = canvas.height / scale;
      const viewportX = -offset.x / scale;
      const viewportY = -offset.y / scale;
      
      const rectX = drawX + (viewportX * minimapScale);
      const rectY = drawY + (viewportY * minimapScale);
      const rectWidth = viewportWidth * minimapScale;
      const rectHeight = viewportHeight * minimapScale;
      
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    }
  }, [image, scale, offset]);

  // Resize canvas to container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }, []);

  // Fit image to canvas
  const fitImageToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = img.width / img.height;
    
    let newScale;
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      newScale = canvas.width / img.width;
    } else {
      // Image is taller than canvas
      newScale = canvas.height / img.height;
    }
    
    // Center the image
    const scaledWidth = img.width * newScale;
    const scaledHeight = img.height * newScale;
    const newOffset = {
      x: (canvas.width - scaledWidth) / 2,
      y: (canvas.height - scaledHeight) / 2
    };
    
    setScale(newScale);
    setOffset(newOffset);
  }, []);

  // Handle zoom
  const handleZoom = useCallback((factor, centerPoint = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newScale = Math.max(0.1, Math.min(10, scale * factor));
    
    if (centerPoint) {
      // Zoom around a specific point
      const zoomPoint = {
        x: (centerPoint.x - offset.x) / scale,
        y: (centerPoint.y - offset.y) / scale
      };
      
      const newOffset = {
        x: centerPoint.x - zoomPoint.x * newScale,
        y: centerPoint.y - zoomPoint.y * newScale
      };
      setOffset(newOffset);
    }
    
    setScale(newScale);
  }, [scale, offset]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const mousePos = getCanvasPos(e);
    handleZoom(zoomFactor, mousePos);
  }, [getCanvasPos, handleZoom]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || e.button === 2) { // Middle or right mouse button
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint(getCanvasPos(e));
    }
  }, [getCanvasPos]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e) => {
    if (isPanning && lastPanPoint) {
      const currentPos = getCanvasPos(e);
      const deltaX = currentPos.x - lastPanPoint.x;
      const deltaY = currentPos.y - lastPanPoint.y;
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint(currentPos);
    }
  }, [isPanning, lastPanPoint, getCanvasPos]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  // Handle canvas click for tools
  const handleCanvasClick = useCallback((e) => {
    if (!selectedTool || isPanning) return;
    
    const pos = getMousePos(e);
    const newPoints = [...points, pos];
    setPoints(newPoints);
    
    const handler = TOOL_HANDLERS[selectedTool];
    if (handler) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);
      
      const result = handler(newPoints, ctx);
      ctx.restore();
      
      if (result) {
        const newResult = {
          tool: selectedTool,
          points: newPoints,
          result,
          handler,
          timestamp: Date.now()
        };
        
        setResults(prev => [...prev, newResult]);
        setPoints([]);
        
        if (onToolResult) {
          onToolResult(newResult);
        }
      }
    }
  }, [selectedTool, points, getMousePos, offset, scale, onToolResult, isPanning]);

  // Handle minimap click
  const handleMinimapClick = useCallback((e) => {
    if (!image) return;
    
    const minimap = minimapRef.current;
    const rect = minimap.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert minimap coordinates to image coordinates
    const scaleX = minimap.width / image.width;
    const scaleY = minimap.height / image.height;
    const minimapScale = Math.min(scaleX, scaleY);
    
    const drawWidth = image.width * minimapScale;
    const drawHeight = image.height * minimapScale;
    const drawX = (minimap.width - drawWidth) / 2;
    const drawY = (minimap.height - drawHeight) / 2;
    
    const imageX = (clickX - drawX) / minimapScale;
    const imageY = (clickY - drawY) / minimapScale;
    
    // Center the view on this point
    const canvas = canvasRef.current;
    const newOffset = {
      x: canvas.width / 2 - imageX * scale,
      y: canvas.height / 2 - imageY * scale
    };
    
    setOffset(newOffset);
  }, [image, scale]);

  // Handle image upload
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setResults([]);
          setPoints([]);
          
          // Fit image after canvas is ready
          setTimeout(() => fitImageToCanvas(img), 100);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, [fitImageToCanvas]);

  // Handle reset view
  const handleReset = useCallback(() => {
    if (image) {
      fitImageToCanvas(image);
    }
    setPoints([]);
  }, [image, fitImageToCanvas]);

  // Clear all annotations
  const clearAll = useCallback(() => {
    setResults([]);
    setPoints([]);
  }, []);

  // Image transformation functions to pass to toolbar
  const imageControls = {
    setBrightness: (value) => setImageTransforms(prev => ({ ...prev, brightness: value })),
    setContrast: (value) => setImageTransforms(prev => ({ ...prev, contrast: value })),
    setSaturation: (value) => setImageTransforms(prev => ({ ...prev, saturation: value })),
    rotateLeft: () => setImageTransforms(prev => ({ ...prev, rotation: prev.rotation - 90 })),
    rotateRight: () => setImageTransforms(prev => ({ ...prev, rotation: prev.rotation + 90 })),
    flipHorizontal: () => setImageTransforms(prev => ({ ...prev, flipH: !prev.flipH })),
    flipVertical: () => setImageTransforms(prev => ({ ...prev, flipV: !prev.flipV })),
    zoomIn: () => handleZoom(1.2),
    zoomOut: () => handleZoom(0.8),
    resetAll: () => {
      setImageTransforms({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        flipH: false,
        flipV: false
      });
      handleReset();
    }
  };

  // Setup event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', e => e.preventDefault());
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Resize canvas on mount and window resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Redraw when dependencies change
  useEffect(() => {
    redrawCanvas();
    updateMinimap();
  }, [redrawCanvas, updateMinimap]);

  // Pass image controls to parent component
  useEffect(() => {
    if (onImageControlsReady) {
      onImageControlsReady(imageControls);
    }
  }, [onImageControlsReady, imageControls]);

  return (
    <div className="image-viewer">
      <div className="viewer-controls">
        <input
          type="file"
          accept="image/*,.dcm,.dicom"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-btn">
          📁 Upload Image
        </label>
        <button onClick={() => handleZoom(1.2)} className="control-btn">
          🔍+ Zoom In
        </button>
        <button onClick={() => handleZoom(0.8)} className="control-btn">
          🔍- Zoom Out
        </button>
        <button onClick={handleReset} className="control-btn">
          🔄 Reset View
        </button>
        <button onClick={clearAll} className="control-btn clear-btn">
          🗑️ Clear All
        </button>
        {selectedTool && (
          <div className="active-tool">
            Active Tool: <strong>{selectedTool}</strong>
            <span className="points-count">Points: {points.length}</span>
          </div>
        )}
        <div className="controls-info">
          🖱️ Scroll to zoom, Middle-click+drag or Right-click+drag to pan
        </div>
      </div>
      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`analysis-canvas${isPanning ? ' panning' : ''}`}
        />
        {/* Functional Minimap */}
        {image && (
          <canvas
            ref={minimapRef}
            className="minimap-canvas"
            width={120}
            height={120}
            onClick={handleMinimapClick}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
              background: 'rgba(30,41,59,0.9)',
              borderRadius: 8,
              border: '1px solid #334155',
              cursor: 'pointer'
            }}
          />
        )}
        {!image && (
          <div className="no-image-overlay">
            <div className="upload-prompt">
              <div className="upload-icon">📷</div>
              <h3>Upload Medical Image</h3>
              <p>Click "Upload Image" to load your X-ray, MRI, or CT scan</p>
              <p className="formats">Supported: JPEG, PNG, DICOM, TIFF</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
