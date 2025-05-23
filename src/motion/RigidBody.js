import { MotionStrategy } from "./MotionStrategy.js";

export class RigidBodyStrategy extends MotionStrategy {
    constructor(screenWidth, screenHeight) {
        super(screenWidth, screenHeight);
    }

    setupInitialState(flyingObject) {
        // TODO: setup initial state of the given flying object
    }

    advanceStates(flyingObjects, timeDelta) {
        // TODO: advance the states of all flyingObjects
    }
}