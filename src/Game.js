export const GameMode = Object.freeze({
    PATH_INTERPOLATION: Symbol("pathInterpolation"),
    PARTICLE_DYNAMICS: Symbol("particleDynamics"),
    RIGID_BODY: Symbol("rigidBody")
});

export class Game {
    #gameMode;
    #screenWidth;
    #screenHeight;
    #flyingObjects = []

    constructor(gameMode, screenWidth, screenHeight) {
        console.assert(Object.values(GameMode).includes(gameMode), "Invalid game mode specifier");
        this.#gameMode = gameMode;
        this.#screenWidth = screenWidth;
        this.#screenHeight = screenHeight;
    }

    animationUpdate(deltaTime) {

    }

    resizeScreen(newScreenWidth, newScreenHeight) {
        this.#screenWidth = newScreenWidth;
        this.#screenHeight = newScreenHeight;
    }

    shoot(x, y) {

    }
}