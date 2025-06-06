class FlyingObjectStateList {
    flyingObjectUuid;
    #states = [];

    constructor(flyingObjectUuid) {
        this.flyingObjectUuid = flyingObjectUuid;
    }

    addState(time, x, y, rotation, scale) {
        this.#states.push({time, x, y, rotation, scale});
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
    motionBlurInterval = 100; // [ms]
    temporalSupersamplingNumFrames = 5;

    #recordedStates = {}; // map: number (UUID) -> FlyingObjectStateList

    #frameTextures = []

    constructor() {
        for (let i = 0; i < this.temporalSupersamplingNumFrames; i++) {
            this.#frameTextures.push(PIXI.RenderTexture.create({ width: screen.width, height: screen.height }));
        }
    }

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

    composeRendering(time, gameScene, renderer, renderTexture, stage, width, height) {
        const step = this.motionBlurInterval / (this.temporalSupersamplingNumFrames - 1);

        for (let i = 0; i < this.temporalSupersamplingNumFrames; i++) {
            const frameTime = time - this.motionBlurInterval + i * step;

            // Set objects' state
            for (const uuid of Object.keys(gameScene.flyingObjectSprites)) {
                const state = this.#recordedStates[uuid].getInterpolatedState(frameTime);
                if (state == null) continue; // skip objects where no state exists yet
                gameScene.flyingObjectSprites[uuid].x = state.x;
                gameScene.flyingObjectSprites[uuid].y = state.y;
            }

            renderer.render(stage, { renderTexture: this.#frameTextures[i], clear: true });
        }

        this.#blendRenderTextures(this.#frameTextures, renderTexture, renderer);
    }

    #blendRenderTextures(samples, outputTexture, renderer) {
        const n = samples.length;

        let container = new PIXI.Container();
        for (let i = 0; i < n; i++) {
            const sprite = new PIXI.Sprite(samples[i]);
            sprite.alpha = 1 / n;
            container.addChild(sprite);
        }

        renderer.render(container, {
            renderTexture: outputTexture,
            clear: true
        });
    }
}