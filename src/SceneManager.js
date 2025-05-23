export class SceneManager {
    #app;
    #ticker;
    #scenes = {};
    #currentScene = null;
    #currentSidePanel = null;
    #sidePanelWidth = 400;

    #lastAnimationTime = 0;
    #realFPS = 0;
    #animationCalculationDuration = 0;

    animationRate = 120;

    constructor(app) {
        this.#app = app;

        this.#ticker = new PIXI.Ticker();
        this.#ticker.maxFPS = 0; // don't limit framerate per default
        this.#ticker.add((ticker) => this.update(ticker));
        this.#ticker.start();

        window.addEventListener("resize", () => this.onWindowResize());
        document.addEventListener("keydown", (event) => this.onKeyDown(event));
        document.addEventListener("pointerdown", (event) => this.onMousePointerDown(event));
    }

    update(ticker) {
        if (this.#lastAnimationTime === 0) this.#lastAnimationTime = performance.now();
        this.#realFPS = 1000 / ticker.elapsedMS;

        // Perform animation update(s)
        const animationCalculationStartTime = performance.now();
        const animationTimeStep = 1000 / this.animationRate;
        for (let t = this.#lastAnimationTime + animationTimeStep; t < performance.now(); t += animationTimeStep) {
            const animationTimeDelta = t - this.#lastAnimationTime;
            this.#lastAnimationTime = t;
            if (this.#currentScene) this.#currentScene.animationUpdate(animationTimeDelta);
        }
        this.#animationCalculationDuration = performance.now() - animationCalculationStartTime;

        // Render frame
        this.#app.renderer.render(this.#app.stage);
    }

    registerScene(name, scene) {
        console.assert(scene.sceneManager === this); // make sure scene belongs to this scene manager
        if (name in this.#scenes) this.#scenes[name].destroy({ children: true }); // if scene with same name exists, free it
        this.#scenes[name] = scene;
        console.log(`Registered scene "${name}"`);
    }

    getScene(name) {
        if (!(name in this.#scenes)) {
            console.error(`Scene with name "${name}" doesn't exist`);
            return;
        }
        return this.#scenes[name];
    }

    changeScene(newSceneName, options = {}) {
        if (!(newSceneName in this.#scenes)) {
            console.error(`Scene with name "${newSceneName}" doesn't exist`);
            return;
        }

        if (this.#currentScene) {
            this.#app.stage.removeChild(this.#currentScene);
            const oldScene = this.#currentScene
            this.#currentScene = null;
            oldScene.exitScene();
        }
        this.#scenes[newSceneName].enterScene(options);
        this.#currentScene = this.#scenes[newSceneName];
        this.#app.stage.addChild(this.#currentScene);
        console.log(`Changed to scene "${newSceneName}"`);
        this.updateSceneAndSidePanelBounds();
    }

    displaySidePanel(sidePanelSceneName, options = {}) {
        if (!(sidePanelSceneName in this.#scenes)) {
            console.error(`Scene with name "${sidePanelSceneName}" doesn't exist`);
            return;
        }

        this.hideSidePanel(); // just in case there already is a side panel

        this.#scenes[sidePanelSceneName].position.x = this.screenWidth - this.#sidePanelWidth;
        this.#scenes[sidePanelSceneName].enterScene(options);
        this.#currentSidePanel = this.#scenes[sidePanelSceneName];
        this.#app.stage.addChild(this.#currentSidePanel);
        console.log(`Displaying side panel "${sidePanelSceneName}"`);
        this.onSceneResize();
        this.updateSceneAndSidePanelBounds();
    }

    hideSidePanel() {
        if (!this.#currentSidePanel) {
            // Can't hide side panel, because there is none
            return;
        }

        this.#app.stage.removeChild(this.#currentSidePanel);
        const oldSidePanel = this.#currentSidePanel
        this.#currentSidePanel = null;
        oldSidePanel.exitScene();
        this.onSceneResize();
        this.updateSceneAndSidePanelBounds();
    }

    updateContainerMask(container, x, y, width, height) {
        if (container.mask !== null) {
            // Remove old mask if it exists
            let oldMask = container.mask;
            container.mask = null;
            container.removeChild(oldMask);
        }

        const newMask = new PIXI.Graphics();
        newMask.rect(x, y, width, height).fill(0xffffff);
        container.mask = newMask;
        container.addChild(newMask);
    }

    updateSceneAndSidePanelBounds() {
        if (this.#currentScene) {
            this.updateContainerMask(this.#currentScene, 0, 0, this.sceneWidth, this.sceneHeight);
        }

        if (this.#currentSidePanel) {
            this.updateContainerMask(this.#currentSidePanel, 0, 0, this.sidePanelWidth, this.screenHeight);
        }
    }

    onWindowResize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        this.#app.renderer.resize(newWidth, newHeight);
        if (this.#currentSidePanel) this.#currentSidePanel.position.x = this.sceneWidth;
        this.updateSceneAndSidePanelBounds();
        if (this.#currentScene) this.#currentScene.onWindowResize(newWidth, newHeight);
        this.onSceneResize();
    }

    onSceneResize() {
        if (this.#currentScene) this.#currentScene.onSceneResize(this.sceneWidth, this.sceneHeight);
    }

    onKeyDown(event) {
        if (this.#currentScene) this.#currentScene.onKeyDown(event.code);
    }

    onMousePointerDown(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        if (this.#currentScene) this.#currentScene.onMousePointerDown(mouseX, mouseY);
    }

    get realFPS() {
        return this.#realFPS;
    }

    get maxFPS() {
        return this.#ticker.maxFPS;
    }

    set maxFPS(fps) {
        this.#ticker.maxFPS = fps;
    }

    get screenWidth() {
        return this.#app.screen.width;
    }

    get screenHeight() {
        return this.#app.screen.height;
    }

    get sceneWidth() {
        if (!this.#currentSidePanel) return this.screenWidth;
        return this.screenWidth - this.#sidePanelWidth;
    }

    get sceneHeight() {
        return this.screenHeight;
    }

    get sidePanelWidth() {
        return this.#sidePanelWidth;
    }

    get sidePanelHeight() {
        return this.screenHeight;
    }

    get isSidePanelVisible() {
        return this.#currentSidePanel !== null;
    }
}