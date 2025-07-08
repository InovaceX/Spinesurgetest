// Import from core.js
import { 
  midpoint, 
  angleWithHorizontal, 
  angleWithVertical, 
  angleABC, 
  cobbAngle, 
  lengthPointToLine, 
  lengthBetweenPoints,
  lineIntersection,
  vector,
  normalizeVector
} from './Core';

// Import from canvas.js
import { 
  drawLine, 
  drawVerticalLine,
  drawHorizontalLine,
  drawPerpendicular, 
  drawAngleArc, 
  drawAngleLabel, 
  drawCobbAngle,
  lineExtend 
} from './Canvas';

import {
  handleAngleTool4Pt
} from './Generic_Tools';

// SPINOPELVIC PARAMETERS

export const calculatePI = (femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx = null) => {
  // Step 1: Calculate midpoints
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const s1Midpoint = midpoint(s1EndLeft, s1EndRight);
  
  // Step 2: Create perpendicular to S1 endplate at S1 midpoint
  // Vector along S1 endplate
  const s1Vector = { x: s1EndRight.x - s1EndLeft.x, y: s1EndRight.y - s1EndLeft.y };
  // Perpendicular vector (rotate 90 degrees)
  const perpVector = { x: -s1Vector.y, y: s1Vector.x };
  
  // Normalize and extend the perpendicular
  const normalizedPerp = normalizeVector(perpVector);
  const perpEnd = {
    x: s1Midpoint.x + normalizedPerp.x * 200,
    y: s1Midpoint.y + normalizedPerp.y * 200
  };
  
  // Step 3: Calculate the angle between the perpendicular and the line to femoral center
  const angle = angleABC(perpEnd, s1Midpoint, femoralCenter);
  
  if (ctx) {
    // Draw S1 endplate
    drawLine(ctx, s1EndLeft, s1EndRight, "blue", 3);
    // Draw perpendicular
    drawLine(ctx, s1Midpoint, perpEnd, "red", 2);
    // Draw line to femoral center
    drawLine(ctx, s1Midpoint, femoralCenter, "green", 2);
    // Draw angle arc
    drawAngleArc(ctx, s1Midpoint, perpEnd, femoralCenter, 50, "purple");
    // Label
    drawAngleLabel(ctx, { x: s1Midpoint.x + 60, y: s1Midpoint.y }, `PI: ${angle.toFixed(1)}°`, "purple");
  }
  
  return angle;
};

export const calculatePT = (femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx = null) => {
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const s1Midpoint = midpoint(s1EndLeft, s1EndRight);
  
  // Create vertical reference line through s1Midpoint
  const verticalPoint = { x: s1Midpoint.x, y: s1Midpoint.y - 100 };
  
  // Calculate angle between vertical and line to femoral center
  const angle = angleABC(verticalPoint, s1Midpoint, femoralCenter);
  
  if (ctx) {
    drawLine(ctx, s1Midpoint, verticalPoint, "blue", 2);
    drawLine(ctx, s1Midpoint, femoralCenter, "green", 2);
    drawAngleArc(ctx, s1Midpoint, verticalPoint, femoralCenter, 40, "orange");
    drawAngleLabel(ctx, { x: s1Midpoint.x + 50, y: s1Midpoint.y - 30 }, `PT: ${angle.toFixed(1)}°`, "orange");
  }
  
  return angle;
};

export const calculateSS = (s1EndLeft, s1EndRight, ctx = null) => {
  // Calculate angle between S1 endplate and horizontal
  const angle = angleWithHorizontal(s1EndLeft, s1EndRight);
  
  if (ctx) {
    const s1Midpoint = midpoint(s1EndLeft, s1EndRight);
    const horizontalPoint = { x: s1Midpoint.x + 100, y: s1Midpoint.y };
    
    drawLine(ctx, s1EndLeft, s1EndRight, "blue", 3);
    drawLine(ctx, s1Midpoint, horizontalPoint, "gray", 1);
    drawAngleArc(ctx, s1Midpoint, s1EndRight, horizontalPoint, 30, "cyan");
    drawAngleLabel(ctx, { x: s1Midpoint.x + 40, y: s1Midpoint.y + 20 }, `SS: ${angle.toFixed(1)}°`, "cyan");
  }
  
  return angle;
};

