import { Scene } from "./Scene.js";
import {PathInterpolationStrategy} from "../motion/PathInterpol.js";
import {PathInterpolationVisualizer} from "../visualizers/PathInterpolationVisualizer.js";
import {ParticleDynamicsStrategy} from "../motion/ParticleDynamics.js";
import {ParticleDynamicsVisualizer} from "../visualizers/ParticleDynamicsVisualizer.js";
import {GameMode} from "../Game.js";

export class SettingsSidePanelScene extends Scene {
    #game;

    #margin = 20;
    #elementWidth = 400 - 2 * this.#margin;

    #accentColor1 = "#16C47F";
    #accentColor2 = "#FFD65A";
    #accentColor3 = "#FF9D23";
    #accentColor4 = "#F93827";
    #secondaryColor1 = "#D1E9F6";
    #secondaryColor2 = "#F6EACB";
    #secondaryColor3 = "#F1D3CE";
    #secondaryColor4 = "#EECAD5";
    #offWhiteColor = "#FFFFFA";
    #almostBlackColor = "#211E21";

    #sliderHeight = 10;
    #sliderBorderColor = this.#offWhiteColor;
    #sliderBorder = 2;
    #sliderBackgroundColor = this.#secondaryColor2;
    #sliderFillColor = this.#secondaryColor3;
    #sliderCornerRadius = 5;
    #sliderHandleBorder = 2;
    #sliderHandleColor = this.#accentColor1;
    #sliderHandleRadius = 12;
    #sliderFontColor = this.#offWhiteColor;
    #sliderFontSize = 14;

    #selectHeight = 30;
    #selectRadius = 5;
    #selectOpenBGColor = this.#secondaryColor2;
    #selectClosedBGColor = this.#secondaryColor2;
    #selectSelectedColor = this.#accentColor2;
    #selectHoverColor = this.#secondaryColor1;
    #selectFontColor = this.#almostBlackColor;
    #selectFontSize = 16;

    #checkBoxWidth = 20;
    #checkBoxHeight = 20;
    #checkBoxRadius = 5;
    #checkBoxColor = this.#secondaryColor2;
    #checkBoxBorderColor = this.#secondaryColor2;
    #checkBoxFillColor = this.#accentColor1;
    #checkBoxFillBorderColor = this.#offWhiteColor;
    #checkBoxFontColor = this.#offWhiteColor;
    #checkBoxFontSize = 16;

    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
        const list = new PIXIUI.List({ type: 'vertical', elementsMargin: 15 });
        list.position.x = this.#margin;
        list.position.y = this.#margin;

        list.addChild(this.#createLabel("Maximum FPS (0 = no limit)"));

        let maxFPSSlider = this.#createSlider(0, 120);
        maxFPSSlider.value = this.sceneManager.maxFPS;
        maxFPSSlider.onUpdate.connect((value) => this.sceneManager.maxFPS = value);
        list.addChild(maxFPSSlider);

        list.addChild(this.#createLabel("Animation rate [Hz]"));

        let animationRateSlider = this.#createSlider(1, 240);
        animationRateSlider.value = this.sceneManager.animationRate;
        animationRateSlider.onUpdate.connect((value) => this.sceneManager.animationRate = value);
        list.addChild(animationRateSlider);

        this.#game = this.sceneManager.getScene("game").game;


        switch (this.#game.gameMode) {
            case GameMode.PATH_INTERPOLATION:
                this.#addPathInterpolationSettingsTo(list);
                break;
            case GameMode.PARTICLE_DYNAMICS:
                this.#addParticleDynamicsSettingsTo(list);
                break;
            default:
                throw new Error(`Settings: Unknown game mode`);
        }

        this.addChild(list);
    }

    exitScene() {
        this.removeChildren();
    }

    animationUpdate(deltaTime) {
    }

    onSceneResize(sceneWidth, sceneHeight) {
    }

    #addPathInterpolationSettingsTo(container) {
        container.addChild(this.#createLabel("Path interpolation speed"));

        const minSpeed = 0.00001;
        const maxSpeed = 0.0003;
        let speedSlider = this.#createSlider(1, 100);
        speedSlider.value = this.#remapValue(this.#game.motionStrategy.speed, minSpeed, maxSpeed, 1, 100);
        speedSlider.onUpdate.connect((value) => this.#game.motionStrategy.speed = this.#remapValue(value, 1, 100, minSpeed, maxSpeed));
        container.addChild(speedSlider);
    }

    #addParticleDynamicsSettingsTo(container) {
        container.addChild(this.#createLabel("Integration method"));

        let select = this.#createSelect(["Euler", "RK4"]);
        select.onSelect.connect((_, text) =>
        {
            if (text === "Euler") {
                this.#game.motionStrategy.integrationMethod = "euler";
            }
            else if (text === "RK4") {
                this.#game.motionStrategy.integrationMethod = "rk4";
            }
        });
        container.addChild(select);

        container.addChild(this.#createLabel("Visualizations"));

        let forceFieldCheckbox = this.#createCheckbox("Force field");
        forceFieldCheckbox.checked = this.#game.visualizer.displayForceField;
        forceFieldCheckbox.onCheck.connect((checked) =>
        {
            this.#game.visualizer.displayForceField = checked;
        });
        container.addChild(forceFieldCheckbox);

        let trailCheckbox = this.#createCheckbox("Particle trail");
        trailCheckbox.checked = this.#game.visualizer.displayParticleTrail;
        trailCheckbox.onCheck.connect((checked) =>
        {
            this.#game.visualizer.displayParticleTrail = checked;
        });
        container.addChild(trailCheckbox);
    }

    #addRigidBodySettingsTo(container) {
        // TODO: add settings for rigid body mode here
    }

    #remapValue(value, min_value, max_value, new_min, new_max) {
        return ((value - min_value) / (max_value - min_value)) * (new_max - new_min) + new_min;
    }

    #createLabel(text) {
        return new PIXI.Text({
            text: text,
            style: {
                fontFamily: "Roboto Bold",
                fontSize: 18,
                fill: "#ffffff"
            }
        });
    }

