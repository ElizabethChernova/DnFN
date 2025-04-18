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
const maxFoodOnScreen = 10;  // Максимальна кількість їжі на екрані

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
    loadBackground();
    setInterval(spawnFood, 700);
    app.ticker.add(update);
    window.addEventListener("resize", () => app.renderer.resize(window.innerWidth, window.innerHeight));
}

// Spawns food item with random position and path
function spawnFood() {

    if (flyingFoods.length >= maxFoodOnScreen) return;

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
function loadBackground() {
    const background = PIXI.Sprite.from('src/assets/background1.png'); // Replace with your background image path
    background.width = app.screen.width; // Make the background cover the full width
    background.height = app.screen.height; // Make the background cover the full height
    app.stage.addChildAt(background, 0); // Add background at the bottom layer
}
// Updates food position along its path
function update(delta) {
    const speed = 0.006 * delta;

    for (let i = flyingFoods.length - 1; i >= 0; i--) {
        const food = flyingFoods[i];
        food.pathProgress += speed;

        // // If food reached the end of its path (outside screen), remove it
        // if (food.pathProgress >= 1) {
        //     app.stage.removeChild(food);
        //     flyingFoods.splice(i, 1);
        //     continue;
        // }

        const pos = getPointOnPath(food.path, food.pathProgress);
        food.position.set(pos.x, pos.y);

        // Check if food has moved out of the screen (in any direction)
        if (pos.x < -50 || pos.x > app.screen.width + 50 || pos.y < -50 || pos.y > app.screen.height + 50) {
            app.stage.removeChild(food);
            flyingFoods.splice(i, 1);
        }
    }
}

