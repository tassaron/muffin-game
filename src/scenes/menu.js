//import { WorldScene } from "./world.js";
import { logger } from "../logger";

export class MenuScene {
    constructor(game) {
        this.explosion = game.sprites.explosion;
        this.game = game;
        logger.info("Created Menu scene");
        game.containers.root.addChild(this.explosion);
    }

    tick(delta, keyboard, mouse) {
        logger.verbose(`Delta: ${delta}`);
        this.explosion.tick(delta);
    }
}
