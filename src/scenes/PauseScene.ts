import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import Button from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";


export default class PauseScene extends Scene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        this.actors.text = new Button(game, RectangleActor, 399, 133, "Paused");
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;
        this.actors.interactive = [];

        logger.info("Created Pause scene");
    }


    mount(container: PIXI.Container) {
        container.addChild(this.actors.text);
        const disable = (container: PIXI.Container) => {
            for (let child of container.children) {
                if (child.hasOwnProperty("interactive")) {
                    (child as any).interactive = false;
                    this.actors.interactive.push(child);
                } else if (child instanceof PIXI.Container) {
                    disable(child);
                }
            }
        }
        disable(container);
    }

    unmount(container: PIXI.Container) {
        container.removeChild(this.actors.text);
        for (let child of this.actors.interactive) {
            child.interactive = true;
        }
    }
}