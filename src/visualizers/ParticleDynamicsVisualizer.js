import { Visualizer } from "./Visualizer.js";

export class ParticleDynamicsVisualizer extends Visualizer {
    #forceFieldContainer = null;
    #forceFieldScreenWidth = 0;
    #forceFieldScreenHeight = 0;

    displayForceField = false;

    drawTo(container) {
        // The force field visualization is only created once (and on screen resize), since it never changes
        if (!this.#forceFieldContainer ||
            this.motionStrategy.screenWidth !== this.#forceFieldScreenWidth ||
            this.motionStrategy.screenHeight !== this.#forceFieldScreenHeight)
        {
            this.#forceFieldContainer = new PIXI.Container();
            let forceField = this.motionStrategy.getForceField(50);
            for (let forceSample of forceField) {
                this.#drawForceIndicator(this.#forceFieldContainer, forceSample.x, forceSample.y, forceSample.force[0], forceSample.force[1]);
            }

            this.#forceFieldScreenWidth = this.motionStrategy.screenWidth;
            this.#forceFieldScreenHeight = this.motionStrategy.screenHeight;
        }

        if (this.displayForceField) container.addChild(this.#forceFieldContainer);
    }

    #drawForceIndicator(container, x, y, force_x, force_y) {
        let scaling = 1.75; // scale force vectors, otherwise they would be too short to see
        const tipX = x + force_x * scaling;
        const tipY = y + force_y * scaling;
        const angle = Math.atan2(force_y, force_x);

        let line = new PIXI.Graphics()
            //.circle(x, y, 2).fill("0xFFFFFF")
            .moveTo(x, y)
            .lineTo(tipX, tipY)
            .stroke({ color: 0x7fe368, pixelLine: false, width: 1.5 });
        container.addChild(line);

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

        container.addChild(arrowHead);
    }
}