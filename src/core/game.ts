import * as PIXI from "pixi.js";
import { logger } from "./logger";
import IGame from "../interfaces/IGame";
import IGameContainers from "../interfaces/IGameContainers";
import IGameState from "../interfaces/IGameState";
import IKeyboard from "../interfaces/IKeyboard";
import IScene from "../interfaces/IScene";
import IActor from "../interfaces/IActor";
import LoadingScene from "../scenes/LoadingScene";
import PauseScene from "../scenes/PauseScene";
import GameOverScene from "../scenes/GameOverScene";
import Scene from "../scenes/Scene";


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
    containers: IGameContainers;
    scene: IScene;
    prevScene: IScene;
    sprites: any = {};
    timers: Array<[f: () => any, time: number]> = [];
    state = getInitialGameState();
    entryScene: typeof Scene;

    constructor(app: PIXI.Application, sprites: {[key: string]: (game: IGame) => IActor}, keyboard: IKeyboard, entryScene: typeof Scene) {
        this._app = app;
        this.renderer = app.renderer;
        for (let sprite of Object.keys(sprites)) {
            this.sprites[sprite] = (): IActor => sprites[sprite](this);
        }
        this.width = app.view.width;
        this.height = app.view.height;

        this.containers = {
            root: app.stage,
        };

        logger.info(`Game created with dimensions ${this.width}x${this.height}`);
        this.entryScene = entryScene;
        this.scene = new entryScene(this);
        this.prevScene = new LoadingScene(this);
        this.scene.mount(this.containers.root);

        app.ticker.add((delta) => this.state.functions.tick(this, delta, keyboard));
    };

    changeScene(scene: IScene) {
        this.prevScene = Object.assign(this.scene);
        this.scene = scene;
        if (scene.mounted === null) {
            try {
                scene.mount(this.containers.root);
            } catch (TypeError) {
                logger.error("Failed to add an undefined Actor to the container. The scene cannot mount.");
            }
        }
    }

    gameOver(keyboard: IKeyboard | undefined = undefined) {
        if (!this.state.flags.gameOver) {
            this.state.flags.gameOver = true;
            keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
            this.state.functions.tick = gameOverTick;
            this.changeScene(new GameOverScene(this));
        }
    }

    pause(keyboard: IKeyboard | undefined = undefined) {
        if (this.state.flags.gameOver) return
        this.state.flags.paused = !this.state.flags.paused;
        
        if (!this.state.flags.paused) {
            this.state.functions.tick = playTick;
            keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
            this.scene.unmount(this.containers.root);
            this.changeScene(this.prevScene);
            return;
        }
        keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
        this.state.functions.tick = pauseTick;
        this.changeScene(new PauseScene(this));
    }

    reset() {
        logger.debug("RESET GAME: Unmounting scene and prevScene");
        this.scene.mounted && this.scene.unmount(this.scene.mounted);
        this.prevScene.mounted && this.prevScene.unmount(this.prevScene.mounted);

        logger.debug("RESET GAME: Stopping all timers");
        this.timers = [];

        logger.debug("RESET GAME: Resetting state object to defaults");
        this.state = getInitialGameState();

        this.scene = new this.entryScene(this);
        this.prevScene = new LoadingScene(this);
        logger.verbose("RESET GAME: Created entryscene; mounting root container");
        logger.verbose("RESET GAME: The prevScene is currently LoadingScene");
        this.scene.mount(this.containers.root);
    }

    startTimer(f: () => any, ms: number) {
        return this.timers.push([f, ms]) - 1;
    }

    stopTimer(i: number) {
        this.timers[i][0] = () => {};
    }
}


function playTick(game: IGame, delta: number, keyboard: IKeyboard) {
    logger.spam(`Delta: ${delta}`);
    delta = Math.min(delta, 2.0);

    // Tick game timers
    let timersActive = false;
    for (let i = 0; i < game.timers.length; i++) {
        if (game.timers[i][1] == 0.0) {
            game.timers[i][0]();
            game.timers[i][0] = () => {};
            continue;
        }
        timersActive = true;
        game.timers[i][1] -= delta;
        if (game.timers[i][1] <= 0.0) {
            game.timers[i][1] = 0.0;
        }
    }
    if (!timersActive) {
        game.timers = [];
    }

    // Tick keyboard and scene
    keyboard.tick(delta);
    game.scene.tick(delta, keyboard);
    if (keyboard.p) game.pause(keyboard);
}


function pauseTick(game: IGame, delta: number, keyboard: IKeyboard) {
    keyboard.tick(delta);
    if (keyboard.p) {
        game.pause(keyboard);
    }
}

function gameOverTick(game: IGame, delta: number, keyboard: IKeyboard) {
}