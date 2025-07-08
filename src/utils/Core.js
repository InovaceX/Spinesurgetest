// 📐 Basic Geometry Utilities

export const midpoint = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const vector = (a, b) => ({
  x: b.x - a.x,
  y: b.y - a.y,
});
 
export const normalizeVector = (v) => {
  const len = Math.hypot(v.x, v.y) || 1e-6;
  return { x: v.x / len, y: v.y / len };
};

export const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

export const lengthBetweenPoints = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

export const lengthPointToLine = (pt, [a, b]) => {
  const num = Math.abs((b.y - a.y) * pt.x - (b.x - a.x) * pt.y + b.x * a.y - b.y * a.x);
  const den = Math.hypot(b.y - a.y, b.x - a.x);
  return num / (den || 1e-6);
};

// 🧭 Angle Computations

// Angle between line AB and horizontal axis (acute angle 0-90°)
export const angleWithHorizontal = (a, b) => {
  if (!a || !b) return 0;
  const dy = b.y - a.y;
  const dx = b.x - a.x;
  const angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
  // Return acute angle (0-90°)
  return angle > 90 ? 180 - angle : angle;
};

// Angle between line AB and vertical axis (acute angle 0-90°)
export const angleWithVertical = (a, b) => {
  if (!a || !b) return 0;
  const dy = b.y - a.y;
  const dx = b.x - a.x;
  const angle = Math.abs((Math.atan2(dx, dy) * 180) / Math.PI);
  // Return acute angle (0-90°)
  return angle > 90 ? 180 - angle : angle;
};

// Angle ABC (angle at point B)
export const angleABC = (a, b, c) => {
  if (!a || !b || !c) return 0;
  const ba = vector(b, a);
  const bc = vector(b, c);
  const dot = dotProduct(ba, bc);
  const magBA = Math.hypot(ba.x, ba.y);
  const magBC = Math.hypot(bc.x, bc.y);
  const cosTheta = dot / (magBA * magBC || 1e-6);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
};

// Cobb angle between two lines
export const cobbAngle = (line1, line2) => {
  if (!line1 || !line2 || line1.length !== 2 || line2.length !== 2) return 0;
  const v1 = vector(line1[0], line1[1]);
  const v2 = vector(line2[0], line2[1]);
  const dot = Math.abs(dotProduct(v1, v2));
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  const cosTheta = dot / (mag1 * mag2 || 1e-6);
  const angle = Math.acos(Math.max(0, Math.min(1, cosTheta))) * (180 / Math.PI);
  return Math.min(angle, 180 - angle);
};

// Angle between two vectors
export const angleBetweenVectors = (v1, v2) => {
  const dot = dotProduct(v1, v2);
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  const cosTheta = dot / (mag1 * mag2 || 1e-6);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
};

// Line intersection
export const lineIntersection = (line1, line2) => {
  const [p1, p2] = line1;
  const [p3, p4] = line2;
  
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 1e-6) return null; // Lines are parallel
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  };
};
