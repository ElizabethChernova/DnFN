import { MotionStrategy } from "./MotionStrategy.js";
import { FlyingObject, FlyingObjectTypes } from "../FlyingObject.js";

// Small helper class encoding the state of a particle in phase space at time t and its mass.
class ParticleState {
    position; // x(t) i.e. position of the particle
    velocity; // v(t) i.e. velocity of particle
    mass; // mass m of the particle
    constructor(position, velocity, mass) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
    }
}

export class ParticleDynamicsStrategy extends MotionStrategy {
    integrationMethod = "euler";
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

            if (flyingObject.motionState.remainingLifeTime <= 0) {
                // Make sure objects start to fly away when their lifetime is over
                const speedUpFactor = 1 + 0.001 * timeDelta;
                flyingObject.motionState.velocity = math.multiply(flyingObject.motionState.velocity, speedUpFactor);
            }

            if (this.integrationMethod === "euler") {
                this.#solveEuler(flyingObject, timeDelta / 1000);
            }
            else if (this.integrationMethod === "rk4") {
                this.#solveRK4(flyingObject, timeDelta / 1000);
            }
            else {
                throw new Error("Unknown integration method " + this.integrationMethod);
            }
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

    #extractStateFrom(flyingObject) {
        return new ParticleState(
            [flyingObject.x, flyingObject.y],
            [...flyingObject.motionState.velocity],
            flyingObject.motionState.mass);
    }

    #applyStateTo(flyingObject, state) {
        flyingObject.x = state.position[0];
        flyingObject.y = state.position[1];
        flyingObject.motionState.velocity = [...state.velocity];
        flyingObject.motionState.mass = state.mass;
    }

    #accumulateForces(state) {
        let dummyFlyingObject = new FlyingObject();
        dummyFlyingObject.x = state.position[0];
        dummyFlyingObject.y = state.position[1];
        dummyFlyingObject.motionState = {
            mass: state.mass,
            velocity: [...state.velocity],
            force: [0, 0]
        };
        for (const forceSource of this.#forceSources)
        {
            forceSource.applyTo(dummyFlyingObject);
        }
        return [...dummyFlyingObject.motionState.force];
    }

    #solveEuler(particle, dt) {
        const state = this.#extractStateFrom(particle);
        const {dPosition, dVelocity} = this.#derivativeFunction(state);

        particle.motionState.velocity[0] += dVelocity[0] * dt;
        particle.motionState.velocity[1] += dVelocity[1] * dt;
        particle.x += dPosition[0] * dt;
        particle.y += dPosition[1] * dt;
    }

    #solveRK4(particle, dt) {
        const initialState = this.#extractStateFrom(particle);

        // Small helper function to make code look less awful
        const addMultiply = (addend, factor_1, factor_2) =>
            math.add(addend, math.multiply(factor_1, factor_2));

        const k1 = this.#derivativeFunction(initialState);

        const k2 = this.#derivativeFunction(
            this.#applyDerivativeToState(initialState, k1, dt / 2)
        );

        const k3 = this.#derivativeFunction(
            this.#applyDerivativeToState(initialState, k2, dt / 2)
        );

        const k4 = this.#derivativeFunction(
            this.#applyDerivativeToState(initialState, k3, dt)
        );

        const dPosition = math.multiply(
            math.add(
                k1.dPosition,
                math.multiply(2, k2.dPosition),
                math.multiply(2, k3.dPosition),
                k4.dPosition
            ),
            dt / 6
        );
        const dVelocity = math.multiply(
            math.add(
                k1.dVelocity,
                math.multiply(2, k2.dVelocity),
                math.multiply(2, k3.dVelocity),
                k4.dVelocity
            ),
            dt / 6
        );

        const newState = this.#applyDerivativeToState(initialState, {dPosition, dVelocity}, 1);
        this.#applyStateTo(particle, newState);
    }

    #derivativeFunction(state) {
        const totalForce = this.#accumulateForces(state);
        const a = math.divide(totalForce, state.mass);
        return { dPosition: [...state.velocity], dVelocity: [...a] };
    }

    #applyDerivativeToState(state, derivative, dt) {
        let newState = new ParticleState();
        newState.position = math.add(state.position, math.multiply(derivative.dPosition, dt));
        newState.velocity = math.add(state.velocity, math.multiply(derivative.dVelocity, dt));
        newState.mass = state.mass;
        return newState;
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
