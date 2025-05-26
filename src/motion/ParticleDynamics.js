import { MotionStrategy } from "./MotionStrategy.js";
import { FlyingObject, FlyingObjectTypes } from "../FlyingObject.js";

export class ParticleDynamicsStrategy extends MotionStrategy {
    #forceSources;

    constructor(screenWidth, screenHeight, forceSources) {
        super(screenWidth, screenHeight);
        this.#forceSources = forceSources;
    }

    setupInitialState(flyingObject) {
        let {x, y} = this.#generateRandomSpawnPosition();
        flyingObject.x = x;
        flyingObject.y = y;
        flyingObject.rotation = 0;
        flyingObject.scale = 1;
        flyingObject.motionState = {
            mass: 0.5 + Math.random() * 0.5,
            velocity: [-500, (Math.random() - 0.5) * 200],
            force: [0, 0]
        };
    }

    advanceStates(flyingObjects, timeDelta) {
        for (const flyingObject of flyingObjects) {
            for (const forceSource of this.#forceSources)
            {
                forceSource.applyTo(flyingObject);
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
        const side = 0 //Math.floor(Math.random() * 2); // TODO: revert to random
        let x, y;

        switch (side) {
            case 0: x = this.screenWidth + 50; y = Math.random() * this.screenHeight; break; // from right
            case 1: x = -50; y = Math.random() * this.screenHeight; break; // from left
        }

        return {x, y};
    }
}
