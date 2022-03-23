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
    tick(delta: number): void,
    changeScene(scene: any): void,
    pauseGame(): void,
    gameOver(): void,
}