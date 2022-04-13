import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import ButtonActor from "../actors/ButtonActor";
import EllipseActor from "../actors/EllipseActor";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import { Pauser } from "./PauseScene";


export default class GameOverScene extends Scene {
    pauser = new Pauser();

    constructor(game: IGame) {
        super(game, {});

        this.actors.text = new ButtonActor(game, EllipseActor, 266, 133, "Game Over", null, 0x933ed3, 0x000000);
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.interactive = true;
        this.actors.text.onTap((_: Event) => game.reset());

        this.beforeMount.add((container: PIXI.Container) => {
            this.actors.text.x = game.width(100) / 2;
            this.actors.text.y = game.height(100) / 2;
        });

        logger.info("Created GameOver scene");
    }

    mount(container: PIXI.Container) {
        this.pauser.pause(container);
        super.mount(container);
    }

    unmount(container: PIXI.Container) {
        this.pauser.unpause();
        super.unmount(container);
    }
}
