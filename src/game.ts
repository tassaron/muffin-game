import * as PIXI from "pixi.js";
import { newContainer } from "./lib";
import IGame from "./interfaces/IGame";
import IGameContainers from "./interfaces/IGameContainers";
import IGameState from "./interfaces/IGameState";
import IScene from "./interfaces/IScene";
import { MenuScene } from "./scenes/menu";
//import { PauseScene } from "./scenes/pause.js";
//import { GameOverScene } from "./scenes/gameover.js";

const keyboard = {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "number": -1,
    "p": false
};

const mouse = {
    "leftClick": false,
    "middleClick": false,
    "rightClick": false,
    "x": 0,
    "y": 0,
    "width": 0,
    "height": 0
}

export class Game implements IGame {
    _app: PIXI.Application;
    sprites: any;
    containers: IGameContainers;
    state: IGameState;
    scene: IScene;
    prevScene: IScene;

    constructor(app: PIXI.Application, sprites: any) {
        this._app = app;
        this.sprites = sprites;

        this.containers = {
            root: newContainer(app.stage),
        };

        this.state = {
            root: {
                game_over: false,
                paused: false,
            },
        };

        this.scene = new MenuScene(this);
        this.prevScene = this.scene;

        app.ticker.add((delta) => this.tick(delta));
    };

    tick(delta: number) {
        this.scene.tick(delta, keyboard);
        if (!this.state.root.game_over && keyboard.p) {this.state.root.paused = !this.state.root.paused}
        if (this.state.root.paused && this.scene.isPausedScene !== true) {
            //this.changeScene(new PauseScene(this, this.ctx));
        } else if (!this.state.root.paused && this.scene.isPausedScene) {
            let scene = this.prevScene;
            this.changeScene(scene);
        }
    }

    changeScene(scene: any) {
        let prevScene = this.scene;
        this.prevScene = prevScene;
        scene.isPausedScene = this.state.root.paused;
        this.scene = scene;
    }

    gameOver() {
        if (!this.state.root.game_over) {
            //this.changeScene(new GameOverScene(this));
        }
    }

    pauseGame() {
        if (!this.state.root.game_over) {
            this.state.root.paused = !this.state.root.paused;
        }
    }
}