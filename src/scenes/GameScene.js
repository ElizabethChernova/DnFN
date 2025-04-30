import { Scene } from "./Scene.js";
import { Game, GameMode } from "../Game.js";

export class GameScene extends Scene {
    #game = null;
    #backgroundSprite;
    #flyingObjectSprites = {};
    #forceSourceSprites = [];

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

        // Setup background
        this.#backgroundSprite = PIXI.Sprite.from('res/background.png');
        this.#backgroundSprite.anchor.x = 0.5;
        this.#backgroundSprite.anchor.y = 0.5;
        this.#readjustBackground(this.sceneManager.screenWidth, this.sceneManager.screenHeight);
        this.addChildAt(this.#backgroundSprite, 0);

        this.#createForceSourceSprites();
    }

    animationUpdate(deltaTime) {
        this.#game.animationUpdate(deltaTime);
        this.#updateFlyingObjectSprites();
    }

    exitScene() {}

    onWindowResize(newWidth, newHeight) {
        this.#game.resizeScreen(newWidth, newHeight);
        this.#readjustBackground(newWidth, newHeight);
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
        this.#game.shoot(x, y);
    }

    #readjustBackground(width, height) {
        const sprite = this.#backgroundSprite;
        sprite.scale = 1;
        const horizontalScale = width / sprite.width;
        const verticalScale = height / sprite.height;
        sprite.scale = Math.max(horizontalScale, verticalScale);
        sprite.x = width / 2;
        sprite.y = height / 2;
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
            const sprite = this.#flyingObjectSprites[flyingObject.uuid];
            sprite.x = flyingObject.x - sprite.width / 2;
            sprite.y = flyingObject.y - sprite.height / 2;
            sprite.rotation = flyingObject.rotation;
            sprite.scale = flyingObject.scale;
        }

        // Iterate over sprites and remove all whose counterpart in the Game class no longer exists
        for (const [key, value] of Object.entries(this.#flyingObjectSprites)) {
            if (!this.#game.flyingObjects.some(obj => obj.uuid === key)) {
                this.removeChild(this.#flyingObjectSprites[key]);
                delete this.#flyingObjectSprites[key];
            }
        }
    }

    #createForceSourceSprites() {
        for (const forceSource of this.#game.forceSources) {
            if (forceSource.imagePath) {
                const sprite = PIXI.Sprite.from(forceSource.imagePath);
                sprite.x = forceSource.x - sprite.width / 2;
                sprite.y = forceSource.y - sprite.height / 2;
                this.#forceSourceSprites.push(sprite);
                this.addChild(sprite);
            }
        }
    }
}