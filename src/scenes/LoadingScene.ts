import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";


export default class LoadingScene extends Scene {
    constructor(game: IGame) {
        super(game);
        logger.info("Created Loading scene");
    }

    unmount(container: PIXI.Container) {
        container.removeChildren();
    }
}