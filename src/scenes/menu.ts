//import { WorldScene } from "./world.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";

export class MenuScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        this.actors.explosion = game.sprites.explosion;
        logger.info("Created Menu scene");
        game.containers.root.addChild(this.actors.explosion);
    }

    tick(delta: number, keyboard: any) {
        logger.verbose(`Delta: ${delta}`);
        this.actors.explosion.tick(delta);
    }
}
