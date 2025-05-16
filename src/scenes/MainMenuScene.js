import { Scene } from "./Scene.js";

export class MainMenuScene extends Scene {
    #gameNameText;
    #menuEntry1;
    #menuEntry2;

    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
        this.#gameNameText = new PIXI.Text({
            text: "DnFN",
            style: {
                fontFamily: "Roboto Bold",
                fontSize: 85,
                fill: "#db7e44"
            }
        });
        this.#gameNameText.anchor.x = 0.5;
        this.addChild(this.#gameNameText);

        this.#menuEntry1 = new PIXI.Text({
            text: "Press (1) for path interpolation mode",
            style: {
                fontFamily: "Roboto Regular",
                fontSize: 30,
                fill: "#ffffff"
            }
        });
        this.#menuEntry1.anchor.x = 0.5;
        this.addChild(this.#menuEntry1);

        this.#menuEntry2 = new PIXI.Text({
            text: "Press (2) for particle dynamics mode",
            style: {
                fontFamily: "Roboto Regular",
                fontSize: 30,
                fill: "#ffffff"
            }
        });
        this.#menuEntry2.anchor.x = 0.5;
        this.addChild(this.#menuEntry2);

        this.#positionTextElements(this.sceneManager.screenWidth, this.sceneManager.screenHeight);
    }

    exitScene() {
        this.removeChildren();
    }

    animationUpdate(deltaTime) {
    }

    onKeyDown(key) {
        switch (key) {
            case "Digit1":
                this.sceneManager.changeScene("game", { gameMode: "pathInterpolation" });
                break;
            case "Digit2":
                this.sceneManager.changeScene("game", { gameMode: "particleDynamics" });
                break;
        }
    }

    onSceneResize(sceneWidth, sceneHeight) {
        this.#positionTextElements(sceneWidth, sceneHeight);
    }

    #positionTextElements(screenWidth, screenHeight) {
        this.#gameNameText.x = screenWidth / 2;
        this.#gameNameText.y = 300;
        this.#menuEntry1.x = screenWidth / 2;
        this.#menuEntry1.y = 450;
        this.#menuEntry2.x = screenWidth / 2;
        this.#menuEntry2.y = 500;
    }
}

/*
        const buttonGraphic = new PIXI.Graphics()
            .roundRect(0, 0, 100, 50, 15).fill(0xFFFFFF)

        const button = new PIXIUI.Button(buttonGraphic);

        button.onPress.connect(() => console.log('onPress'));
        list.addChild(button.view);
         */