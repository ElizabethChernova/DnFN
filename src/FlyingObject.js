export const FlyingObjectTypes = {
    // TODO: The definitions below are just examples to demonstrate config. Replace with real food and non-food items
    //       and correct hit box definitions / score updates.
    burger: {
        imagePath: 'res/burger.png',
        width: 137,
        height: 146,
        shape: 'rectangle',
        scoreUpdate: 10
    },
    toast: {
        imagePath: 'res/toast.png',
        width: 126,
        height: 114,
        shape: 'rectangle',
        scoreUpdate: 5
    },
    pancake: {
        imagePath: 'res/pancake.png',
        width: 150,
        height: 150,
        shape: 'circle',
        scoreUpdate: 5
    },
    pizza: {
        imagePath: 'res/pizza.png',
        width: 150,
        height: 150,
        shape: 'circle',
        scoreUpdate: 10
    },
    maki: {
        imagePath: 'res/maki.png',
        width: 150,
        height: 150,
        shape: 'circle',
        scoreUpdate: 10
    },
    cat1: {
        imagePath: 'res/cat1.png',
        width: 150,
        height: 150,
        shape: 'circle',
        scoreUpdate: -10
    },
    cat2: {
        imagePath: 'res/cat2.png',
        width: 150,
        height: 150,
        shape: 'circle',
        scoreUpdate: -10
    },
    cat3: {
        imagePath: 'res/cat3.png',
        width: 150,
        height: 150,
        shape: 'circle',
        scoreUpdate: -10
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