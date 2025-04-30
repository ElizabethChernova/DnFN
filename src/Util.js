// Simple linear interpolation between a and b with parameter t = [0,1]
export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

// Distance between two points (x1, y1) and (x2, y2)
export function pointDistance(x1, y1, x2, y2) {
    const x = x2 - x1;
    const y = y2 - y1;
    return Math.sqrt(x*x + y*y);
}