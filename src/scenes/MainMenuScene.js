import { Scene } from "./Scene.js";

export class MainMenuScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
    }

    animationUpdate(deltaTime) {
        // TODO: implement actual menu and update Game object with correct mode
        this.sceneManager.changeScene("game", { gameMode: "particleDynamics" });
    }
}