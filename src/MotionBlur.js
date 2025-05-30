class FlyingObjectStateList {
    flyingObjectUuid;
    #states = [];

    constructor(flyingObjectUuid) {
        this.flyingObjectUuid = flyingObjectUuid;
    }

    addState(time, x, y, rotation, scale) {
        this.#states.push({time, x, y, rotation, scale});
        //console.log(`State recorded for ${this.flyingObjectUuid} at ${time}. Now we have ${this.#states.length} states.`);
    };

    removeStatesOlderThan(time) {
        this.#states = this.#states.filter((state) => state.time >= time);
    };

    getInterpolatedState(time) {
        let {smaller, bigger} = this.#findBoundingStates(time);
        if (smaller == null && bigger == null) return null; // no info available
        if (smaller == null) return bigger;
        if (bigger == null) return smaller;

        const t = (time - smaller.time) / (bigger.time - smaller.time);

        return {
            time,
            x: this.#lerp(smaller.x, bigger.x, t),
            y: this.#lerp(smaller.y, bigger.y, t),
            rotation: this.#lerpAngle(smaller.rotation, bigger.rotation, t),
            scale: this.#lerp(smaller.scale, bigger.scale, t)
        }
    }

    #findBoundingStates(time) {
        let smaller = null;
        let bigger = null;

        for (const state of this.#states) {
            if (state.time < time) {
                if (smaller === null || state.time > smaller.time) {
                    smaller = state;
                }
            } else if (state.time > time) {
                if (bigger === null || state.time < bigger.time) {
                    bigger = state;
                }
            }
        }

        return { smaller, bigger };
    }

    #lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    //#lerpAngle(a, b, t) {
    //    const difference = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
    //    return a + difference * t;
    //}

    // Angle lerping is adapted from:
    // https://forum.godotengine.org/t/lerping-a-2d-angle-while-going-trought-the-shortest-possible-distance/24124/3
    #lerpAngle(a, b, t) {
        return a + this.#shortAngleDist(a, b) * t;
    }

    #shortAngleDist(from, to) {
        const max_angle = Math.PI * 2;
        const difference = (to - from) % max_angle;
        return ((2 * difference) % max_angle) - difference;
    }
}

export class MotionBlur {
    motionBlurInterval = 1000; // [ms]

    #recordedStates = {}; // map: number (UUID) -> FlyingObjectStateList

    recordState(time, gameScene) {
        for (const uuid of Object.keys(gameScene.flyingObjectSprites)) {
            if (!(uuid in this.#recordedStates)) {
                // Create state list for object
                this.#recordedStates[uuid] = new FlyingObjectStateList(uuid);
            }

            const sprite = gameScene.flyingObjectSprites[uuid];
            this.#recordedStates[uuid].addState(time, sprite.x, sprite.y, sprite.rotation, sprite.scale);
            this.#recordedStates[uuid].removeStatesOlderThan(time - this.motionBlurInterval);
        }

        // Iterate over state lists and remove all whose counterpart no longer exists
        for (const [key, value] of Object.entries(this.#recordedStates)) {
            if (!(key in gameScene.flyingObjectSprites)) {
                delete this.#recordedStates[key];
            }
        }
    }

    composeRendering(time, gameScene) {

    }
}