export const calculateSpinopelvicParams = (femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx = null) => {
  const PI = calculatePI(femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx);
  const PT = calculatePT(femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx);
  const SS = calculateSS(s1EndLeft, s1EndRight, ctx);
  
  return { PI, PT, SS };
};

// SPINAL CURVATURE TYPES
export const SPINAL_CURVATURE_TYPES = {
  CERVICAL_LORDOSIS: 'cervical_lordosis',
  THORACIC_KYPHOSIS: 'thoracic_kyphosis',
  LUMBAR_LORDOSIS: 'lumbar_lordosis',
  SACRAL_SLOPE: 'sacral_slope',
  PELVIC_TILT: 'pelvic_tilt',
  PELVIC_INCIDENCE: 'pelvic_incidence',
  OTHER: 'other'
};

export const calculateSpinalCurvatureAngle = (upperEndplate, lowerEndplate, type = SPINAL_CURVATURE_TYPES.OTHER, ctx = null) => {
  const angle = cobbAngle(upperEndplate, lowerEndplate);
  
  if (ctx) {
    drawCobbAngle(ctx, upperEndplate, lowerEndplate, "red");
    const labelPos = midpoint(midpoint(upperEndplate[0], upperEndplate[1]), midpoint(lowerEndplate[0], lowerEndplate[1]));
    drawAngleLabel(ctx, { x: labelPos.x + 50, y: labelPos.y }, `${type}: ${angle.toFixed(1)}°`, "red");
  }
  
  return angle;
};

export const getSpinalCurvatureOptions = () => Object.values(SPINAL_CURVATURE_TYPES);

export const getSpinalCurvatureOptionsByRegion = (region) => {
  const regionMap = {
    cervical: [SPINAL_CURVATURE_TYPES.CERVICAL_LORDOSIS],
    thoracic: [SPINAL_CURVATURE_TYPES.THORACIC_KYPHOSIS],
    lumbar: [SPINAL_CURVATURE_TYPES.LUMBAR_LORDOSIS],
    pelvis: [SPINAL_CURVATURE_TYPES.SACRAL_SLOPE, SPINAL_CURVATURE_TYPES.PELVIC_TILT, SPINAL_CURVATURE_TYPES.PELVIC_INCIDENCE]
  };
  return regionMap[region] || [SPINAL_CURVATURE_TYPES.OTHER];
};

// GLOBAL SAGITTAL PARAMETERS

export const calculateSVA = (c7Vertebra, s1Vertebra, ctx = null) => {
  const distance = Math.abs(c7Vertebra.x - s1Vertebra.x);
  
  if (ctx) {
    drawVerticalLine(ctx, c7Vertebra, "blue", 2);
    drawVerticalLine(ctx, s1Vertebra, "red", 2);
    drawLine(ctx, 
      { x: c7Vertebra.x, y: Math.min(c7Vertebra.y, s1Vertebra.y) - 50 },
      { x: s1Vertebra.x, y: Math.min(c7Vertebra.y, s1Vertebra.y) - 50 },
      "purple", 2
    );
    drawAngleLabel(ctx, 
      { x: (c7Vertebra.x + s1Vertebra.x) / 2, y: Math.min(c7Vertebra.y, s1Vertebra.y) - 70 },
      `SVA: ${distance.toFixed(1)} mm`, "purple"
    );
  }
  
  return distance;
};

export const calculateCSVA = (c2Vertebra, c7Vertebra, ctx = null) => {
  const distance = Math.abs(c2Vertebra.x - c7Vertebra.x);
  
  if (ctx) {
    drawVerticalLine(ctx, c2Vertebra, "green", 2);
    drawVerticalLine(ctx, c7Vertebra, "blue", 2);
    drawAngleLabel(ctx, 
      { x: (c2Vertebra.x + c7Vertebra.x) / 2, y: Math.min(c2Vertebra.y, c7Vertebra.y) - 50 },
      `cSVA: ${distance.toFixed(1)} mm`, "green"
    );
  }
  
  return distance;
};

