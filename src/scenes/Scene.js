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

    onWindowResize(screenWidth, screenHeight) {}

    onSceneResize(sceneWidth, sceneHeight) {}

    onKeyDown(key) {}

    onMousePointerDown(x, y) {}

    destroy(options) {
        super.destroy(options);
    }
}