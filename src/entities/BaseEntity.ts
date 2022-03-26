import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import IEntity from "../interfaces/IEntity";
import IKeyboard from "../interfaces/IKeyboard";

export default class BaseEntity extends PIXI.Sprite implements IEntity {
    game: IGame;
    interactive = false;

    constructor(game: IGame, texture: PIXI.Texture | undefined = undefined) {
        super(texture);
        this.game = game;
    }

    tick(delta: number, keyboard: IKeyboard) {}
}