export const calculateTPA = (t1Vertebra, femoralHead1, femoralHead2, s1Vertebra, ctx = null) => {
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const angle = angleABC(t1Vertebra, s1Vertebra, femoralCenter);
  
  if (ctx) {
    drawLine(ctx, t1Vertebra, s1Vertebra, "blue", 2);
    drawLine(ctx, s1Vertebra, femoralCenter, "red", 2);
    drawAngleArc(ctx, s1Vertebra, t1Vertebra, femoralCenter, 40, "purple");
    drawAngleLabel(ctx, { x: s1Vertebra.x + 50, y: s1Vertebra.y }, `TPA: ${angle.toFixed(1)}°`, "purple");
  }
  
  return angle;
};

export const calculateSPA = (s1Vertebra, femoralHead1, femoralHead2, ctx = null) => {
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const verticalPoint = { x: s1Vertebra.x, y: s1Vertebra.y - 100 };
  const angle = angleABC(verticalPoint, s1Vertebra, femoralCenter);
  
  if (ctx) {
    drawLine(ctx, s1Vertebra, verticalPoint, "gray", 1);
    drawLine(ctx, s1Vertebra, femoralCenter, "red", 2);
    drawAngleArc(ctx, s1Vertebra, verticalPoint, femoralCenter, 35, "orange");
    drawAngleLabel(ctx, { x: s1Vertebra.x + 45, y: s1Vertebra.y - 25 }, `SPA: ${angle.toFixed(1)}°`, "orange");
  }
  
  return angle;
};

export const calculateSSA = (s1EndLeft, s1EndRight, ctx = null) => {
  // Same as Sacral Slope
  return calculateSS(s1EndLeft, s1EndRight, ctx);
};

export const calculateT1SPi = (t1Vertebra, femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx = null) => {
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const s1Midpoint = midpoint(s1EndLeft, s1EndRight);
  
  // Create perpendicular to S1 at S1 midpoint
  const s1Vector = vector(s1EndLeft, s1EndRight);
  const perpVector = { x: -s1Vector.y, y: s1Vector.x };
  const normalizedPerp = normalizeVector(perpVector);
  const perpEnd = {
    x: s1Midpoint.x + normalizedPerp.x * 100,
    y: s1Midpoint.y + normalizedPerp.y * 100
  };
  
  const angle = angleABC(t1Vertebra, s1Midpoint, perpEnd);
  
  if (ctx) {
    drawLine(ctx, t1Vertebra, s1Midpoint, "blue", 2);
    drawLine(ctx, s1Midpoint, perpEnd, "red", 2);
    drawAngleArc(ctx, s1Midpoint, t1Vertebra, perpEnd, 45, "green");
    drawAngleLabel(ctx, { x: s1Midpoint.x + 55, y: s1Midpoint.y }, `T1SPi: ${angle.toFixed(1)}°`, "green");
  }
  
  return angle;
};

export const calculateT9SPi = (t9Vertebra, femoralHead1, femoralHead2, s1EndLeft, s1EndRight, ctx = null) => {
  // Similar to T1SPi but with T9
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const s1Midpoint = midpoint(s1EndLeft, s1EndRight);
  
  const s1Vector = vector(s1EndLeft, s1EndRight);
  const perpVector = { x: -s1Vector.y, y: s1Vector.x };
  const normalizedPerp = normalizeVector(perpVector);
  const perpEnd = {
    x: s1Midpoint.x + normalizedPerp.x * 100,
    y: s1Midpoint.y + normalizedPerp.y * 100
  };
  
  const angle = angleABC(t9Vertebra, s1Midpoint, perpEnd);
  
  if (ctx) {
    drawLine(ctx, t9Vertebra, s1Midpoint, "blue", 2);
    drawLine(ctx, s1Midpoint, perpEnd, "red", 2);
    drawAngleArc(ctx, s1Midpoint, t9Vertebra, perpEnd, 45, "cyan");
    drawAngleLabel(ctx, { x: s1Midpoint.x + 55, y: s1Midpoint.y + 25 }, `T9SPi: ${angle.toFixed(1)}°`, "cyan");
  }
  
  return angle;
};

