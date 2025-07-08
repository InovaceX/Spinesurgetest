import {
  vector,
  midpoint,
  angleABC,
  cobbAngle,
  normalizeVector,
  lengthBetweenPoints,
  angleWithHorizontal,
  angleWithVertical,
} from './Core';
  
import {
  drawLine,
  drawArc,
  drawPerpendicular,
  drawAngleArc,
  drawABC,
  drawAngleLabel,
  drawDashedLine,
  drawCobbAngle,
  drawCircle,
  drawEllipse
} from './Canvas';

//Line Tool
export const handleLineTool = (points, ctx) => {
  if (points.length !== 2) return null;
  drawLine(ctx, points[0], points[1], "black", 2);
  const length = lengthBetweenPoints(points[0], points[1]);
  drawAngleLabel(ctx, midpoint(points[0], points[1]), `${length.toFixed(1)} px`, "black");
  return { type: "line", length };
};

// Angle2
export const handleAngleTool2Pt = (points, ctx) => {
  if (points.length !== 2) return null;
  const [p1, p2] = points;
  drawLine(ctx, p1, p2, "black", 2);

  // Dashed reference lines
  drawDashedLine(ctx, p1, { x: p2.x, y: p1.y }, [5, 5], "gray");
  drawDashedLine(ctx, p1, { x: p1.x, y: p2.y }, [5, 5], "gray");

  const horizontalAngle = angleWithHorizontal(p1, p2);
  const verticalAngle = angleWithVertical(p1, p2);

  drawAngleLabel(ctx, { x: p1.x + 30, y: p1.y - 10 }, `H: ${horizontalAngle.toFixed(1)}°`, "blue");
  drawAngleLabel(ctx, { x: p1.x + 30, y: p1.y + 25 }, `V: ${verticalAngle.toFixed(1)}°`, "green");

  return { type: "angle2pt", horizontalAngle, verticalAngle };
};

// Angle3
export const handleAngleTool3Pt = (points, ctx) => {
  if (points.length !== 3) return null;
  const [a, b, c] = points;
  const angle = drawABC(ctx, a, b, c, "blue");
  return { type: "angle3pt", angle };
};

// Angle4 / Cobb
export const handleAngleTool4Pt = (points, ctx) => {
  if (points.length !== 4) return null;
  const line1 = [points[0], points[1]];
  const line2 = [points[2], points[3]];
  const angle = drawCobbAngle(ctx, line1, line2, "red");
  return { type: "cobb", angle };
};

// Multi-Line
export const handleMultiLineTool = (points, ctx) => {
  if (points.length < 2) return null;
  
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    drawLine(ctx, points[i], points[i + 1], "purple", 2);
    totalLength += lengthBetweenPoints(points[i], points[i + 1]);
  }
  
  const center = points[Math.floor(points.length / 2)];
  drawAngleLabel(ctx, center, `Total: ${totalLength.toFixed(1)} px`, "purple");
  
  return { type: "multiline", totalLength, segments: points.length - 1 };
};

// Circle
export const handleCircleTool = (points, ctx) => {
  if (points.length !== 2) return null;
  const [center, edge] = points;
  const radius = lengthBetweenPoints(center, edge);
  
  drawCircle(ctx, center, radius, "blue", 2);
  drawLine(ctx, center, edge, "gray", 1);
  drawAngleLabel(ctx, { x: center.x, y: center.y - radius - 20 }, `R: ${radius.toFixed(1)} px`, "blue");
  
  const area = Math.PI * radius * radius;
  return { type: "circle", radius, area };
};

// Ellipse
export const handleEllipseTool = (points, ctx) => {
  if (points.length !== 3) return null;
  const [center, point1, point2] = points;
  
  const radiusX = lengthBetweenPoints(center, point1);
  const radiusY = lengthBetweenPoints(center, point2);
  
  drawEllipse(ctx, center, radiusX, radiusY, 0, "green", 2);
  drawLine(ctx, center, point1, "gray", 1);
  drawLine(ctx, center, point2, "gray", 1);
  
  drawAngleLabel(ctx, { x: center.x, y: center.y - Math.max(radiusX, radiusY) - 20 }, 
    `${radiusX.toFixed(1)} x ${radiusY.toFixed(1)}`, "green");
  
  const area = Math.PI * radiusX * radiusY;
  return { type: "ellipse", radiusX, radiusY, area };
};

// Polygon (Area)
export const handlePolygonTool = (points, ctx) => {
  if (points.length < 3) return null;
  
  // Draw polygon
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Calculate area using shoelace formula
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  area = Math.abs(area) / 2;
  
  // Find centroid for label
  const centroid = {
    x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length
  };
  
  drawAngleLabel(ctx, centroid, `Area: ${area.toFixed(1)} px²`, "orange");
  
  return { type: "polygon", area, vertices: points.length };
};

// Pencil (Free drawing)
export const handlePencilTool = (points, ctx) => {
  if (points.length < 2) return null;
  
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  
  return { type: "pencil", pointCount: points.length };
};

// Polygon Manager for complex polygons
export class PolygonManager {
  constructor() {
    this.polygons = [];
  }
  
  addPolygon(points) {
    const result = handlePolygonTool(points);
    if (result) {
      this.polygons.push({ points, ...result });
    }
    return result;
  }
  
  clear() {
    this.polygons = [];
  }
  
  getTotalArea() {
    return this.polygons.reduce((sum, poly) => sum + poly.area, 0);
  }
}
