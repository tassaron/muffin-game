import * as PIXI from "pixi.js";
import IActor from "./IActor";
import IGame from "./IGame";
import IKeyboard from "./IKeyboard";


export interface ILifecycle<T> {
    funcs: T[],
    add(func: T): T,
    remove(func: T): boolean,
}


export default interface IScene {
    game: IGame,
    actors: {[name: string]: IActor},
    subscenes: IScene[],
    mounted: PIXI.Container | null,
    subcontainer: PIXI.Container | null,
    interactive: boolean,
    beforeUnmount: ILifecycle<(container: PIXI.Container) => void>,
    beforeMount: ILifecycle<(container: PIXI.Container) => void>,
    beforeTick: ILifecycle<(delta: number, keyboard: IKeyboard) => void>,
    mount(container: PIXI.Container): void,
    unmount(container: PIXI.Container): void,
    tick(delta: number, keyboard: IKeyboard): void,
    addActors(actors: IActor[]): Array<string>,
    resize(): void,
}