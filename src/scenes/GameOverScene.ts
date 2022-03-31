import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import Button from "../actors/ButtonActor";
import EllipseActor from "../actors/EllipseActor";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import { Pauser } from "./PauseScene";


export default class GameOverScene extends Scene {
    pauser: Pauser | null = null;

    constructor(game: IGame) {
        super(game, {});

        this.actors.text = new Button(game, EllipseActor, 399, 133, "Game Over", null, 0x00ff00, 0x0000ff);
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;
        this.actors.text.interactive = true;
        this.actors.text.pointertap = (_: Event) => game.reset();

        logger.info("Created GameOver scene");
    }

    mount(container: PIXI.Container) {
        this.pauser = new Pauser(container);
        this.pauser.pause();
        super.mount(container);
    }

    unmount(container: PIXI.Container) {
        this.pauser?.unpause();
        super.unmount(container);
    }
}
