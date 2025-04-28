import { Scene } from "./Scene.js";
import { Game, GameMode } from "../Game.js";

export class GameScene extends Scene {
    #game = null;
    #flyingObjectSprites = {};

    constructor(sceneManager) {
        super(sceneManager);
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
        this.#updateFlyingObjectSprites();
    }

    exitScene() {}

    onWindowResize(newWidth, newHeight) {
        console.log("onWindowResize", newWidth, newHeight);
    }

    onKeyDown(key) {
        switch (key) {
            case "KeyP":
                this.#game.isPaused = !this.#game.isPaused;
                break;
            case "KeyS":
                console.log("Open settings"); // TODO
                break;
            case "Escape":
                this.sceneManager.changeScene("mainMenu");
                break;
        }
    }

    onMousePointerDown(x, y) {
        console.log("onMousePointerDown", x, y);
    }

    #updateFlyingObjectSprites() {
        for (const flyingObject of this.#game.flyingObjects) {
            if (!(flyingObject.uuid in this.#flyingObjectSprites)) {
                // Create sprite for object
                const sprite = PIXI.Sprite.from(flyingObject.typeDefinition.imagePath);
                this.#flyingObjectSprites[flyingObject.uuid] = sprite;
                this.addChild(sprite);
            }

            // Update sprite position, rotation and scale
            this.#flyingObjectSprites[flyingObject.uuid].x = flyingObject.x;
            this.#flyingObjectSprites[flyingObject.uuid].y = flyingObject.y;
            this.#flyingObjectSprites[flyingObject.uuid].rotation = flyingObject.rotation;
            this.#flyingObjectSprites[flyingObject.uuid].scale = flyingObject.scale;
        }

        // Iterate over sprites and remove all whose counterpart in the Game class no longer exists
        for (const [key, value] of Object.entries(this.#flyingObjectSprites)) {
            if (!this.#game.flyingObjects.some(obj => obj.uuid === key)) {
                this.removeChild(this.#flyingObjectSprites[key]);
                delete this.#flyingObjectSprites[key];
            }
        }
    }
}