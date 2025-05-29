import { Visualizer } from "./Visualizer.js";

export class ParticleDynamicsVisualizer extends Visualizer {
    #forceFieldContainer = null;
    #forceFieldScreenWidth = 0;
    #forceFieldScreenHeight = 0;

    displayForceField = false;
    displayParticleTrail = false;

    drawTo(container) {
        if (this.displayForceField) this.#drawForceFieldTo(container);
        if (this.displayParticleTrail) this.#drawParticleTrailTo(container);
    }

    #drawForceFieldTo(container) {
        // The force field visualization is only created once (and on screen resize), since it never changes
        if (!this.#forceFieldContainer ||
            this.motionStrategy.screenWidth !== this.#forceFieldScreenWidth ||
            this.motionStrategy.screenHeight !== this.#forceFieldScreenHeight)
        {
            this.#forceFieldContainer = new PIXI.Container();
            let forceField = this.motionStrategy.getForceField(50);
            for (let forceSample of forceField) {
                this.#drawForceIndicator(forceSample.x, forceSample.y, forceSample.force[0], forceSample.force[1]);
            }

            this.#forceFieldScreenWidth = this.motionStrategy.screenWidth;
            this.#forceFieldScreenHeight = this.motionStrategy.screenHeight;
        }

        container.addChild(this.#forceFieldContainer);
    }

    #drawForceIndicator(x, y, force_x, force_y) {
        let scaling = 0.05; // scale force vectors, otherwise they would be too long
        const tipX = x + force_x * scaling;
        const tipY = y + force_y * scaling;
        const angle = Math.atan2(force_y, force_x);

        let line = new PIXI.Graphics()
            .moveTo(x, y)
            .lineTo(tipX, tipY)
            .stroke({ color: 0x7fe368, pixelLine: false, width: 1.5 });
        this.#forceFieldContainer.addChild(line);

        const arrowSize = 5;
        const arrowHead = new PIXI.Graphics()
            .moveTo(0, 0)
            .lineTo(-arrowSize, arrowSize / 2)
            .lineTo(-arrowSize, -arrowSize / 2)
            .lineTo(0, 0)
            .fill(0x7fe368);

        // Position at arrow tip
        arrowHead.x = tipX;
        arrowHead.y = tipY;

        // Rotate to match force direction
        arrowHead.rotation = angle;

        this.#forceFieldContainer.addChild(arrowHead);
    }

    #drawParticleTrailTo(container) {
        let flyingObjects = this.game.flyingObjects;
        for (let flyingObject of flyingObjects) {
            this.#updateFlyingObjectTrail(flyingObject);
            container.addChild(flyingObject.motionState.trail);
        }
    }

    #updateFlyingObjectTrail(flyingObject) {
        if (!("trail" in flyingObject.motionState)) {
            // Add members to keep track of trail to new flying objects
            flyingObject.motionState.trail = new PIXI.Graphics();
            flyingObject.motionState.trailPoints = [];
            flyingObject.motionState.trailColor = this.#generateRandomColor();
        }

        if (flyingObject.motionState.trailPoints.length === 0) {
            flyingObject.motionState.trailPoints.push({x: flyingObject.x, y: flyingObject.y});
            return;
        }

        const lastPoint = flyingObject.motionState.trailPoints.slice(-1)[0];
        if (math.distance([lastPoint.x, lastPoint.y], [flyingObject.x, flyingObject.y]) > 5) {
            flyingObject.motionState.trailPoints.push({x: flyingObject.x, y: flyingObject.y});
        }

        // Regenerate Line Graphic
        flyingObject.motionState.trail.clear();
        flyingObject.motionState.trail.moveTo(
            flyingObject.motionState.trailPoints[0].x,
            flyingObject.motionState.trailPoints[0].y);
        for (let i = 1; i < flyingObject.motionState.trailPoints.length; i++) {
            flyingObject.motionState.trail.lineTo(
                flyingObject.motionState.trailPoints[i].x,
                flyingObject.motionState.trailPoints[i].y)
                .stroke({width: 2, color: flyingObject.motionState.trailColor});
        }
    }

    #generateRandomColor() {
        return new PIXI.Color({ h: Math.random() * 255, s: 100, l: 50, a: 1 });
    }
}