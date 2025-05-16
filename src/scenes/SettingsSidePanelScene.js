import { Scene } from "./Scene.js";

export class SettingsSidePanelScene extends Scene {
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

        list.addChild(this.#createLabel("Integration method"));

        let select = this.#createSelect(["Euler", "RK4"]);
        select.onSelect.connect((_, text) =>
        {
            console.log("Selected " + text);
        });
        list.addChild(select);

        this.addChild(list);
    }

    exitScene() {
        this.removeChildren();
    }

    animationUpdate(deltaTime) {
    }

    onKeyDown(key) {
        console.log(key)
        switch (key) {
            case "Escape":
                this.sceneManager.changeScene("game");
                break;
            case "KeyM":
                this.sceneManager.changeScene("mainMenu");
                break;
        }
    }

    onSceneResize(sceneWidth, sceneHeight) {
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
}