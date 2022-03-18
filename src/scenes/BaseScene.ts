import IGame from "../interfaces/IGame";
import IScene from "../interfaces/IScene";

export default class BaseScene implements IScene {
    game: IGame;
    isPausedScene = false;
    actors: any;

    constructor(game: IGame) {
        this.game = game;
    }

    tick(delta: number, keyboard: any) {}
}