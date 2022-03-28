import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import IScene from "../interfaces/IScene";
import IKeyboard from "../interfaces/IKeyboard";
import IActor from "../interfaces/IActor";

export default class Scene implements IScene {
    game: IGame;
    actors: {[name: string]: IActor};
    mounted: PIXI.Container | null = null;
    _beforeMountFuncs: ((container: PIXI.Container) => void)[];

    // Allow class to have additional properties added at runtime:
    // [key: string]: any;

    constructor(game: IGame, options: {doUnmountPrevious?: boolean} = {doUnmountPrevious: true}) {
        this.game = game;
        this.actors = {};
        this._beforeMountFuncs = options.doUnmountPrevious? [
            (container: PIXI.Container) => {this.game.prevScene.unmount(container)},
        ] : [];
    }

    beforeMount(func: (container: PIXI.Container) => void) {
        this._beforeMountFuncs.push(func);
        return func;
    }

    tick(delta: number, keyboard: IKeyboard) {
        for (let actorName in this.actors) {
            this.actors[actorName].tick(delta, keyboard);
        }
    }

    mount(container: PIXI.Container) {
        this.mounted = container;
        for (let func of this._beforeMountFuncs) {
            func(container);
        }
        for (let actorName in this.actors) {
            container.addChild(this.actors[actorName]);
        }
    }

    unmount(container: PIXI.Container) {
        this.mounted = null;
        for (let actorName in this.actors) {
            container.removeChild(this.actors[actorName]);
        }
    }

    addActors(actors: IActor[]): Array<string> {
        /* Allows to register multiple actors and returns the names assigned to them */
        const names: Set<string> = new Set();
        let randomName;
        for (let actor of actors) {
            while (true) {
                randomName = String.fromCharCode(97+Math.floor(Math.random() * 26))+ String(Math.random() * 1000);
                if (this.actors.hasOwnProperty(randomName)) continue;
                this.actors[randomName] = actor;
                names.add(randomName);
                break;
            }
        }
        return Array.from(names);
    }
}
