import * as PIXI from "pixi.js";
import IGame from "./IGame";
import IKeyboard from "./IKeyboard";

export default interface IScene {
    game: IGame,
    actors: any,
    mounted: PIXI.Container | null,
    tick(delta: number, keyboard: IKeyboard): void,
    mount(container: PIXI.Container): void,
    unmount(container: PIXI.Container): void,
}