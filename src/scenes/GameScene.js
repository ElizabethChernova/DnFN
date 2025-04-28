import { Scene } from "../Scene.js";

export class GameScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
    }

    async init() {
        await PIXI.Assets.load('res/background1.png');
    }

    enterScene(options) {
        console.log("enterScene with options", options);
        const background = PIXI.Sprite.from('res/background1.png');
        background.width = this.sceneManager.screenWidth;
        background.height = this.sceneManager.screenHeight;
        this.addChildAt(background, 0);
    }

    animationUpdate(deltaTime) {}

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