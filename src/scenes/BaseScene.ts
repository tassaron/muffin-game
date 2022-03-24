import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import IScene from "../interfaces/IScene";
import IKeyboard from "../interfaces/IKeyboard";

export default class BaseScene implements IScene {
    game: IGame;
    actors: any;
    mounted: PIXI.Container | null = null;

    constructor(game: IGame) {
        this.game = game;
        /*
         * super(game);
         * this.actors._____ = ...;
        */
    }

    tick(delta: number, keyboard: IKeyboard) {
        /*
         * this.actors._____.tick(delta, keyboard);
        */
    }

    mount(container: PIXI.Container) {
        /*
         * this.game.prevScene.unmount(container);
         * container.addChild(this.actors._____);
        */
    }

    unmount(container: PIXI.Container) {
        /*
         * container.removeChild(this.actors.____);
        */
    }
}