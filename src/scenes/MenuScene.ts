//import { WorldScene } from "./world.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import Button from "../entities/Button";

export default class MenuScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        //game.containers.root.removeChildren();
        this.actors.explosion = game.sprites.explosion;
        this.actors.button = new Button(game, game.containers.root.width, game.containers.root.height * 4, 200, 50, 0x000000, 0xffffff, "Start Game");
        logger.info("Created Menu scene");
        game.containers.root.addChild(this.actors.explosion);
        game.containers.root.addChild(this.actors.button);

        // Hook events to buttons
        this.actors.button.interactive = true;
        this.actors.button.click = (e: Event) => logger.info(`Clicked ${e.type} at ${e.target}`);
    }

    tick(delta: number, keyboard: any) {
        logger.verbose(`Delta: ${delta}`);
        this.actors.explosion.tick(delta);
    }
}
