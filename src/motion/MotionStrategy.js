export class MotionStrategy {
    screenWidth;
    screenHeight;

    constructor(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    setupInitialState(flyingObject) {}

    advanceStates(flyingObjects, timeDelta) {}
}