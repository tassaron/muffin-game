import * as PIXI from "pixi.js";
import IActor from "./IActor";
import IGame from "./IGame";
import IKeyboard from "./IKeyboard";

export default interface IScene {
    game: IGame,
    actors: {[name: string]: IActor},
    mounted: PIXI.Container | null,
    tick(delta: number, keyboard: IKeyboard): void,
    mount(container: PIXI.Container): void,
    unmount(container: PIXI.Container): void,
}