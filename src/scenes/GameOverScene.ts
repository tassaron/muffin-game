import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";


export default class GameOverScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        game.containers.root.removeChildren();
        
        logger.info("Created World scene");
    }
}