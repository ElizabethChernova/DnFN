import { MotionStrategy } from "./MotionStrategy.js";

export class PathInterpolationStrategy extends MotionStrategy {
    constructor(screenWidth, screenHeight, speed= 0.0001) {
        super(screenWidth, screenHeight);
        this.speed = speed;
    }

    setupInitialState(flyingObject) {
        let {x, y} = this.#generateRandomSpawnPosition();
        flyingObject.x = x;
        flyingObject.y = y;
        flyingObject.rotation = 0;
        flyingObject.scale = 1;
        //flyingObject.motionState = { path: this.#generateRandomPath({x, y}), pathProgress: 0 };
        const path = this.#generateRandomPath({ x, y });

        flyingObject.motionState = {
            path: path,
            pathProgress: 0,
        };

    }

    advanceStates(flyingObjects, timeDelta) {
        for (const flyingObject of flyingObjects) {
            const progressDelta = this.speed * timeDelta;
            flyingObject.motionState.pathProgress += progressDelta;

            if (flyingObject.motionState.pathProgress > 1) {
                // Slightly dirty hack: if the object has reached the end of its path, move it outside the screen to
                // force the Game to remove it
                flyingObject.x = -1000;
                flyingObject.y = -1000;
                continue;
            }
//here
            const prevX = flyingObject.x;
            const prevY = flyingObject.y;
            const position = this.#getPointOnPath(
                flyingObject.motionState.path,
                flyingObject.motionState.pathProgress);
            flyingObject.x = position.x;
            flyingObject.y = position.y;
            //here
              // Опціонально: обертання в напрямку руху
            const dx = position.x - prevX;
            const dy = position.y - prevY;
            flyingObject.rotation = Math.atan2(dy, dx);
        }
    }
getPathField(gridSize = 100) {
    const pathField = [];

    // Для сітки по всьому екрану з кроком gridSize
    for (let y = 0; y < this.screenHeight; y += gridSize) {
        for (let x = 0; x < this.screenWidth; x += gridSize) {

            // Створимо штучний початковий шлях, наприклад, починаючи з (x, y)
            // Генеруємо "рандомний" шлях, але щоб він починався з (x, y)
            // Тут використовуємо приватний метод #generateRandomPath, передаючи {x,y} як початок
            const path = this.#generateRandomPath({ x, y });

            // Для спрощення - візьмемо точку на середині шляху (progress = 0.5)
            const midPoint = this.#getPointOnPath(path, 0.5);

            // Додамо об'єкт з координатами та точкою на шляху
            pathField.push({
                startX: x,
                startY: y,
                midPointX: midPoint.x,
                midPointY: midPoint.y,
                path: path // Якщо хочеш, можна повернути весь шлях
            });
        }
    }

    return pathField;
}

    #generateRandomSpawnPosition() {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
            case 0: x = Math.random() * this.screenWidth; y = -50; break; // from top
            case 1: x = Math.random() * this.screenWidth; y = this.screenHeight + 50; break; // from bottom
            case 2: x = -50; y = Math.random() * this.screenHeight; break; // from left
            case 3: x = this.screenWidth + 50; y = Math.random() * this.screenHeight; break; // from right
        }

        return {x, y};
    }

    #generateRandomPath(startPosition) {
         const path = [startPosition];

         const controlPointCount = 4 + Math.floor(Math.random() * 3);
         for (let i = 0; i < controlPointCount; i++) {
             path.push({
                 x: Math.random() * this.screenWidth,
                 y: Math.random() * this.screenHeight
             });
         }
//here
// Генеруємо останню точку поза межами екрану
    const offset = 100;
    const side = Math.floor(Math.random() * 4);
    let lastX, lastY;

    switch (side) {
        case 0: // зверху
            lastX = Math.random() * this.screenWidth;
            lastY = -offset;
            break;
        case 1: // знизу
            lastX = Math.random() * this.screenWidth;
            lastY = this.screenHeight + offset;
            break;
        case 2: // зліва
            lastX = -offset;
            lastY = Math.random() * this.screenHeight;
            break;
        case 3: // справа
            lastX = this.screenWidth + offset;
            lastY = Math.random() * this.screenHeight;
            break;
    }

    path.push({ x: lastX, y: lastY });
        const first = path[0];
        const second = path[1];
        const penultimate = path[path.length - 2];
        const last = path[path.length - 1];

        path.unshift({ x: 2 * first.x - second.x, y: 2 * first.y - second.y });
        path.push({ x: 2 * last.x - penultimate.x, y: 2 * last.y - penultimate.y });


        return path;
     }
    #getPointOnPath(path, progress) {
        const numSegments = path.length - 3; // catmull-rom needs 4 points per segment
        const segmentProgress = progress * numSegments;
        const segmentIndex = Math.floor(segmentProgress);
        const t = segmentProgress - segmentIndex;
//here
const clampedIndex = Math.min(segmentIndex, path.length - 4);

        const p0 = path[clampedIndex];
        const p1 = path[clampedIndex + 1];
        const p2 = path[clampedIndex + 2];
        const p3 = path[clampedIndex + 3];

        return this.#catmullRom(p0, p1, p2, p3, t);
    }
//    #getPointOnPath(path, progress) {
//        // Function for calculating the current point on the path based on progress
//        const p0 = path[0];
//        const p1 = path[1];
//        const p2 = path[2];
//
//        const x = (1 - progress) * (1 - progress) * p0.x + 2 * (1 - progress) * progress * p1.x + progress * progress * p2.x;
//        const y = (1 - progress) * (1 - progress) * p0.y + 2 * (1 - progress) * progress * p1.y + progress * progress * p2.y;
//
//        return { x, y };
//    }

    // Catmull-Rom interpolation between 4 points
    #catmullRom(p0, p1, p2, p3, t) {
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
}
