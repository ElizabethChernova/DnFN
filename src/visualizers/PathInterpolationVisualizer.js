import { Visualizer } from "./Visualizer.js";
export class PathInterpolationVisualizer extends Visualizer {
    #trajectoryContainer = null;
    #trajectoryScreenWidth = 0;
    #trajectoryScreenHeight = 0;

    displayPath = false;

    drawTo(container) {

        if (!this.#trajectoryContainer) {
            this.#trajectoryContainer = new PIXI.Container();
        } else {
            this.#trajectoryContainer.removeChildren();
        }
this.#drawForceIndicator(this.#trajectoryContainer, 100, 100, 50, 0);
        if (!this.flyingObjects || this.flyingObjects.length === 0) {
            // Немає об'єктів — нічого малювати
            return;
        }

        for (const flyingObject of this.flyingObjects) {
            const path = this.motionStrategy.getPathForObject(flyingObject);
            if (!path || path.length < 2) continue;

            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i + 1];
                this.#drawForceIndicator(this.#trajectoryContainer, p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
            }
        }

        if (this.displayPath) {
            container.addChild(this.#trajectoryContainer);
        }
    }

    #drawForceIndicator(container, x, y, force_x, force_y) {
        let scaling = 1;
        const tipX = x + force_x * scaling;
        const tipY = y + force_y * scaling;
        const angle = Math.atan2(force_y, force_x);

        let line = new PIXI.Graphics()
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

        arrowHead.x = tipX;
        arrowHead.y = tipY;
        arrowHead.rotation = angle;

        container.addChild(arrowHead);
    }
}