export const calculateODHA = (odontoidProcess, femoralHead1, femoralHead2, ctx = null) => {
  const femoralCenter = midpoint(femoralHead1, femoralHead2);
  const horizontalPoint = { x: odontoidProcess.x + 100, y: odontoidProcess.y };
  const angle = angleABC(horizontalPoint, odontoidProcess, femoralCenter);
  
  if (ctx) {
    drawLine(ctx, odontoidProcess, horizontalPoint, "gray", 1);
    drawLine(ctx, odontoidProcess, femoralCenter, "red", 2);
    drawAngleArc(ctx, odontoidProcess, horizontalPoint, femoralCenter, 40, "magenta");
    drawAngleLabel(ctx, { x: odontoidProcess.x + 50, y: odontoidProcess.y - 20 }, `OD-HA: ${angle.toFixed(1)}°`, "magenta");
  }
  
  return angle;
};

export const calculateCBVA = (chinPoint, browPoint, ctx = null) => {
  const verticalPoint = { x: chinPoint.x, y: chinPoint.y - 100 };
  const angle = angleABC(verticalPoint, chinPoint, browPoint);
  
  if (ctx) {
    drawLine(ctx, chinPoint, verticalPoint, "gray", 1);
    drawLine(ctx, chinPoint, browPoint, "brown", 2);
    drawAngleArc(ctx, chinPoint, verticalPoint, browPoint, 30, "brown");
    drawAngleLabel(ctx, { x: chinPoint.x + 40, y: chinPoint.y - 30 }, `CBVA: ${angle.toFixed(1)}°`, "brown");
  }
  
  return angle;
};

// CORONAL PARAMETERS

export const drawC7PL = (c7Vertebra, ctx) => {
  drawVerticalLine(ctx, c7Vertebra, "blue", 2);
  drawAngleLabel(ctx, { x: c7Vertebra.x + 10, y: c7Vertebra.y - 20 }, "C7PL", "blue");
};

export const drawCSVL = (s1Vertebra, ctx) => {
  drawVerticalLine(ctx, s1Vertebra, "red", 2);
  drawAngleLabel(ctx, { x: s1Vertebra.x + 10, y: s1Vertebra.y + 30 }, "CSVL", "red");
};

export const calculateTrunkShift = (c7Vertebra, s1Vertebra, ctx = null) => {
  const distance = Math.abs(c7Vertebra.x - s1Vertebra.x);
  
  if (ctx) {
    drawC7PL(c7Vertebra, ctx);
    drawCSVL(s1Vertebra, ctx);
    drawLine(ctx, 
      { x: c7Vertebra.x, y: (c7Vertebra.y + s1Vertebra.y) / 2 },
      { x: s1Vertebra.x, y: (c7Vertebra.y + s1Vertebra.y) / 2 },
      "purple", 2
    );
    drawAngleLabel(ctx, 
      { x: (c7Vertebra.x + s1Vertebra.x) / 2, y: (c7Vertebra.y + s1Vertebra.y) / 2 - 20 },
      `Trunk Shift: ${distance.toFixed(1)} mm`, "purple"
    );
  }
  
  return distance;
};

export const calculateRVAD = (upperRib, lowerRib, upperVertebra, lowerVertebra, ctx = null) => {
  const ribAngle = angleWithHorizontal(upperRib, lowerRib);
  const vertebraAngle = angleWithHorizontal(upperVertebra, lowerVertebra);
  const difference = Math.abs(ribAngle - vertebraAngle);
  
  if (ctx) {
    drawLine(ctx, upperRib, lowerRib, "green", 2);
    drawLine(ctx, upperVertebra, lowerVertebra, "blue", 2);
    const labelPos = midpoint(midpoint(upperRib, lowerRib), midpoint(upperVertebra, lowerVertebra));
    drawAngleLabel(ctx, labelPos, `RVAD: ${difference.toFixed(1)}°`, "purple");
  }
  
  return difference;
};

