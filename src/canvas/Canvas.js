import {
  vector,
  midpoint,
  normalizeVector,
  angleABC,
  angleBetweenVectors,
} from '../logic/Core';
   
/*LINES*/

// Draw Line
export const drawLine = (ctx, a, b, color = 'black', width = 2) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
};

// Extended Line
export const lineExtend = (ctx, a, b, color = 'black', width = 2) => {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // Calculate the direction vector
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  // Prevent division by zero
  if (dx === 0 && dy === 0) return;

  // Normalize the direction vector
  const length = Math.hypot(dx, dy);
  const dirX = dx / length;
  const dirY = dy / length;

  // Extend far in both directions
  const extendLength = Math.max(canvasWidth, canvasHeight) * 2; // large enough to cover whole canvas

  const startPoint = {
    x: a.x - dirX * extendLength,
    y: a.y - dirY * extendLength
  };

  const endPoint = {
    x: b.x + dirX * extendLength,
    y: b.y + dirY * extendLength
  };

  drawLine(ctx, startPoint, endPoint, color, width);
};

// Vertical Line
export const drawVerticalLine = (ctx, point, color = 'black', width = 2) => {
  const canvasHeight = ctx.canvas.height;
  const startPoint = { x: point.x, y: 0 };
  const endPoint = { x: point.x, y: canvasHeight };
  drawLine(ctx, startPoint, endPoint, color, width);
};

// Horizontal Line
export const drawHorizontalLine = (ctx, point, color = 'black', width = 2) => {
  const canvasWidth = ctx.canvas.width;
  const startPoint = { x: 0, y: point.y };
  const endPoint = { x: canvasWidth, y: point.y };
  drawLine(ctx, startPoint, endPoint, color, width);
};

// Dashed Line
export const drawDashedLine = (ctx, a, b, dashPattern = [5, 5], color = 'black', width = 2) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashPattern);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash pattern
};

// Draw Perpendicular
export const drawPerpendicular = (ctx, lineStart, lineEnd, point, length = 50, color = 'red') => {
  const lineVec = vector(lineStart, lineEnd);
  const perpVec = { x: -lineVec.y, y: lineVec.x };
  const normalizedPerp = normalizeVector(perpVec);
  
  const perpStart = {
    x: point.x - normalizedPerp.x * length / 2,
    y: point.y - normalizedPerp.y * length / 2
  };
  const perpEnd = {
    x: point.x + normalizedPerp.x * length / 2,
    y: point.y + normalizedPerp.y * length / 2
  };
  
  drawLine(ctx, perpStart, perpEnd, color, 2);
};

/*ARCS*/

// Draw Arc between two lines
export const drawArc = (ctx, center, radius, startAngle, endAngle, color = 'blue', width = 2) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAngle, endAngle);
  ctx.stroke();
};

// Draw Angle Arc
export const drawAngleArc = (ctx, vertex, point1, point2, radius = 30, color = 'blue') => {
  const v1 = normalizeVector(vector(vertex, point1));
  const v2 = normalizeVector(vector(vertex, point2));
  
  const angle1 = Math.atan2(v1.y, v1.x);
  const angle2 = Math.atan2(v2.y, v2.x);
  
  let startAngle = Math.min(angle1, angle2);
  let endAngle = Math.max(angle1, angle2);
  
  // Handle angle wrap-around
  if (endAngle - startAngle > Math.PI) {
    [startAngle, endAngle] = [endAngle, startAngle + 2 * Math.PI];
  }
  
  drawArc(ctx, vertex, radius, startAngle, endAngle, color);
};

/*SHAPES*/

// Draw Circle
export const drawCircle = (ctx, center, radius, color = 'black', width = 2, fill = false) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// Draw Ellipse
export const drawEllipse = (ctx, center, radiusX, radiusY, rotation = 0, color = 'black', width = 2) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
  ctx.stroke();
};

/*LABELS*/

// Draw Angle Label
export const drawAngleLabel = (ctx, position, text, color = 'black', fontSize = 16) => {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(text, position.x, position.y);
};

/*SPECIALIZED DRAWING FUNCTIONS*/

// Draw ABC Angle (3-point angle)
export const drawABC = (ctx, a, b, c, color = 'blue') => {
  drawLine(ctx, a, b, color, 2);
  drawLine(ctx, b, c, color, 2);
  drawAngleArc(ctx, b, a, c, 30, color);
  
  const angle = angleABC(a, b, c);
  const labelPos = {
    x: b.x + 40,
    y: b.y - 10
  };
  drawAngleLabel(ctx, labelPos, `${angle.toFixed(1)}°`, color);
  
  return angle;
};

// Draw Cobb Angle
export const drawCobbAngle = (ctx, line1, line2, color = 'red') => {
  const [p1, p2] = line1;
  const [p3, p4] = line2;
  
  drawLine(ctx, p1, p2, color, 3);
  drawLine(ctx, p3, p4, color, 3);
  
  // Draw perpendiculars
  const perp1Start = midpoint(p1, p2);
  const perp2Start = midpoint(p3, p4);
  
  drawPerpendicular(ctx, p1, p2, perp1Start, 100, 'orange');
  drawPerpendicular(ctx, p3, p4, perp2Start, 100, 'orange');
  
  // Calculate and display angle
  const v1 = vector(p1, p2);
  const v2 = vector(p3, p4);
  const perpV1 = { x: -v1.y, y: v1.x };
  const perpV2 = { x: -v2.y, y: v2.x };
  
  const angle = angleBetweenVectors(perpV1, perpV2);
  const cobbAngleValue = Math.min(angle, 180 - angle);
  
  const labelPos = midpoint(perp1Start, perp2Start);
  drawAngleLabel(ctx, labelPos, `Cobb: ${cobbAngleValue.toFixed(1)}°`, color, 18);
  
  return cobbAngleValue;
};

/*UTILITY*/

// Clear Canvas
export const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

// Set Canvas Background
export const setCanvasBackground = (ctx, color = 'white') => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
