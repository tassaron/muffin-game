import { logger } from "../logger";
import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import Button from "../entities/Button";


export default class PauseScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        this.actors.text = new Button(game, 399, 133, "Paused");
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;

        logger.info("Created Pause scene");
    }


    mount(container: PIXI.Container) {
        container.addChild(this.actors.text);
    }

    unmount(container: PIXI.Container) {
        container.removeChild(this.actors.text);
    }
}