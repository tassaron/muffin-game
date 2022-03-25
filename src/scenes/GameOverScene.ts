import * as PIXI from "pixi.js";
import { logger } from "../logger";
import Button from "../entities/Button";
import DrawnEllipse from "../entities/DrawnEllipse";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";


export default class GameOverScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        this.actors.text = new Button(game, DrawnEllipse, 399, 133, "Game Over", null, 0x00ff00, 0x0000ff);
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;
        this.actors.text.interactive = true;
        this.actors.text.click = (_: Event) => game.reset();

        logger.info("Created GameOver scene");
    }

    mount(container: PIXI.Container) {
        container.addChild(this.actors.text);
    }

    unmount(container: PIXI.Container) {
        container.removeChild(this.actors.text);
    }
}
