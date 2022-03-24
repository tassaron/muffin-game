import * as PIXI from "pixi.js";
import IGameContainers from "./IGameContainers";
import IGameState from "./IGameState";
import IScene from "./IScene";

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
    playTick(self: IGame, delta: number, keyboard: any): void,
    pauseTick(self: IGame, delta: number, keyboard: any): void,
    changeScene(scene: any): void,
    pause(): void,
    gameOver(): void,
}