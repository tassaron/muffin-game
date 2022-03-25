import * as PIXI from "pixi.js";
import IGameContainers from "./IGameContainers";
import IGameState from "./IGameState";
import IScene from "./IScene";
import IKeyboard from "./IKeyboard";

export default interface IGame {
    _app: PIXI.Application,
    renderer: PIXI.AbstractRenderer,
    width: number,
    height: number,
    sprites: any,
    containers: IGameContainers,
    state: IGameState,
    scene: IScene,
    prevScene: IScene,
    timers: Array<[f: () => any, time: number]>,
    changeScene(scene: any): void,
    pause(keyboard?: IKeyboard): void,
    gameOver(keyboard?: IKeyboard): void,
    reset(): void,
    startTimer(f: () => any, ms: number): number,
    stopTimer(i: number): void,
}