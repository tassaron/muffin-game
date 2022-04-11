import * as PIXI from "pixi.js";
import ButtonActor from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";
import IGame from "../interfaces/IGame";
import Scene from "../scenes/Scene";
import MenuScene, { newBackButton } from "../scenes/MenuScene";
import { logger } from "../core/logger";


export default class ModalTestScene extends Scene {
    constructor(game: IGame) {
        super(game);
        this.actors.backButton = newBackButton(game, MenuScene);
        this.actors.button = new ButtonActor(game, RectangleActor, 200, 100, "Open Modal");

        // Anchor everything by centrepoint
        this.actors.button.anchor.x = 0.5;
        this.actors.button.anchor.y = 0.5;

        // Clicking button opens modal popup
        this.actors.button.interactive = true;
        this.actors.button.pointertap = () => {
            game.changeScene(new ModalPopupScene(game));
        };
    }

    mount(container: PIXI.Container) {
        super.mount(container);
        // Place actors in mount() so they get repositioned when the scene is resized
        this.actors.button.x = this.game.width(50);
        this.actors.button.y = this.game.height(50);
    }
}


export class ModalPopupScene extends Scene {
    constructor(game: IGame, width?: number, height?: number, colour?: number, outline?: number) {
        super(game, {});
        if (width === undefined) width = game.width(40);
        if (height === undefined) height = game.height(40);

        this.actors.backdrop = this.newBackdrop();
        this.actors.rectangle = new RectangleActor(game, width, height, colour, outline);
        this.actors.button = new ButtonActor(game, RectangleActor, 200, 100, "Close");

        // Anchor everything by centrepoint
        this.actors.rectangle.anchor.x = 0.5;
        this.actors.rectangle.anchor.y = 0.5;
        this.actors.button.anchor.x = 0.5;
        this.actors.button.anchor.y = 0.5;

        // Clicking button closes the popup
        this.actors.button.interactive = true;
        this.actors.button.pointertap = () => {
            game.changeScene(game.prevScene);
            this.mounted && this.unmount(this.mounted);
        };

        // Disable pausing when this scene is mounted!
        this.beforeMount.add(()=> {game.state.flags.doPause = false});
        this.beforeUnmount.add(()=> {game.state.flags.doPause = true});
    }

    mount(container: PIXI.Container) {
        // Create new backdrop if screen size got larger
        if (this.actors.backdrop.width < this.game.width(100) || this.actors.backdrop.height < this.game.height(100)) {
            super.unmount(container);
            this.actors.backdrop = this.newBackdrop();
        }
        super.mount(container);
        this.actors.rectangle.x = this.game.width(50);
        this.actors.rectangle.y = this.game.height(50);
        this.actors.button.x = this.game.width(50);
        this.actors.button.y = this.game.height(50);
    }

    newBackdrop() {
        // adding 4px to compensate for some padding/outline
        const backdrop = new RectangleActor(this.game, this.game.width(100) + 4, this.game.height(100) + 4, 0x000000, null);
        backdrop.alpha = 0.3;
        backdrop.x = 0;
        backdrop.y = 0;
        return backdrop
    }
}
