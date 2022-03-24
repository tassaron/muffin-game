import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";


export default class WorldScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        game.containers.root.removeChildren();
        
        logger.info("Created World scene");
    }

    mount(container: PIXI.Container) {
        this.game.prevScene.unmount(container);
    }
}