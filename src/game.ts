import * as PIXI from "pixi.js";
import { logger } from "./logger";
import IGame from "./interfaces/IGame";
import IGameContainers from "./interfaces/IGameContainers";
import IGameState from "./interfaces/IGameState";
import IKeyboard from "./interfaces/IKeyboard";
import IScene from "./interfaces/IScene";
import IEntity from "./interfaces/IEntity";
import LoadingScene from "./scenes/LoadingScene";
import MenuScene from "./scenes/MenuScene";
import PauseScene from "./scenes/PauseScene";
//import { GameOverScene } from "./scenes/gameover.js";

const KEYBOARD_DISABLE_FRAMES = 30.0;


export class Game implements IGame {
    _app: PIXI.Application;
    renderer: PIXI.AbstractRenderer;
    width: number;
    height: number;
    sprites: any;
    containers: IGameContainers;
    state: IGameState;
    scene: IScene;
    prevScene: IScene;

    constructor(app: PIXI.Application, sprites: any, keyboard: any) {
        this._app = app;
        this.renderer = app.renderer;
        this.sprites = {};
        for (let sprite of Object.keys(sprites)) {
            this.sprites[sprite] = (): IEntity => sprites[sprite](this);
        }
        this.width = app.view.width;
        this.height = app.view.height;

        this.containers = {
            root: app.stage,
        };

        this.state = {
            flags: {
                gameOver: false,
                paused: false,
            },
            functions: {
                tick: this.playTick,
            },
        };

        logger.info(`Game created with dimensions ${this.width}x${this.height}`);
        
        this.scene = new MenuScene(this);
        this.prevScene = new LoadingScene(this);
        this.scene.mount(this.containers.root);

        app.ticker.add((delta) => this.state.functions.tick(this, delta, keyboard));
    };

    playTick(self: IGame, delta: number, keyboard: IKeyboard) {
        logger.spam(`Delta: ${delta}`);
        delta = Math.min(delta, 2.0);
        keyboard.tick(delta);
        self.scene.tick(delta, keyboard);
        if (keyboard.p) self.pause(keyboard);
    }

    pauseTick(self: IGame, delta: number, keyboard: IKeyboard) {
        keyboard.tick(delta);
        if (keyboard.p) {
            self.state.flags.paused = false;
            self.state.functions.tick = self.playTick;
            keyboard.disable(KEYBOARD_DISABLE_FRAMES);
            self.scene.unmount(self.containers.root);
            self.changeScene(self.prevScene);
        }
    }

    changeScene(scene: IScene) {
        let prevScene = this.scene;
        this.prevScene = prevScene;
        this.scene = scene;
        if (scene.mounted === null) {
            scene.mount(this.containers.root);
        }
    }

    gameOver(keyboard: IKeyboard) {
        if (!this.state.flags.gameOver) {
            //this.changeScene(new GameOverScene(this));
        }
    }

    pause(keyboard: IKeyboard) {
        if (!this.state.flags.gameOver) {
            this.state.flags.paused = !this.state.flags.paused;
        }
        if (!this.state.flags.paused) {
            logger.error("Unpaused while not paused.");
            return;
        }
        keyboard.disable(KEYBOARD_DISABLE_FRAMES);
        this.state.functions.tick = this.pauseTick;
        this.changeScene(new PauseScene(this));
    }
}