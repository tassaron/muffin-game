import * as PIXI from "pixi.js";
import Actor from "../actors/Actor";
import ButtonActor from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";
import IGame from "../interfaces/IGame";
import Scene from "../scenes/Scene";
import MenuScene, { newBackButton } from "../scenes/MenuScene";
import { logger } from "../core/logger";
import { Pauser } from "../scenes/PauseScene";
import IScene from "../interfaces/IScene";


export default class ModalTestScene extends Scene {
    constructor(game: IGame) {
        super(game);
        this.actors.backButton = newBackButton(game, (game) => new SceneChangingModalPopupScene(game, (game) => new MenuScene(game)));
        this.actors.button1 = new ButtonActor(game, RectangleActor, 500, 100, "Wide modal w/ 0 options");
        this.actors.button2 = new ButtonActor(game, RectangleActor, 500, 100, "Tall modal w/ 1 option");

        // Anchor everything by centrepoint
        this.actors.button1.anchor.x = 0.5;
        this.actors.button1.anchor.y = 0.5;
        this.actors.button2.anchor.x = 0.5;
        this.actors.button2.anchor.y = 0.5;

        // Clicking buttons open modal popups
        this.actors.button1.interactive = true;
        this.actors.button1.pointertap = () => {
            game.changeScene(new ModalPopupScene(
                game,
                "This is a modal.",
                null,
                game.width(65),
            ));
        };
        this.actors.button2.interactive = true;
        this.actors.button2.pointertap = () => {
            game.changeScene(new ModalPopupScene(
                game,
                "This is another modal, this time with extra long unnecessarily long text which definitely wraps onto multiple lines!",
                new ButtonActor(game, RectangleActor, 200, 100, "OK"),
                game.width(25),
                game.height(80),
            ));
        };
    }

    mount(container: PIXI.Container) {
        super.mount(container);
        // Place actors in mount() so they get repositioned when the scene is resized
        this.actors.button1.x = this.game.width(50);
        this.actors.button1.y = this.game.height(50) - 50;
        this.actors.button2.x = this.game.width(50);
        this.actors.button2.y = this.game.height(50) + 50;
    }
}


export class ModalPopupScene extends Scene {
    static buttonWidth = 200;
    static buttonHeight = 100;
    pauser = new Pauser();
    actionId: string | null;
    textWidth: number;

    constructor(game: IGame, text: string, actionButton: ButtonActor | null, width?: number, height?: number, colour?: number, outline?: number) {
        super(game, {});
        if (width === undefined) width = game.width(40);
        if (height === undefined) height = game.height(40);

        // MainWindow and backdrop (behind the window)
        this.actors.backdrop = this.newBackdrop();
        this.actors.mainWindow = new RectangleActor(game, width, height, colour, outline);

        this.actors.text = new Actor(game);
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        const textStyle = new PIXI.TextStyle({
            align: "center",
            wordWrap: true,
            wordWrapWidth: this.actors.mainWindow.width - ModalPopupScene.buttonWidth,
        });
        const textSprite = new PIXI.Text(text, textStyle);
        this.textWidth = PIXI.TextMetrics.measureText(text, textStyle).width;
        this.actors.text.addChild(textSprite);

        // Button actors
        this.actionId = null;
        this.actors.closeButton = new ButtonActor(game, RectangleActor, ModalPopupScene.buttonWidth, ModalPopupScene.buttonHeight, "Close");
        if (actionButton != null) this.actionId = this.addActors([actionButton])[0];

        // Anchor everything by centrepoint
        this.actors.mainWindow.anchor.x = 0.5;
        this.actors.mainWindow.anchor.y = 0.5;
        this.actors.closeButton.anchor.x = 0.5;
        this.actors.closeButton.anchor.y = 0.5;
        if (this.actionId != null) {
            this.actors[this.actionId].anchor.x = 0.5;
            this.actors[this.actionId].anchor.y = 0.5;
        }

        // Clicking close button closes the popup represented by this scene
        this.actors.closeButton.interactive = true;
        this.actors.closeButton.pointertap = () => {
            game.changeScene(game.prevScene);
            this.mounted && this.unmount(this.mounted);
        };

        // Disable pausing when this scene is mounted!
        // Also pause anything still on-screen from previous scene
        this.beforeMount.add((container: PIXI.Container) => {
            game.state.flags.doPause = false;
            this.pauser.pause(container);
        });
        this.beforeUnmount.add(() => {
            game.state.flags.doPause = true;
            this.pauser.unpause();
        });
    }

    mount(container: PIXI.Container) {
        // Create new backdrop if screen size got larger
        if (this.actors.backdrop.width < this.game.width(100) || this.actors.backdrop.height < this.game.height(100)) {
            logger.debug(`Re-creating modal backdrop (was ${this.actors.backdrop.width}x${this.actors.backdrop.height})`);
            logger.info("Re-mounting modal popup so backdrop is at the bottom.");
            super.unmount(container);
            this.actors.backdrop = this.newBackdrop();
        }
        super.mount(container);
        this.actors.mainWindow.x = this.game.width(50);
        this.actors.mainWindow.y = this.game.height(50);

        this.actors.text.x = this.actors.mainWindow.x - (this.textWidth / 2);
        this.actors.text.y = this.actors.mainWindow.y - ModalPopupScene.buttonHeight;

        // Place buttons relative to each other
        const yPos = (this.actors.mainWindow.y + (this.actors.mainWindow.height / 2)) - ModalPopupScene.buttonHeight;
        let xPos = this.actors.mainWindow.x;
        if (this.actionId) {
            this.actors[this.actionId].x = xPos - (ModalPopupScene.buttonWidth * 0.66);
            this.actors[this.actionId].y = yPos;
            xPos = xPos + (ModalPopupScene.buttonWidth * 0.66);
        }
        this.actors.closeButton.x = xPos;
        this.actors.closeButton.y = yPos;
    }

    newBackdrop() {
        const backdrop = new RectangleActor(this.game, this.game.width(100), this.game.height(100), 0x000000, null);
        backdrop.alpha = 0.3;
        backdrop.x = 0;
        backdrop.y = 0;
        return backdrop
    }
}


export class SceneChangingModalPopupScene extends ModalPopupScene {
    constructor(game: IGame, scene: (game: IGame) => IScene) {
        const button = new ButtonActor(game, RectangleActor, 200, 100, "OK");
        super(game, "Are you sure you want to quit?", button);

        // Clicking OK goes back to menu
        button.interactive = true;
        button.pointertap = (_: Event) => {
            if (game.prevScene.mounted) game.prevScene.unmount(game.prevScene.mounted);
            game.changeScene(scene(game));
        };
    }
}
