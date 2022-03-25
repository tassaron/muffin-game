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
    changeScene(scene: any): void,
    pause(keyboard: IKeyboard | undefined): void,
    gameOver(keyboard: IKeyboard | undefined): void,
    reset(): void,
}