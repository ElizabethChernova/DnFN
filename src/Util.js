// Simple linear interpolation between a and b with parameter t = [0,1]
export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}