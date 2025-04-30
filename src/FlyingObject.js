export const FlyingObjectTypes = {
    // TODO: The definitions below are just examples to demonstrate config. Replace with real food and non-food items
    //       and correct hit box definitions / score updates.
    pizza: {
        imagePath: 'res/pizza.png',
        width: 512,
        height: 512,
        shape: 'rectangle',
        scoreUpdate: 10
    },
    burger: {
        imagePath: 'res/burger.png',
        width: 500,
        height: 500,
        shape: 'circle',
        scoreUpdate: 10
    },
    sushi: {
        imagePath: 'res/sushi.png',
        width: 1200,
        height: 1200,
        shape: 'circle',
        scoreUpdate: -5
    }
}

export class FlyingObject {
    typeDefinition;
    uuid; // to help reference objects globally

    x = 0;
    y = 0;
    rotation = 0; // in radians, rotation expressed counter-clockwise
    scale = 1;

    motionState = {} // can be used by path techniques to keep track of additional state information

    constructor(typeDefinition) {
        this.typeDefinition = typeDefinition;
        this.uuid = crypto.randomUUID();
    }
}