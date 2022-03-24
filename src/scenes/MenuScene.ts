import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import Button from "../entities/Button";
import WorldScene from "./WorldScene";

export default class MenuScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        game.containers.root.removeChildren();
        this.actors.button = new Button(game, 200, 50, 0x000000, 0xffffff, "Start Game");
        game.containers.root.addChild(this.actors.button);
        this.actors.button.x = game.width / 2;
        this.actors.button.y = game.height / 2;
        
        // Hook events to buttons
        this.actors.button.interactive = true;
        this.actors.button.click = (_: Event) => this.clickStart();
        
        logger.info("Created Menu scene");
    }

    tick(delta: number, keyboard: any) {
        if (this.actors.explosion === undefined) return
        this.actors.explosion.tick(delta);
        if (this.actors.explosion.loops > 0) {
            this.game.changeScene(new WorldScene(this.game));
        }
    }

    clickStart() {
        if (this.actors.explosion === undefined) {
            this.actors.explosion = this.game.sprites.explosion;
            this.actors.explosion.x = this.game.width / 2;
            this.actors.explosion.y = this.game.height / 2;
            this.game.containers.root.addChild(this.actors.explosion);
            this.game.containers.root.removeChild(this.actors.button);
        }
    }
}
