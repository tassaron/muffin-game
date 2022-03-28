import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import Button from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";


export default class PauseScene extends Scene {
    interactiveActors: Array<{interactive: boolean}>;

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
        super.mount(container);
        const disable = (container: PIXI.Container) => {
            for (let child of container.children) {
                if (child.hasOwnProperty("interactive")) {
                    (child as any).interactive = false;
                    this.interactiveActors.push(child as any);
                } else if (child instanceof PIXI.Container) {
                    disable(child);
                }
            }
        }
        disable(container);
    }

    unmount(container: PIXI.Container) {
        super.unmount(container);
        for (let child of this.interactiveActors) {
            child.interactive = true;
        }
    }
}