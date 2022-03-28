import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import IScene from "../interfaces/IScene";
import IKeyboard from "../interfaces/IKeyboard";
import IActor from "../interfaces/IActor";


export type SceneOptions = {doUnmountPrevious?: boolean};


export default class Scene implements IScene {
    game: IGame;
    actors: {[name: string]: IActor};
    mounted: PIXI.Container | null = null;
    _beforeMountFuncs: ((container: PIXI.Container) => void)[];
    _interactive = false;

    constructor(game: IGame, options: SceneOptions = {doUnmountPrevious: true}) {
        this.game = game;
        this.actors = {};
        this._beforeMountFuncs = constructorOptions(this, options);
    }

    get interactive() {
        return this._interactive;
    }

    set interactive(value: boolean) {
        for (let actorName in this.actors) {
            this.actors[actorName].interactive = value;
        }
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

    beforeMount(func: (container: PIXI.Container) => void): (container: PIXI.Container) => void {
        return beforeMount(this, func);
    }

    addActors(actors: IActor[]): Array<string> {
        return addActors(this, actors);
    }
}


export function beforeMount(scene: IScene, func: (container: PIXI.Container) => void) {
    scene._beforeMountFuncs.push(func);
    return func;
}


export function addActors(scene: IScene, actors: IActor[]): Array<string> {
    /* Allows to register multiple actors and returns the names assigned to them */
    const names: Set<string> = new Set();
    let randomName;
    for (let actor of actors) {
        while (true) {
            randomName = String.fromCharCode(97+Math.floor(Math.random() * 26))+ String(Math.random() * 1000);
            if (scene.actors.hasOwnProperty(randomName)) continue;
            scene.actors[randomName] = actor;
            names.add(randomName);
            break;
        }
    }
    return Array.from(names);
}


export function constructorOptions(scene: IScene, options: SceneOptions) {
    return options?.doUnmountPrevious? [
        (container: PIXI.Container) => {scene.game.prevScene.unmount(container)},
    ] : [];
}