export const calculateAVT = (apexVertebra, c7Vertebra, s1Vertebra, ctx = null) => {
  const c7ToS1Distance = Math.abs(c7Vertebra.x - s1Vertebra.x);
  const apexToMidlineDistance = Math.abs(apexVertebra.x - (c7Vertebra.x + s1Vertebra.x) / 2);
  
  if (ctx) {
    const midline = { x: (c7Vertebra.x + s1Vertebra.x) / 2, y: apexVertebra.y };
    drawVerticalLine(ctx, midline, "gray", 1);
    drawLine(ctx, apexVertebra, midline, "orange", 2);
    drawAngleLabel(ctx, 
      { x: (apexVertebra.x + midline.x) / 2, y: apexVertebra.y - 20 },
      `AVT: ${apexToMidlineDistance.toFixed(1)} mm`, "orange"
    );
  }
  
  return apexToMidlineDistance;
};

export const calculatePO = (leftIliacCrest, rightIliacCrest, ctx = null) => {
  const angle = angleWithHorizontal(leftIliacCrest, rightIliacCrest);
  
  if (ctx) {
    drawLine(ctx, leftIliacCrest, rightIliacCrest, "brown", 2);
    const horizontalRef = { x: rightIliacCrest.x + 50, y: rightIliacCrest.y };
    drawLine(ctx, rightIliacCrest, horizontalRef, "gray", 1);
    drawAngleArc(ctx, rightIliacCrest, leftIliacCrest, horizontalRef, 30, "brown");
    const labelPos = midpoint(leftIliacCrest, rightIliacCrest);
    drawAngleLabel(ctx, { x: labelPos.x, y: labelPos.y - 30 }, `PO: ${angle.toFixed(1)}°`, "brown");
  }
  
  return angle;
};

// VBM Parameters
export const VBM = (vertebraOutline, ctx = null) => {
  if (!vertebraOutline || vertebraOutline.length < 4) return null;
  
  // Calculate area using shoelace formula
  let area = 0;
  for (let i = 0; i < vertebraOutline.length; i++) {
    const j = (i + 1) % vertebraOutline.length;
    area += vertebraOutline[i].x * vertebraOutline[j].y;
    area -= vertebraOutline[j].x * vertebraOutline[i].y;
  }
  area = Math.abs(area) / 2;
  
  if (ctx) {
    // Draw outline
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vertebraOutline[0].x, vertebraOutline[0].y);
    for (let i = 1; i < vertebraOutline.length; i++) {
      ctx.lineTo(vertebraOutline[i].x, vertebraOutline[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Calculate centroid for label
    const centroid = {
      x: vertebraOutline.reduce((sum, p) => sum + p.x, 0) / vertebraOutline.length,
      y: vertebraOutline.reduce((sum, p) => sum + p.y, 0) / vertebraOutline.length
    };
    
    drawAngleLabel(ctx, centroid, `VBM: ${area.toFixed(1)} mm²`, "purple");
  }
  
  return { area, centroid: vertebraOutline.reduce((sum, p) => ({ x: sum.x + p.x, y: sum.y + p.y }), { x: 0, y: 0 }) };
};

export const handleOutlineDrag = (outline, dragIndex, newPosition) => {
  if (dragIndex >= 0 && dragIndex < outline.length) {
    outline[dragIndex] = newPosition;
  }
  return outline;
};

export const getOutlineArea = (outline) => {
  if (!outline || outline.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < outline.length; i++) {
    const j = (i + 1) % outline.length;
    area += outline[i].x * outline[j].y;
    area -= outline[j].x * outline[i].y;
  }
  return Math.abs(area) / 2;
};
