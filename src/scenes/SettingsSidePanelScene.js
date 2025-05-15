import { Scene } from "./Scene.js";

export class SettingsSidePanelScene extends Scene {
    #margin = 20;
    #elementWidth = 400 - 2 * this.#margin;

    #sliderHeight = 15;
    #sliderBorderColor = "#FFFFFF";
    #sliderBorder = 2;
    #sliderBackgroundColor = "#FE6048";
    #sliderFillColor = "#00B1DD";
    #sliderCornerRadius = 20;
    #sliderHandleBorder = 2;
    #sliderHandleColor = "#A5E34D";
    #sliderHandleRadius = 12;
    #sliderFontColor = "#FFFFFF";
    #sliderFontSize = 16;

    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
        const list = new PIXIUI.List({ type: 'vertical', elementsMargin: 15 });
        list.position.x = this.#margin;
        list.position.y = this.#margin;

        /*
        const buttonGraphic = new PIXI.Graphics()
            .roundRect(0, 0, 100, 50, 15).fill(0xFFFFFF)

        const button = new PIXIUI.Button(buttonGraphic);

        button.onPress.connect(() => console.log('onPress'));
        list.addChild(button.view);
         */

        let infoText = this.#createLabel("Maximum FPS (0 = no limit)");
        //this.#infoText.anchor.x = 0.5;
        list.addChild(infoText);

        let slider = this.#createSlider();
        slider.value = 10;
        slider.onUpdate.connect((value) => console.log(`${value}`));
        list.addChild(slider);

        let infoText2 = this.#createLabel("Animation rate [Hz]");
        //this.#infoText.anchor.x = 0.5;
        list.addChild(infoText2);

        let slider2 = this.#createSlider();
        slider2.value = 50;
        slider2.onUpdate.connect((value) => console.log(`${value}`));
        list.addChild(slider2);

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

    #createSlider() {
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
            min: 0,
            max: 240,
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
}