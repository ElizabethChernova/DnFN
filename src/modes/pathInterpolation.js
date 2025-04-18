// Функція генерує випадковий шлях
export function generateRandomPath(width, height, startPosition) {
    const path = [startPosition];
    // Додаємо випадкові контрольні точки
    path.push({ x: Math.random() * width, y: Math.random() * height });
    path.push({ x: Math.random() * width, y: Math.random() * height });

    return path;
}

// Функція для обчислення поточної точки на шляху на основі прогресу
export function getPointOnPath(path, progress) {
    const p0 = path[0];
    const p1 = path[1];
    const p2 = path[2];

    const x = (1 - progress) * (1 - progress) * p0.x + 2 * (1 - progress) * progress * p1.x + progress * progress * p2.x;
    const y = (1 - progress) * (1 - progress) * p0.y + 2 * (1 - progress) * progress * p1.y + progress * progress * p2.y;

    return { x, y };
}


// Catmull-Rom інтерполяція між 4 точками
function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
    };
}
