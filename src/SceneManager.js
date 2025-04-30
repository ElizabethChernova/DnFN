export class SceneManager {
    #app;
    #ticker;
    #scenes = {};
    #currentScene = null;

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
        console.log(`Changed to scene "${newSceneName}"`)
    }

    onWindowResize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        this.#app.renderer.resize(newWidth, newHeight);
        if (this.#currentScene) this.#currentScene.onWindowResize(newWidth, newHeight);
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
}