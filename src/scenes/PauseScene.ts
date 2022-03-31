import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import Button from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";
import IActor from "../interfaces/IActor";


export default class PauseScene extends Scene {
    pauser: Pauser | null = null;

    constructor(game: IGame) {
        super(game, {});

        this.actors.text = new Button(game, RectangleActor, 399, 133, "Paused");
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;
        this.actors.text.x = game.width / 2;
        this.actors.text.y = game.height / 2;

        logger.info("Created Pause scene");
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


export class Pauser {
    interactiveActors: Array<IActor> = [];
    container: PIXI.Container;

    constructor(container: PIXI.Container) {
        this.container = container;
    }

    pause() {
        this.interactiveActors = pauseContainer(this.container);
    }

    unpause() {
        for (let child of this.interactiveActors) {
            child.interactive = true;
        }
    }
}


export function pauseContainer(container: PIXI.Container) {
    const interactiveActors = [];
    for (let child of <(IActor | PIXI.Container)[]>container.children) {
        if (!child.hasOwnProperty("interactive")) {
            pauseContainer(child);
        } else if ((child as IActor).interactive) {
            interactiveActors.push((child as IActor));
            (child as IActor).interactive = false;
        }
    }
    return interactiveActors;
}
