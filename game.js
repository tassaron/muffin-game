import { newContainer } from "./lib.js";
import { MenuScene } from "./scenes/menu.js";
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

export class Game {
    constructor(app, sprites) {
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
    }

    tick(delta) {
        this.scene.tick(delta, keyboard, mouse);
        if (!this.state.root.game_over && keyboard.p) {this.state.root.paused = !this.state.root.paused}
        if (this.state.root.paused && this.scene.isPausedScene !== true) {
            this.changeScene(new PauseScene(this, this.ctx));
        } else if (!this.state.root.paused && this.scene.isPausedScene) {
            let scene = this.prevScene;
            this.changeScene(scene);
        }
    }

    changeScene(scene) {
        let prevScene = this.scene;
        this.prevScene = prevScene;
        scene.isPausedScene = this.state.root.paused;
        this.scene = scene;
    }

    gameOver() {
        if (!this.state.root.game_over) {
            this.changeScene(new GameOverScene(this));
        }
    }

    pauseGame() {
        if (!this.state.root.game_over) {
            this.state.root.paused = !this.state.root.paused;
        }
    }
}