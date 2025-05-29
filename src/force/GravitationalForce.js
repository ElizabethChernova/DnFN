import { ForceSource } from "./ForceSource.js";

export class GravitationalForce extends ForceSource {
    imagePath = 'res/planet.png';
    strength;

    /**
     * @param x X-coordinate of center of the gravitational field.
     * @param y Y-coordinate of center of the gravitational field.
     * @param strength Strength of the gravitational field. To simulate earth's gravity set to
     * G * m_earth = 3.98601877e14 (assuming pixels=meters).
     */
    constructor(x, y, strength) {
        super();
        this.strength = strength;
        this.x = x;
        this.y = y;
    }

    applyTo(flyingObject) {
        let gravityCenter = [this.x, this.y];
        let particlePosition = [flyingObject.x, flyingObject.y];
        let distance = math.distance(gravityCenter, particlePosition);
        // Note: the distance term in the denominator is capped to avoid divisions by zero and extreme acceleration when
        // objects get close to the gravitational center
        let magnitude = (this.strength * flyingObject.motionState.mass) / Math.max(distance * distance, 200 * 200);
        let direction = math.subtract(gravityCenter, particlePosition);
        direction = math.divide(direction, math.norm(direction));

        let force = math.multiply(direction, magnitude);
        flyingObject.motionState.force = math.add(flyingObject.motionState.force, force);
    }
}