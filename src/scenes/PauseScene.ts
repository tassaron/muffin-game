import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import Button from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";
import IActor from "../interfaces/IActor";


export default class PauseScene extends Scene {
    interactiveActors: Array<IActor>;

    constructor(game: IGame) {
        super(game, {});

        this.actors.text = new Button(game, RectangleActor, 399, 133, "Paused");
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;
        this.interactiveActors = [];

        logger.info("Created Pause scene");
    }


    mount(container: PIXI.Container) {
        const disable = (container: PIXI.Container) => {
            for (let child of <(IActor | PIXI.Container)[]>container.children) {
                if (!child.hasOwnProperty("interactive")) {
                    disable(child);
                } else if ((child as IActor).interactive) {
                    this.interactiveActors.push((child as IActor));
                    (child as IActor).interactive = false;
                }
            }
        }
        disable(container);
        super.mount(container);
    }

    unmount(container: PIXI.Container) {
        super.unmount(container);
        for (let child of this.interactiveActors) {
            child.interactive = true;
        }
    }
}