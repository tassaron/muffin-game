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
import GameOverScene from "./scenes/GameOverScene";


const KEYBOARD_DISABLE_FRAMES = 30.0;
function getInitialGameState(): IGameState {
    return {
        flags: {
            gameOver: false,
            paused: false,
        },
        functions: {
            tick: playTick,
        },
    };
}


export class Game implements IGame {
    _app: PIXI.Application;
    renderer: PIXI.AbstractRenderer;
    width: number;
    height: number;
    sprites: any;
    containers: IGameContainers;
    scene: IScene;
    prevScene: IScene;
    state = getInitialGameState();

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

        logger.info(`Game created with dimensions ${this.width}x${this.height}`);
        this.scene = new MenuScene(this);
        this.prevScene = new LoadingScene(this);
        this.scene.mount(this.containers.root);

        app.ticker.add((delta) => this.state.functions.tick(this, delta, keyboard));
    };

    changeScene(scene: IScene) {
        let prevScene = this.scene;
        this.prevScene = prevScene;
        this.scene = scene;
        if (scene.mounted === null) {
            scene.mount(this.containers.root);
        }
    }

    gameOver(keyboard: IKeyboard | undefined = undefined) {
        if (!this.state.flags.gameOver) {
            keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
            this.state.functions.tick = gameOverTick;
            this.changeScene(new GameOverScene(this));
        }
    }

    pause(keyboard: IKeyboard | undefined = undefined) {
        if (!this.state.flags.gameOver) {
            this.state.flags.paused = !this.state.flags.paused;
        }
        if (!this.state.flags.paused) {
            logger.error("Unpaused while not paused.");
            return;
        }
        keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
        this.state.functions.tick = pauseTick;
        this.changeScene(new PauseScene(this));
    }

    reset() {
        this.state = getInitialGameState();

        this.scene = new MenuScene(this);
        this.prevScene = new LoadingScene(this);
        this.scene.mount(this.containers.root);
    }
}


function playTick(game: IGame, delta: number, keyboard: IKeyboard) {
    logger.spam(`Delta: ${delta}`);
    delta = Math.min(delta, 2.0);
    keyboard.tick(delta);
    game.scene.tick(delta, keyboard);
    if (keyboard.p) game.pause(keyboard);
}


function pauseTick(game: IGame, delta: number, keyboard: IKeyboard) {
    keyboard.tick(delta);
    if (keyboard.p) {
        game.state.flags.paused = false;
        game.state.functions.tick = playTick;
        keyboard.disable(KEYBOARD_DISABLE_FRAMES);
        game.scene.unmount(game.containers.root);
        game.changeScene(game.prevScene);
    }
}

function gameOverTick(game: IGame, delta: number, keyboard: IKeyboard) {
}