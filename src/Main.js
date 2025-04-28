import { SceneManager } from "./SceneManager.js";
import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { GameScene } from "./scenes/GameScene.js";

const app = new PIXI.Application();
await app.init({
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    autoStart: false
});
document.body.appendChild(app.canvas);

let sceneManager = new SceneManager(app);

// Create and register scenes
let mainMenuScene = new MainMenuScene(sceneManager);
await mainMenuScene.init();
sceneManager.registerScene("mainMenu", mainMenuScene);
let gameScene = new GameScene(sceneManager);
await gameScene.init();
sceneManager.registerScene("game", gameScene);

sceneManager.changeScene("mainMenu");