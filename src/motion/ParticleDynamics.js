import { MotionStrategy } from "./MotionStrategy.js";
import { FlyingObject, FlyingObjectTypes } from "../FlyingObject.js";

export class ParticleDynamicsStrategy extends MotionStrategy {
    #forceSources;

    constructor(screenWidth, screenHeight, forceSources) {
        super(screenWidth, screenHeight);
        this.#forceSources = forceSources;
    }

    setupInitialState(flyingObject) {
        let {x, y, velocity} = this.#generateRandomSpawnPosition();
        flyingObject.x = x;
        flyingObject.y = y;
        flyingObject.rotation = 0;
        flyingObject.scale = 1;
        flyingObject.motionState = {
            mass: 0.5 + Math.random(), // we use a random weight between 0.5 and 1.5
            velocity: velocity,
            force: [0, 0],
            remainingLifeTime: 5000 + Math.random() * 5000
        };
    }

    advanceStates(flyingObjects, timeDelta) {
        for (const flyingObject of flyingObjects) {
            flyingObject.motionState.remainingLifeTime -= timeDelta;

            flyingObject.motionState.force = [0, 0];
            for (const forceSource of this.#forceSources)
            {
                forceSource.applyTo(flyingObject);
            }
            if (flyingObject.motionState.remainingLifeTime <= 0) {
                // Make sure objects start to fly away when their lifetime is over
                flyingObject.motionState.velocity = math.multiply(flyingObject.motionState.velocity, 1.01);
            }
            this.#solve(flyingObject, timeDelta / 1000);
        }
    }

    getForceField(gridSize = 100) {
        let forceField = [];
        for (let y = 0; y < this.screenHeight; y += gridSize) {
            for (let x = 0; x < this.screenWidth; x += gridSize) {
                let dummyObject = new FlyingObject(FlyingObjectTypes.burger);
                dummyObject.x = x;
                dummyObject.y = y;
                dummyObject.motionState = {
                    mass: 1,
                    velocity: [0, 0],
                    force: [0, 0]
                };

                for (const forceSource of this.#forceSources)
                {
                    forceSource.applyTo(dummyObject);
                }
                forceField.push({x: x, y: y, force: dummyObject.motionState.force});
            }
        }
        return forceField;
    }

    #solve(particle, dt) {
        // Basic Euler integration
        const state = { // in phase space
            x: [particle.x, particle.y],
            v: particle.motionState.velocity
        };

        const {dx, dv} = this.#derivative(state, particle);
        state.x = math.add(state.x, math.multiply(dt, dx));
        state.v = math.add(state.v, math.multiply(dt, dv));

        particle.x = state.x[0]
        particle.y = state.x[1]
        particle.motionState.velocity = state.v;
    }

    #derivative(state, particle) {
        const a = math.divide(particle.motionState.force, particle.motionState.mass);
        return {
            dx: state.v,
            dv: a
        };
    }

    #generateRandomSpawnPosition() {
        const side = Math.floor(Math.random() * 2); // TODO: revert to random
        let x, y, velocity;

        switch (side) {
            case 0: // from right
                x = this.screenWidth + 50; y = Math.random() * this.screenHeight;
                velocity = [-400, (Math.random() - 0.5) * 200];
                break;
            case 1: // from left
                x = -50; y = Math.random() * this.screenHeight;
                velocity = [400, (Math.random() - 0.5) * 200];
                break;
        }

        return {x, y, velocity};
    }
}
