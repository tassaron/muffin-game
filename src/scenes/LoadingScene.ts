import * as PIXI from "pixi.js";
//import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";


export default class LoadingScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);        
    }

    unmount(container: PIXI.Container) {
        container.removeChildren();
    }
}