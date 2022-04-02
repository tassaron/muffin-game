import * as PIXI from "pixi.js";
import IGameContainers from "./IGameContainers";
import IGameState from "./IGameState";
import IScene from "./IScene";
import IKeyboard from "./IKeyboard";
import Timer from "../core/timer";
import IActor from "./IActor";

export default interface IGame {
    _app: PIXI.Application,
    renderer: PIXI.AbstractRenderer,
    width: number,
    height: number,
    sprites: {[key: string]: () => IActor},
    containers: IGameContainers,
    state: IGameState,
    scene: IScene,
    prevScene: IScene,
    timers: Timer[],
    changeScene(scene: IScene): void,
    pause(keyboard?: IKeyboard): void,
    gameOver(keyboard?: IKeyboard): void,
    reset(): void,
    startTimer(f: () => void, ms: number, name?: string): number,
    stopTimer(i: number): void,
}