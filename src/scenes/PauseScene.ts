import { logger } from "../logger";
import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";


export default class PauseScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        const pixi_text = new PIXI.Text("Paused")
        pixi_text.anchor.x = 0.5;
        pixi_text.anchor.y = 0.5;
        game.containers.root.addChild(pixi_text);
        pixi_text.x = game.width / 2;
        pixi_text.y = game.height / 2;

        logger.info("Created Pause scene");
    }
}