import { Scene } from "./Scene.js";

export class SettingsSidePanelScene extends Scene {
    #infoText;

    constructor(sceneManager) {
        super(sceneManager);
    }

    enterScene(options) {
        const list = new PIXIUI.List({ type: 'vertical', elementsMargin: 10 });

        // BUTTON
        const buttonGraphic = new PIXI.Graphics()
            .roundRect(0, 0, 100, 50, 15).fill(0xFFFFFF)

        const button = new PIXIUI.Button(buttonGraphic);

        button.onPress.connect(() => console.log('onPress'));
        list.addChild(button.view);

        // LABEL
        this.#infoText = new PIXI.Text({
            text: "Maximum FPS (0 = no limit)",
            style: {
                fontFamily: "Roboto Bold",
                fontSize: 16,
                fill: "#ffffff"
            }
        });
        //this.#infoText.anchor.x = 0.5;
        list.addChild(this.#infoText);

        // SLIDER
        let width = 400;
        let height = 35;
        let borderColor = "#FFFFFF";
        let border = 3;
        let backgroundColor = "#FE6048";
        let fillColor = "#00B1DD";
        let radius = 25;
        let handleBorder = 3;
        let meshColor = "#A5E34D";
        let fontColor = "#FFFFFF";
        let fontSize = 20;
        let showValue = true;

        const bg = new PIXI.Graphics()
            .roundRect(0, 0, width, height, radius)
            .fill(borderColor)
            .roundRect(border, border, width - (border * 2), height - (border * 2), radius)
            .fill(backgroundColor);

        const fill = new PIXI.Graphics()
            .roundRect(0, 0, width, height, radius)
            .fill(borderColor)
            .roundRect(border, border, width - (border * 2), height - (border * 2), radius)
            .fill(fillColor);

        const slider = new PIXI.Graphics()
            .circle(0, 0, 20 + handleBorder)
            .fill(borderColor)
            .circle(0, 0, 20)
            .fill(meshColor);

        // Component usage
        const singleSlider = new PIXIUI.Slider({
            bg,
            fill,
            slider,
            min: 0,
            max: 240,
            step: 1,
            value: 50,
            valueTextStyle: {
                fill: fontColor,
                fontSize,
            },
            showValue,
        });

        //singleSlider.value = value;

        singleSlider.onUpdate.connect((value) => console.log(`${value}`));

        list.addChild(singleSlider);
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
}