import { PathInterpolationStrategy } from "./motion/PathInterpol.js";
import { FlyingObject, FlyingObjectTypes } from "./FlyingObject.js";
import { lerp } from "./Util.js"

export const GameMode = Object.freeze({
    PATH_INTERPOLATION: Symbol("pathInterpolation"),
    PARTICLE_DYNAMICS: Symbol("particleDynamics"),
    RIGID_BODY: Symbol("rigidBody")
});

export class Game {
    #gameMode;
    #screenWidth;
    #screenHeight;
    #flyingObjects = [];
    #motionStrategy;

    #spawnOpportunityTimeStep = 250; // attempt to spawn new flying objects every 250ms
    #timeSinceLastSpawnOpportunity = 0;
    #targetFlyingObjectCount = 10;
    #maxFlyingObjectCount = 15;

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

    resizeScreen(newScreenWidth, newScreenHeight) {
        this.#screenWidth = newScreenWidth;
        this.#screenHeight = newScreenHeight;
        this.#motionStrategy.screenWidth = newScreenWidth;
        this.#motionStrategy.screenHeight = newScreenHeight;
    }

    shoot(x, y) {
        // TODO
    }

    get flyingObjects() {
        return this.#flyingObjects;
    }
}