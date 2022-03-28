import * as PIXI from "pixi.js";
import IActor from "./IActor";
import IGame from "./IGame";
import IKeyboard from "./IKeyboard";

export default interface IScene {
    game: IGame,
    actors: {[name: string]: IActor},
    mounted: PIXI.Container | null,
    subscenes: IScene[],
    subcontainer: PIXI.Container | null,
    interactive: boolean,
    beforeMount(func: (container: PIXI.Container) => void): (container: PIXI.Container) => void,
    _beforeMountFuncs: ((container: PIXI.Container) => void)[],
    mount(container: PIXI.Container): void,
    unmount(container: PIXI.Container): void,
    addActors(actors: IActor[]): Array<string>,
    tick(delta: number, keyboard: IKeyboard): void,
}