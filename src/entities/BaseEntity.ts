import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import IEntity from "../interfaces/IEntity";

export default class BaseEntity extends PIXI.Sprite implements IEntity {
    game: IGame;

    constructor(game: IGame) {
        super();
        this.game = game;
    }
}