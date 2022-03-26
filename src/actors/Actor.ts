import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import IActor from "../interfaces/IActor";
import IKeyboard from "../interfaces/IKeyboard";

export default class Actor extends PIXI.Sprite implements IActor {
    game: IGame;
    interactive = false;

    constructor(game: IGame, texture: PIXI.Texture | undefined = undefined) {
        super(texture);
        this.game = game;
    }

    tick(delta: number, keyboard: IKeyboard) {}
}