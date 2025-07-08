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

const ImageViewer = ({ selectedTool, onToolResult }) => {
  const canvasRef = useRef(null);
  const minimapRef = useRef(null);
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [results, setResults] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Get the actual canvas coordinate
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // Convert to image coordinate by removing offset and scaling
    return {
      x: (canvasX - offset.x) / scale,
      y: (canvasY - offset.y) / scale
    };
  }, [scale, offset]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    clearCanvas(ctx);
    
    // Draw image if loaded
    if (image) {
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);
      ctx.drawImage(image, 0, 0);
      ctx.restore();
    }
    
    // Redraw all previous results
    results.forEach(result => {
      if (result.handler && result.points) {
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);
        result.handler(result.points, ctx);
        ctx.restore();
      }
    });
  }, [image, scale, offset, results]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Helper to resize canvas to fit container
  const resizeCanvasToContainer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }, []);

  // Resize canvas on mount and window resize
  useEffect(() => {
    resizeCanvasToContainer();
    window.addEventListener('resize', resizeCanvasToContainer);
    return () => window.removeEventListener('resize', resizeCanvasToContainer);
  }, [resizeCanvasToContainer]);

  // When image loads, fit and center it
  const fitImageToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;
    const imgAspect = img.width / img.height;
    const canvasAspect = canvasWidth / canvasHeight;
    let drawWidth, drawHeight;
    if (imgAspect > canvasAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgAspect;
    }
    setScale(drawWidth / img.width);
    setOffset({
      x: (canvasWidth - drawWidth) / 2,
      y: (canvasHeight - drawHeight) / 2
    });
  }, []);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth || 800;
    const containerHeight = container.clientHeight || 600;
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (!selectedTool) return;
    
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
  }, [selectedTool, points, getMousePos, offset, scale, onToolResult]);

  const handleZoom = useCallback((factor, mouseEvent = null) => {
    const newScale = Math.max(0.1, Math.min(5, scale * factor));
    
    if (mouseEvent && image) {
      // Zoom towards mouse position
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = mouseEvent.clientX - rect.left;
      const mouseY = mouseEvent.clientY - rect.top;
      
      // Calculate the point in image coordinates before zoom
      const imageX = (mouseX - offset.x) / scale;
      const imageY = (mouseY - offset.y) / scale;
      
      // Calculate new offset to keep the same image point under the mouse
      const newOffset = {
        x: mouseX - imageX * newScale,
        y: mouseY - imageY * newScale
      };
      
      setOffset(newOffset);
    }
    
    setScale(newScale);
  }, [scale, offset, image]);

  const handleCanvasWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    handleZoom(factor, e);
  }, [handleZoom]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.ctrlKey)) {
      // Middle mouse button or Ctrl+Left click for panning
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isPanning && lastPanPoint) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setImage(img);
          fitImageToCanvas(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, [fitImageToCanvas]);

  const handleReset = useCallback(() => {
    if (image) {
      // Reset to fit the image in canvas
      const canvas = canvasRef.current;
      const containerWidth = canvas.width;
      const containerHeight = canvas.height;
      
      // Calculate scale to fit image
      const scaleX = containerWidth / image.width;
      const scaleY = containerHeight / image.height;
      const fitScale = Math.min(scaleX, scaleY, 1);
      
      // Center image
      const scaledWidth = image.width * fitScale;
      const scaledHeight = image.height * fitScale;
      
      setScale(fitScale);
      setOffset({
        x: (containerWidth - scaledWidth) / 2,
        y: (containerHeight - scaledHeight) / 2
      });
    } else {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
    setPoints([]);
  }, [image]);

  const clearAll = useCallback(() => {
    setResults([]);
    setPoints([]);
    redrawCanvas();
  }, [redrawCanvas]);

  // When canvas or image changes, re-fit image
  useEffect(() => {
    if (image) fitImageToCanvas(image);
  }, [image, fitImageToCanvas]);

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
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`analysis-canvas${isPanning ? ' panning' : ''}`}
        />
        {/* Minimap overlay */}
        {image && (
          <canvas
            className="minimap-canvas"
            width={140}
            height={140}
            style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(30,41,59,0.7)', borderRadius: 8, border: '1px solid #334155' }}
            ref={el => {
              if (!el) return;
              // Draw minimap
              const ctx = el.getContext('2d');
              ctx.clearRect(0, 0, el.width, el.height);
              // Draw full image
              const scaleX = el.width / image.width;
              const scaleY = el.height / image.height;
              ctx.save();
              ctx.scale(scaleX, scaleY);
              ctx.drawImage(image, 0, 0);
              ctx.restore();
              // Draw viewport rectangle
              const canvas = canvasRef.current;
              if (canvas) {
                const dpr = window.devicePixelRatio || 1;
                const viewW = canvas.width / scale / dpr;
                const viewH = canvas.height / scale / dpr;
                const viewX = -offset.x / image.width * el.width;
                const viewY = -offset.y / image.height * el.height;
                const rectW = viewW / image.width * el.width;
                const rectH = viewH / image.height * el.height;
                ctx.save();
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2;
                ctx.strokeRect(viewX, viewY, rectW, rectH);
                ctx.restore();
              }
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
