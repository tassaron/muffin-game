import * as PIXI from "pixi.js";
import IGame from "./IGame";
import IKeyboard from "./IKeyboard";


export default interface IActor extends PIXI.Sprite {
    game: IGame,
    interactive: boolean,
    tick(delta: number, keyboard: IKeyboard): void,
    onTap(callback: (e: Event) => void): void,
    onHover(overCallback: (e: Event) => void, outCallback: (e: Event) => void): void,
}