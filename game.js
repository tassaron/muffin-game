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
        this.paused = false;
        this.game_over = false;
        this.app = app;
        this.sprites = sprites;
        this.allowUserInput = true;
        this.timer = [0.0, function(){}, this];
        this.scene = new MenuScene(this);
        this.prevScene = this.scene;
        
        app.ticker.add((delta) => this.tick(delta));
    }

    tick(delta) {
        this.scene.update(delta, keyboard, mouse);
        if (!this.game_over && keyboard.p) {this.paused = !this.paused}
        if (this.paused && this.scene.isPausedScene !== true) {
            this.changeScene(new PauseScene(this, this.ctx));
        } else if (!this.paused && this.scene.isPausedScene) {
            let scene = this.prevScene;
            this.changeScene(scene);
        }
    }

    changeScene(scene) {
        let prevScene = this.scene;
        this.prevScene = prevScene;
        scene.isPausedScene = this.paused;
        this.scene = scene;
    }

    gameOver() {
        if (!this.game_over) {
            this.changeScene(new GameOverScene(this));
        }
    }

    pauseGame() {
        if (!this.game_over) {
            this.paused = !this.paused;
        }
    }
}