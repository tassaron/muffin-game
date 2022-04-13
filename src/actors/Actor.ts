import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
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

    onTap(callback: (e: Event) => void) {
        (this as any).pointertap = callback;
    }

    onHover(overCallback: (e: Event) => void, outCallback: (e: Event) => void) {
        (this as any).pointerover = overCallback;
        (this as any).pointerout = outCallback;
    }
}
