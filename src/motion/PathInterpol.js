import { MotionStrategy } from "./MotionStrategy.js";

export class PathInterpolationStrategy extends MotionStrategy {
    speed = 0.0005;

    constructor(screenWidth, screenHeight) {
        super(screenWidth, screenHeight);
    }

    setupInitialState(flyingObject) {
        let {x, y} = this.#generateRandomSpawnPosition();
        flyingObject.x = x;
        flyingObject.y = y;
        flyingObject.rotation = 0;
        flyingObject.scale = 1;
        flyingObject.motionState = { path: this.#generateRandomPath({x, y}), pathProgress: 0 };
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

            const position = this.#getPointOnPath(
                flyingObject.motionState.path,
                flyingObject.motionState.pathProgress);
            flyingObject.x = position.x;
            flyingObject.y = position.y;
        }
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
        // Add random control points
        path.push({ x: Math.random() * this.screenWidth, y: Math.random() * this.screenHeight });
        path.push({ x: Math.random() * this.screenWidth, y: Math.random() * this.screenHeight });

        return path;
    }

    #getPointOnPath(path, progress) {
        // Function for calculating the current point on the path based on progress
        const p0 = path[0];
        const p1 = path[1];
        const p2 = path[2];

        const x = (1 - progress) * (1 - progress) * p0.x + 2 * (1 - progress) * progress * p1.x + progress * progress * p2.x;
        const y = (1 - progress) * (1 - progress) * p0.y + 2 * (1 - progress) * progress * p1.y + progress * progress * p2.y;

        return { x, y };
    }

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
