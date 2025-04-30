import { Scene } from "./Scene.js";

export class SettingsScene extends Scene {
    #infoText;

    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
        this.#infoText = new PIXI.Text({
            text: "Settings – Press (Esc) to return to game or (M) for the main menu",
            style: {
                fontFamily: "Roboto Bold",
                fontSize: 30,
                fill: "#ffffff"
            }
        });
        this.#infoText.anchor.x = 0.5;
        this.addChild(this.#infoText);

        this.#positionTextElements(this.sceneManager.screenWidth, this.sceneManager.screenHeight);
    }

    animationUpdate(deltaTime) {
    }

    onKeyDown(key) {
        console.log(key)
        switch (key) {
            case "Escape":
                this.sceneManager.changeScene("game");
                break;
            case "KeyM":
                this.sceneManager.changeScene("mainMenu");
                break;
        }
    }

    onWindowResize(newWidth, newHeight) {
        this.#positionTextElements(newWidth, newHeight);
    }

    #positionTextElements(screenWidth, screenHeight) {
        this.#infoText.x = screenWidth / 2;
        this.#infoText.y = 500;
    }
}