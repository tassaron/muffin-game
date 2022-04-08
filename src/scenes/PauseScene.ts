import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import Button from "../actors/ButtonActor";
import RectangleActor from "../actors/RectangleActor";
import IActor from "../interfaces/IActor";


export default class PauseScene extends Scene {
    pauser = new Pauser();

    constructor(game: IGame) {
        super(game, {});

        this.actors.text = new Button(game, RectangleActor, 399, 133, "Paused");
        this.beforeMount.add((container: PIXI.Container) => {
            this.actors.text.x = this.game.width(50);
            this.actors.text.y = this.game.height(50);
        });
        this.actors.text.anchor.x = 0.5;
        this.actors.text.anchor.y = 0.5;

        logger.info("Created Pause scene");
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


export class Pauser {
    interactiveActors: Array<IActor> = [];
    mounted: PIXI.Container | null = null;

    pause(container: PIXI.Container) {
        this.mounted = container;
        this.interactiveActors = pauseContainer(container);
    }

    unpause() {
        if (!this.mounted) logger.warning("Unpaused a scene that was not paused.");
        for (let child of this.interactiveActors) {
            child.interactive = true;
        }
    }
}


export function pauseContainer(container: PIXI.Container) {
    const interactiveActors: IActor[] = [];
    const pauseChild = (container: IActor | PIXI.Container) => {
        for (let child of <(IActor | PIXI.Container)[]>container.children) {
            if ((child as IActor).interactive == true) {
                (child as IActor).interactive = false;
                interactiveActors.push((child as IActor));
            }
            pauseChild(child);
        }
    }
    pauseChild(container);
    return interactiveActors;
}
