import { PathInterpolationStrategy } from "./motion/PathInterpol.js";
import { ParticleDynamicsStrategy } from "./motion/ParticleDynamics.js";
import { FlyingObject, FlyingObjectTypes } from "./FlyingObject.js";
import { ForceSource } from "./force/ForceSource.js";
import { GravitationalForce } from "./force/GravitationalForce.js";
import { DragForce } from "./force/DragForce.js";
import { lerp, pointDistance } from "./Util.js"

export const GameMode = Object.freeze({
    PATH_INTERPOLATION: Symbol("pathInterpolation"),
    PARTICLE_DYNAMICS: Symbol("particleDynamics"),
    RIGID_BODY: Symbol("rigidBody")
});

export class Game {
    #gameMode;
    #screenWidth;
    #screenHeight;
    #motionStrategy;

    #flyingObjects = [];
    #forceSources = [];

    #spawnOpportunityTimeStep = 250; // attempt to spawn new flying objects every 250ms
    #timeSinceLastSpawnOpportunity = 0;
    #targetFlyingObjectCount = 10;
    #maxFlyingObjectCount = 15;

    #remainingTime = 60; // [s] // TODO: actually limit time
    #score = 0;

    isPaused = false;

    constructor(gameMode, screenWidth, screenHeight) {
        console.assert(Object.values(GameMode).includes(gameMode), "Invalid game mode specifier");
        this.#gameMode = gameMode;
        this.#screenWidth = screenWidth;
        this.#screenHeight = screenHeight;

        switch (gameMode) {
            case GameMode.PATH_INTERPOLATION:
                this.#motionStrategy = new PathInterpolationStrategy(screenWidth, screenHeight);
                break;
            case GameMode.PARTICLE_DYNAMICS:
                this.populateForceSources();
                this.#motionStrategy = new ParticleDynamicsStrategy(screenWidth, screenHeight, this.#forceSources);
                break;
            default:
                throw new Error(`Game mode "${gameMode}" is not yet implemented`);
        }
    }

    animationUpdate(deltaTime) {
        if (this.isPaused) return;

        this.#motionStrategy.advanceStates(this.#flyingObjects, deltaTime);

        // Remove objects that moved outside the screen
        const offset = 500; // how far objects must be outside the screen to be removed
        this.#flyingObjects = this.#flyingObjects.filter(entry =>
            entry.x > -offset && entry.x < this.#screenWidth + offset &&
            entry.y > -offset && entry.y < this.#screenHeight + offset
        );

        // Attempt to spawn a new flying object
        this.#timeSinceLastSpawnOpportunity += deltaTime;
        if (this.#timeSinceLastSpawnOpportunity > this.#spawnOpportunityTimeStep)
        {
            this.trySpawnFlyingObject();
            this.#timeSinceLastSpawnOpportunity = 0;
        }
    }

    trySpawnFlyingObject() {
        const spawnProbability = this.calculateSpawnProbability();

        // Determine whether we should spawn by rolling a die
        if (Math.random() >= spawnProbability) return;

        // Spawn new flying object
        const flyingObjectTypeKeys = Object.keys(FlyingObjectTypes);
        const newFlyingObjectKey = flyingObjectTypeKeys[Math.floor(Math.random() * flyingObjectTypeKeys.length)];
        let newFlyingObject = new FlyingObject(FlyingObjectTypes[newFlyingObjectKey]);

        this.#motionStrategy.setupInitialState(newFlyingObject);
        this.#flyingObjects.push(newFlyingObject);
    }

    calculateSpawnProbability() {
        const maxSpawnProbability = 0.4;
        const minSpawnProbability = 0.025;

        const flyingObjectCount = this.#flyingObjects.length;
        if (flyingObjectCount > this.#maxFlyingObjectCount) return 0; // don't spawn anything

        const t = Math.min(flyingObjectCount / this.#targetFlyingObjectCount, 1);
        return lerp(maxSpawnProbability, minSpawnProbability, t);
    }

    populateForceSources() {
        // TODO: replace with more meaningful initialization
        this.#forceSources.push(new GravitationalForce(500, 500, 5e5));
        this.#forceSources.push(new DragForce(0.0015));
    }

    resizeScreen(newScreenWidth, newScreenHeight) {
        this.#screenWidth = newScreenWidth;
        this.#screenHeight = newScreenHeight;
        this.#motionStrategy.screenWidth = newScreenWidth;
        this.#motionStrategy.screenHeight = newScreenHeight;
    }

    shoot(x, y) {
        // TODO: fix ordering issue (click should hit topmost object)
        for (const flyingObject of this.#flyingObjects) {
            let hit = false;
            switch (flyingObject.typeDefinition.shape) {
                case "circle":
                    hit = this.#isCircularObjectHit(flyingObject, x, y);
                    break;
                case "rectangle":
                    hit = this.#isRectangularObjectHit(flyingObject, x, y);
                    break;
            }

            if (hit) {
                this.#processHit(flyingObject);
                return;
            }
        }
    }

    get gameMode() {
        return this.#gameMode;
    }

    get flyingObjects() {
        return this.#flyingObjects;
    }

    get forceSources() {
        return this.#forceSources;
    }

    get score() {
        return this.#score;
    }

    // TODO: handle rotation and scale
    #isCircularObjectHit(flyingObject, hit_x, hit_y) {
        const distance = pointDistance(hit_x, hit_y, flyingObject.x, flyingObject.y);
        return distance <= flyingObject.typeDefinition.width / 2;
    }

    // TODO: handle rotation and scale
    #isRectangularObjectHit(flyingObject, hit_x, hit_y) {
        const left = flyingObject.x - flyingObject.typeDefinition.width / 2;
        const right = flyingObject.x + flyingObject.typeDefinition.width / 2;
        const top = flyingObject.y - flyingObject.typeDefinition.height / 2;
        const bottom = flyingObject.y + flyingObject.typeDefinition.height / 2;

        return hit_x >= left && hit_x <= right && hit_y >= top && hit_y <= bottom;
    }

    #processHit(flyingObject) {
        this.#score += flyingObject.typeDefinition.scoreUpdate;
        this.#score = Math.max(this.#score, 0);
        const objectIndex = this.#flyingObjects.indexOf(flyingObject);
        this.#flyingObjects.splice(objectIndex, 1);
    }
}