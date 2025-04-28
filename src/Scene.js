export class Scene extends PIXI.Container {
    sceneManager;

    constructor(sceneManager) {
        super();
        this.sceneManager = sceneManager;
    }

    async init() {}

    enterScene(options) {}

    animationUpdate(deltaTime) {}

    exitScene() {}

    onWindowResize(newWidth, newHeight) {}

    onKeyDown(key) {}

    onMousePointerDown(x, y) {}

    destroy(options) {
        super.destroy(options);
    }
}