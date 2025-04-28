import { Scene } from "./Scene.js";
import { Game, GameMode } from "../Game.js";

export class GameScene extends Scene {
    #game = null;

    constructor(sceneManager) {
        super(sceneManager);
    }

    async init() {
        await PIXI.Assets.load('res/background1.png');
    }

    enterScene(options) {
        switch (options.gameMode) {
            case "pathInterpolation":
                this.#game = new Game(GameMode.PATH_INTERPOLATION, this.sceneManager.screenWidth, this.sceneManager.screenHeight);
                break;
            case "particleDynamics":
                this.#game = new Game(GameMode.PARTICLE_DYNAMICS, this.sceneManager.screenWidth, this.sceneManager.screenHeight);
                break;
            case "RigidBody":
                this.#game = new Game(GameMode.RIGID_BODY, this.sceneManager.screenWidth, this.sceneManager.screenHeight);
                break;
            default:
                throw new Error("GameScene enterScene() was called without specifying a valid game mode");
        }

        const background = PIXI.Sprite.from('res/background1.png');
        background.width = this.sceneManager.screenWidth;
        background.height = this.sceneManager.screenHeight;
        this.addChildAt(background, 0);
    }

    animationUpdate(deltaTime) {
        this.#game.animationUpdate(deltaTime);
    }

    exitScene() {}

    onWindowResize(newWidth, newHeight) {
        console.log("onWindowResize", newWidth, newHeight);
    }

    onKeyDown(key) {
        switch (key) {
            case "KeyP":
                console.log("Pause game"); // TODO
                break;
            case "KeyS":
                console.log("Open settings"); // TODO
                break;
            case "Escape":
                console.log("Return to main menu"); // TODO
                break;
        }
    }

    onMousePointerDown(x, y) {
        console.log("onMousePointerDown", x, y);
    }
}