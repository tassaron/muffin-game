import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import IScene, { ILifecycle } from "../interfaces/IScene";
import IKeyboard from "../interfaces/IKeyboard";
import IActor from "../interfaces/IActor";
import { logger } from "../core/logger";


export class SceneOptions {doUnmountPrevious?: boolean};


export class Lifecycle<T> implements ILifecycle<T> {
    funcs: T[] = [];

    add(func: T): T {
        this.funcs.push(func);
        return func
    }

    remove(func: T): boolean {
        const result = this.funcs.findIndex(_func  => _func == func);
        if (result < 0) return false;
        logger.verbose(`Removed lifecycle method`)
        this.funcs.splice(result, 1);
        return true;
    }
}


export default class Scene implements IScene {
    game!: IGame;
    actors: {[name: string]: IActor} = {};
    subscenes: IScene[] = [];
    subcontainer: PIXI.Container | null = null;
    mounted: PIXI.Container | null = null;
    beforeMount = new Lifecycle<((container: PIXI.Container) => void)>();
    beforeUnmount = new Lifecycle<((container: PIXI.Container) => void)>();
    beforeTick = new Lifecycle<((delta: number, keyboard: IKeyboard) => void)>();
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

    addActors(actors: IActor[]): Array<string> {
        return addActors(this, actors);
    }

    resize() {
        return resize(this);
    }
}


export function sceneConstructor(scene: IScene, game: IGame, options: SceneOptions) {
    scene.game = game;
    scene.beforeMount.funcs = options?.doUnmountPrevious? [
        (container: PIXI.Container) => {
            if (!(scene.game.prevScene == scene)) {
                scene.game.prevScene.unmount(container)
            }
        },
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
    for (let func of scene.beforeTick.funcs) {
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
    for (let func of scene.beforeMount.funcs) {
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
    for (let func of scene.beforeUnmount.funcs) {
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


export function addActors(scene: IScene, actors: IActor[] | IActor): Array<string> {
    /* Allows to register multiple actors and returns the names assigned to them */
    const names: Set<string> = new Set();
    let randomName;
    if (!(typeof (actors as any)[Symbol.iterator] === 'function')) {
        logger.warning("Argument to addActors is not iterable.")
        actors = [<IActor>actors];
    }
    for (let actor of (actors as IActor[])) {
        while (true) {
            randomName = String.fromCharCode(97+Math.floor(Math.random() * 26))+ String(Math.random() * 1000);
            if (scene.actors.hasOwnProperty(randomName)) continue;
            scene.actors[randomName] = actor;
            names.add(randomName);
            break;
        }
    }
    const nameArray = Array.from(names);
    logger.info(`Registered anonymous actors: ${nameArray}`)
    return nameArray;
}


export function resize(scene: IScene) {
    if (!scene.mounted) return
    logger.info(`Resized scene (${scene.game.width(100)}x${scene.game.height(100)}) using default behaviour (unmount/remount)`);
    const container = scene.mounted;
    scene.unmount(container);
    if (scene.game.prevScene.mounted) {
        scene.game.prevScene.unmount(container);
        scene.game.prevScene.mount(container);
    }
    scene.mount(container);
}
