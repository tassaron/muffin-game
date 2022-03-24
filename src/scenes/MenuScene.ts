import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import Button from "../entities/Button";
import WorldScene from "./WorldScene";

export default class MenuScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        this.actors.button = new Button(game, 200, 50, "Start Game");
        this.actors.button.x = game.width / 2;
        this.actors.button.y = game.height / 2;
        
        // Hook events to buttons
        this.actors.button.interactive = true;
        this.actors.button.click = (_: Event) => this.clickStart();
        
        logger.info("Created Menu scene");
    }

    mount(container: PIXI.Container) {
        this.game.prevScene.unmount(container);
        this.mounted = container;
        container.addChild(this.actors.button);
    }

    unmount(container: PIXI.Container) {
        this.mounted = null;
        container.removeChild(this.actors.button);
    }

    tick(delta: number, keyboard: any) {
        if (!this.mounted) return;
        if (keyboard.number == 1) {
            this.clickStart();
        }
        if (this.actors.explosion === undefined) return
        this.actors.explosion.tick(delta);
        if (this.actors.explosion.loops > 0) {
            this.mounted.removeChild(this.actors.explosion);
            this.mounted = null;
            setTimeout(() => this.game.changeScene(new WorldScene(this.game)), 250.0);
        }
    }

    clickStart() {
        if (this.mounted && this.actors.explosion === undefined) {
            this.actors.explosion = this.game.sprites.explosion;
            this.actors.explosion.x = this.game.width / 2;
            this.actors.explosion.y = this.game.height / 2;
            this.mounted.addChild(this.actors.explosion);
            this.mounted.removeChild(this.actors.button);
        }
    }
}
