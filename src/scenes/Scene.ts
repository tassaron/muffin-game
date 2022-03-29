import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import IScene from "../interfaces/IScene";
import IKeyboard from "../interfaces/IKeyboard";
import IActor from "../interfaces/IActor";
import { logger } from "../core/logger";


export class SceneOptions {doUnmountPrevious?: boolean};


export default class Scene implements IScene {
    game!: IGame;
    actors: {[name: string]: IActor} = {};
    subscenes: IScene[] = [];
    subcontainer: PIXI.Container | null = null;
    mounted: PIXI.Container | null = null;
    _beforeMountFuncs: ((container: PIXI.Container) => void)[] = [];
    _beforeUnmountFuncs: ((container: PIXI.Container) => void)[] = [];
    _beforeTickFuncs: ((delta: number, keyboard: IKeyboard) => void)[] = [];
    _interactive = false;

    constructor(game: IGame, options: SceneOptions = {doUnmountPrevious: true}) {
        sceneConstructor(this, game, options);
    }

    get interactive() {
        return this._interactive;
    }
    
    set interactive(value: boolean) {
        setInteractive(this, value);
        this._interactive = value;
    }
    
    tick(delta: number, keyboard: IKeyboard) {
        return tick(this, delta, keyboard);
    }
    
    mount(container: PIXI.Container) {
        return mount(this, container);
    }
    
    unmount(container: PIXI.Container) {
        return unmount(this, container);
    }
    
    beforeMount(func: (container: PIXI.Container) => void): (container: PIXI.Container) => void {
        return beforeMount(this, func);
    }

    beforeUnmount(func: (container: PIXI.Container) => void): (container: PIXI.Container) => void {
        return beforeUnmount(this, func);
    }

    beforeTick(func: (delta: number, keyboard: IKeyboard) => void): (delta: number, keyboard: IKeyboard) => void {
        return beforeTick(this, func);
    }

    addActors(actors: IActor[]): Array<string> {
        return addActors(this, actors);
    }
}


export function sceneConstructor(scene: IScene, game: IGame, options: SceneOptions) {
    scene.game = game;
    scene._beforeMountFuncs = options?.doUnmountPrevious? [
        (container: PIXI.Container) => {scene.game.prevScene.unmount(container)},
    ] : [];
}


export function setInteractive(scene: IScene, value: boolean) {
    for (let actorName in scene.actors) {
        scene.actors[actorName].interactive = value;
    }
    for (let subscene of scene.subscenes) {
        subscene.interactive = value;
    }
}


export function tick(scene: IScene, delta: number, keyboard: IKeyboard) {
    if (!scene.mounted) return;
    for (let func of scene._beforeTickFuncs) {
        func(delta, keyboard);
        if (!scene.mounted) return;
    }
    for (let actorName in scene.actors) {
        scene.actors[actorName].tick(delta, keyboard);
    }
    for (let subscene of scene.subscenes) {
        subscene.tick(delta, keyboard);
    }
}


export function mount(scene: IScene, container: PIXI.Container) {
    scene.mounted = container;
    for (let func of scene._beforeMountFuncs) {
        func(container);
    }
    const subcontainer = scene.subcontainer == null ? container : scene.subcontainer;
    for (let actorName in scene.actors) {
        subcontainer.addChild(scene.actors[actorName]);
    }
    if (subcontainer !== container) {
        container.addChild(subcontainer);
    }
    for (let subscene of scene.subscenes) {
        subscene.mount(subcontainer);
    }
}


export function unmount(scene: IScene, container: PIXI.Container) {
    scene.mounted = null;
    for (let func of scene._beforeUnmountFuncs) {
        func(container);
    }
    const subcontainer = scene.subcontainer == null ? container : scene.subcontainer;
    for (let actorName in scene.actors) {
        subcontainer.removeChild(scene.actors[actorName]);
    }
    for (let subscene of scene.subscenes) {
        subscene.unmount(subcontainer);
    }
    if (subcontainer !== container) {
        container.removeChild(subcontainer);
    }
}


export function beforeMount(scene: IScene, func: (container: PIXI.Container) => void) {
    scene._beforeMountFuncs.push(func);
    return func;
}


export function beforeUnmount(scene: IScene, func: (container: PIXI.Container) => void) {
    scene._beforeUnmountFuncs.push(func);
    return func;
}


export function beforeTick(scene: IScene, func: (delta: number, keyboard: IKeyboard) => void) {
    scene._beforeTickFuncs.push(func);
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
    const nameArray = Array.from(names);
    logger.info(`Registerd anonymous actors: ${nameArray}`)
    return nameArray;
}