    #createSlider(min, max) {
        const bg = new PIXI.Graphics()
            .roundRect(0, 0, this.#elementWidth, this.#sliderHeight, this.#sliderCornerRadius)
            .fill(this.#sliderBorderColor)
            .roundRect(this.#sliderBorder, this.#sliderBorder, this.#elementWidth - (this.#sliderBorder * 2), this.#sliderHeight - (this.#sliderBorder * 2), this.#sliderCornerRadius)
            .fill(this.#sliderBackgroundColor);

        const fill = new PIXI.Graphics()
            .roundRect(0, 0, this.#elementWidth, this.#sliderHeight, this.#sliderCornerRadius)
            .fill(this.#sliderBorderColor)
            .roundRect(this.#sliderBorder, this.#sliderBorder, this.#elementWidth - (this.#sliderBorder * 2), this.#sliderHeight - (this.#sliderBorder * 2), this.#sliderCornerRadius)
            .fill(this.#sliderFillColor);

        const slider = new PIXI.Graphics()
            .circle(0, 0, this.#sliderHandleRadius + this.#sliderHandleBorder)
            .fill(this.#sliderBorderColor)
            .circle(0, 0, this.#sliderHandleRadius)
            .fill(this.#sliderHandleColor);

        // Component usage
        return new PIXIUI.Slider({
            bg,
            fill,
            slider,
            min,
            max,
            step: 1,
            value: 50,
            valueTextStyle: {
                fill: this.#sliderFontColor,
                fontSize: this.#sliderFontSize,
                fontFamily: "Roboto Regular",
            },
            showValue: true,
        });
    }

    #createSelect(items) {
        const textStyle = {
            fill: this.#selectFontColor,
            fontSize: this.#selectFontSize,
            fontFamily: "Roboto Regular",
        };

        // Closed BG
        const closedBGView = new PIXI.Container();
        const closedBG = new PIXI.Graphics()
            .roundRect(0, 0, this.#elementWidth, this.#selectHeight, this.#selectRadius)
            .fill(this.#selectClosedBGColor);
        closedBGView.addChild(closedBG);

        // Open BG
        const openBGView = new PIXI.Container();
        const openBG = new PIXI.Graphics()
            .roundRect(0, 0, this.#elementWidth, this.#selectHeight * items.length + 1, this.#selectRadius)
            .fill(this.#selectOpenBGColor);
        openBGView.addChild(openBG);

        return new PIXIUI.Select({
            closedBG: closedBGView,
            openBG: openBGView,
            textStyle,
            items: {
                items,
                selectColor: this.#selectSelectedColor,
                hoverColor: this.#selectHoverColor,
                width: this.#elementWidth,
                height: this.#selectHeight,
                textStyle,
                radius: this.#selectRadius,
            },
            scrollBox: {
                width: this.#elementWidth,
                height: this.#selectHeight * 5,
                radius: this.#selectRadius,
            },
        });
    }

    #createCheckbox(text) {
        return new PIXIUI.CheckBox({
            text,
            checked: false,
            style: {
                unchecked: new PIXI.Graphics()
                    .roundRect(-2, -2, this.#checkBoxWidth + 4, this.#checkBoxHeight + 4, this.#checkBoxRadius)
                    .fill(this.#checkBoxBorderColor)
                    .roundRect(0, 0, this.#checkBoxWidth, this.#checkBoxHeight, this.#checkBoxRadius)
                    .fill(this.#checkBoxColor),
                checked: new PIXI.Graphics()
                    .roundRect(-2, -2, this.#checkBoxWidth + 4, this.#checkBoxHeight + 4, this.#checkBoxRadius)
                    .fill(this.#checkBoxBorderColor)
                    .roundRect(0, 0, this.#checkBoxWidth, this.#checkBoxHeight, this.#checkBoxRadius)
                    .fill(this.#checkBoxColor)
                    .roundRect(3, 3, this.#checkBoxWidth - 6, this.#checkBoxHeight - 6, this.#checkBoxRadius)
                    .fill(this.#checkBoxFillBorderColor)
                    .roundRect(5, 5, this.#checkBoxWidth - 10, this.#checkBoxHeight - 10, this.#checkBoxRadius)
                    .fill(this.#checkBoxFillColor),
                text: {
                    fill: this.#checkBoxFontColor,
                    fontSize: this.#checkBoxFontSize,
                    fontFamily: "Roboto Regular",
                },
            },
        });
    }
}