import { Scene } from "./Scene.js";
import { Game, GameMode } from "../Game.js";

export class GameScene extends Scene {
    #game = null;
    #backgroundSprite;
    #scoreText;
    #flyingObjectSprites = {};
    #forceSourceSprites = [];
//here
    #speedSlider;
    #speedLabel;
    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
        switch (options.gameMode) {
            case "pathInterpolation":
                this.#game = new Game(GameMode.PATH_INTERPOLATION, this.sceneManager.screenWidth, this.sceneManager.screenHeight);
                this.#backgroundSprite = PIXI.Sprite.from('res/backgroundEden.png');
                break;
            case "particleDynamics":
                this.#game = new Game(GameMode.PARTICLE_DYNAMICS, this.sceneManager.screenWidth, this.sceneManager.screenHeight);
                this.#backgroundSprite = PIXI.Sprite.from('res/backgroundSpace.png');
                break;
            case "RigidBody":
                this.#game = new Game(GameMode.RIGID_BODY, this.sceneManager.screenWidth, this.sceneManager.screenHeight);
                this.#backgroundSprite = PIXI.Sprite.from('res/backgroundEden.png');
                break;
            default:
                if (!this.#game) throw new Error("GameScene was entered without an existing game or specifying a valid game mode");
        }

        this.#setupBackground();

        // Setup score text
        this.#scoreText = new PIXI.Text({
            text: "Score: 0",
            style: {
                fontFamily: "Roboto Regular",
                fontSize: 25,
                fill: "#ffffff"
            }
        });
        this.#scoreText.anchor.x = 1;
        this.#readjustScore(this.sceneManager.screenWidth, this.sceneManager.screenHeight);
        this.addChild(this.#scoreText);

        this.#createForceSourceSprites();

        this.#speedSlider = document.createElement("input");
        this.#speedSlider.type = "range";
        this.#speedSlider.min = "0.00001";
        this.#speedSlider.max = "0.0003";
        this.#speedSlider.step = "0.00001";
        this.#speedSlider.value = this.#game.motionStrategy?.speed ?? 0.0001;

        this.#speedSlider.style.position = "absolute";
        this.#speedSlider.style.bottom = "20px";
        this.#speedSlider.style.left = "50%";
        this.#speedSlider.style.transform = "translateX(-50%)";
        this.#speedSlider.style.zIndex = "100";
        this.#speedSlider.style.width = "300px";
        document.body.appendChild(this.#speedSlider);

        this.#speedLabel = document.createElement("div");
        this.#speedLabel.innerText = `Швидкість: ${this.#speedSlider.value}`;
        this.#speedLabel.style.position = "absolute";
        this.#speedLabel.style.bottom = "50px";
        this.#speedLabel.style.left = "50%";
        this.#speedLabel.style.transform = "translateX(-50%)";
        this.#speedLabel.style.zIndex = "100";
        this.#speedLabel.style.color = "white";
        this.#speedLabel.style.fontFamily = "Arial";
        this.#speedLabel.style.fontSize = "16px";
        document.body.appendChild(this.#speedLabel);

        this.#speedSlider.addEventListener("input", () => {
            const newSpeed = parseFloat(this.#speedSlider.value);
            this.#speedLabel.innerText = `Швидкість: ${newSpeed.toFixed(4)}`;
            if (typeof this.#game.setSpeed === "function") {
                this.#game.setSpeed(newSpeed);
            }
        });

    }

    animationUpdate(deltaTime) {
        this.#game.animationUpdate(deltaTime);
        this.#updateFlyingObjectSprites();
        this.#scoreText.text = "Score: " + this.#game.score;
    }

    exitScene() {
        // Remove all children from scene
        for (const child of this.removeChildren()) {
            child.destroy({ children: true, texture: true, baseTexture: true });
        }

        this.#flyingObjectSprites = {};
        this.#forceSourceSprites = [];
        //here
        this.#speedSlider?.remove();
        this.#speedLabel?.remove();
        this.#speedSlider = null;
        this.#speedLabel = null;
//till here
    }

    onWindowResize(newWidth, newHeight) {
        this.#game.resizeScreen(newWidth, newHeight);
        this.#readjustBackground(newWidth, newHeight);
        this.#readjustScore(newWidth, newHeight);
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
                this.sceneManager.changeScene("settings");
                break;
        }
    }

    onMousePointerDown(x, y) {
        this.#game.shoot(x, y);
    }

    #setupBackground() {
        switch (this.#game.gameMode) {
            case GameMode.PATH_INTERPOLATION:
                this.#backgroundSprite = PIXI.Sprite.from('res/backgroundEden.png');
                break;
            case GameMode.PARTICLE_DYNAMICS:
                this.#backgroundSprite = PIXI.Sprite.from('res/backgroundSpace.png');
                break;
            case GameMode.RIGID_BODY:
                this.#backgroundSprite = PIXI.Sprite.from('res/backgroundEden.png');
                break;
        }

        this.#backgroundSprite.anchor.x = 0.5;
        this.#backgroundSprite.anchor.y = 0.5;
        this.#readjustBackground(this.sceneManager.screenWidth, this.sceneManager.screenHeight);
        this.addChildAt(this.#backgroundSprite, 0);
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

    #readjustScore(screenWidth, screenHeight) {
        this.#scoreText.x = screenWidth - 10;
        this.#scoreText.y = 10;
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