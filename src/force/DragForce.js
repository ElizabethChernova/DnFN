import { ForceSource } from "./ForceSource.js";

export class DragForce extends ForceSource {
    dragFactor;

    constructor(dragFactor) {
        super();
        this.dragFactor = dragFactor;
    }

    applyTo(flyingObject) {
        let force = math.multiply(-this.dragFactor, flyingObject.motionState.velocity);
        flyingObject.motionState.force = math.add(flyingObject.motionState.force, force);
    }
}