import { SceneManager } from "./SceneManager.js";
import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { FlyingObjectTypes } from "./FlyingObject.js";

const app = new PIXI.Application();
await app.init({
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    autoStart: false
});
document.body.appendChild(app.canvas);

// Preload all assets
for (const flyingObjectType in FlyingObjectTypes) {
    await PIXI.Assets.load(FlyingObjectTypes[flyingObjectType].imagePath);
}
await PIXI.Assets.load("res/backgroundEden.png");
await PIXI.Assets.load("res/backgroundSpace.png");
await PIXI.Assets.load("res/Roboto-Regular.woff2");
await PIXI.Assets.load("res/Roboto-Bold.woff2");

let sceneManager = new SceneManager(app);

// Create and register scenes
let mainMenuScene = new MainMenuScene(sceneManager);
await mainMenuScene.init();
sceneManager.registerScene("mainMenu", mainMenuScene);
let gameScene = new GameScene(sceneManager);
await gameScene.init();
sceneManager.registerScene("game", gameScene);

// Start game in main menu
sceneManager.changeScene("mainMenu");