import { generateRandomPath, getPointOnPath } from './src/modes/pathInterpolation.js';

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x111111,
});
document.body.appendChild(app.view);

const foodTexturesPaths = [
    'src/assets/pizza.png',
    'src/assets/sushi.png',
    'src/assets/burger.png'
];

const foodTextures = [];
const flyingFoods = [];

Promise.all(foodTexturesPaths.map(loadTexture)).then((textures) => {
    foodTextures.push(...textures);
    startGame();
});

// Loads texture from a path
function loadTexture(path) {
    return PIXI.Assets.load(path);
}

// Starts the game, sets interval and ticker
function startGame() {
    setInterval(spawnFood, 700);
    app.ticker.add(update);
    window.addEventListener("resize", () => app.renderer.resize(window.innerWidth, window.innerHeight));
}

// Spawns food item with random position and path
function spawnFood() {
    const texture = foodTextures[Math.floor(Math.random() * foodTextures.length)];
    const sprite = new PIXI.Sprite(texture);
    sprite.scale.set(0.2 + Math.random() * 0.2);

    const { x, y } = getRandomSpawnPosition();
    const path = generateRandomPath(app.screen.width, app.screen.height, { x, y });

    sprite.position.set(x, y);
    sprite.pathProgress = 0;
    sprite.path = path;

    app.stage.addChild(sprite);
    flyingFoods.push(sprite);
}

// Returns random position for food to spawn
function getRandomSpawnPosition() {
    const side = Math.floor(Math.random() * 4);
    let x, y;

    switch (side) {
        case 0: x = Math.random() * app.screen.width; y = -50; break; // from top
        case 1: x = Math.random() * app.screen.width; y = app.screen.height + 50; break; // from bottom
        case 2: x = -50; y = Math.random() * app.screen.height; break; // from left
        case 3: x = app.screen.width + 50; y = Math.random() * app.screen.height; break; // from right
    }

    return { x, y };
}

// Handles mouse click and removes food if clicked
document.addEventListener('click', handleMouseClick);

function handleMouseClick(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (let i = flyingFoods.length - 1; i >= 0; i--) {
        const food = flyingFoods[i];

        if (food.getBounds().contains(mouseX, mouseY)) {
            app.stage.removeChild(food);
            flyingFoods.splice(i, 1);
            break;
        }
    }
}

// Updates food position along its path
function update(delta) {
    const speed = 0.002 * delta;

    for (let i = flyingFoods.length - 1; i >= 0; i--) {
        const food = flyingFoods[i];
        food.pathProgress += speed;

        // If food reached the end of its path, remove it
        if (food.pathProgress >= 1) {
            app.stage.removeChild(food);
            flyingFoods.splice(i, 1);
            continue;
        }

        const pos = getPointOnPath(food.path, food.pathProgress);
        food.position.set(pos.x, pos.y);
    }
}

