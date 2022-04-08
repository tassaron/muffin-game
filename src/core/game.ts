import * as PIXI from "pixi.js";
import { logger } from "./logger";
import IGame from "../interfaces/IGame";
import IGameState from "../interfaces/IGameState";
import IKeyboard from "../interfaces/IKeyboard";
import IScene from "../interfaces/IScene";
import IActor from "../interfaces/IActor";
import Timer from "./timer";
import LoadingScene from "../scenes/LoadingScene";
import PauseScene from "../scenes/PauseScene";
import GameOverScene from "../scenes/GameOverScene";
import Scene from "../scenes/Scene";
import MenuScene from "../scenes/MenuScene";


export const KEYBOARD_DISABLE_FRAMES = 30.0;


export function getInitialGameState(): IGameState {
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


export default class Game implements IGame {
    _app: PIXI.Application;
    renderer: PIXI.AbstractRenderer;
    stage: PIXI.Container;
    width: number;
    height: number;
    scene: IScene;
    prevScene: IScene;
    sprites: {[key: string]: () => IActor} = {};
    timers: Timer[] = [];
    _prevTick = playTick;
    state = getInitialGameState();
    static entryScene: typeof Scene = MenuScene;
    static gameOverScene: typeof Scene = GameOverScene;
    static pauseScene: typeof Scene = PauseScene;
    static loadingScene: typeof Scene = LoadingScene;

    constructor(app: PIXI.Application, sprites: {[key: string]: (game: IGame) => IActor}, keyboard: IKeyboard) {
        this._app = app;
        this.renderer = app.renderer;
        this.stage = app.stage;
        this.width = app.view.width;
        this.height = app.view.height;

        // Resize scenes when the renderer is resized
        (app.renderer as any).on("resize", (width: number, height: number) => {
            logger.info(`Renderer resized to ${width}x${height}`);
            this.width = width;
            this.height = height;
            this.prevScene.resize();
            this.scene.resize();
        });

        // Make sprite builders by giving this Game instance to all the functions
        for (let sprite of Object.keys(sprites)) {
            this.sprites[sprite] = (): IActor => sprites[sprite](this);
        }

        // Create scenes
        logger.info(`Game created with dimensions ${this.width}x${this.height}`);
        this.scene = new Game.entryScene(this);
        this.prevScene = new Game.loadingScene(this);
        this.scene.mount(this.stage);

        app.ticker.add((delta) => this.state.functions.tick(this, delta, keyboard));
    };

    changeScene(scene: IScene) {
        /* Assign current `scene` to `prevScene` & change current `scene`
         * This method mounts the new scene to `game.stage` but does not unmount anything
         * The new scene usually unmounts the prevScene in its beforeMount funcs
         */
        this.prevScene = Object.assign(this.scene);
        this.scene = scene;
        if (scene.mounted !== null) {
            logger.warning("Tried to mount a scene that is already mounted.");
            return;
        }
        try {
            scene.mount(this.stage);
        } catch (e) {
            if (e instanceof TypeError) {
                logger.error("Failed to add an undefined Actor to the container. The scene cannot mount.");
                return;
            }
            logger.error(`${(e as Error).name}: ${(e as Error).message}`);
            throw e;
        }
    }

    gameOver(keyboard: IKeyboard | undefined = undefined) {
        if (!this.state.flags.gameOver) {
            this.state.flags.gameOver = true;
            keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
            this.state.functions.tick = gameOverTick;
            this.changeScene(new Game.gameOverScene(this));
        }
    }

    pause(keyboard: IKeyboard | undefined = undefined) {
        if (this.state.flags.gameOver) return
        this.state.flags.paused = !this.state.flags.paused;
        
        if (!this.state.flags.paused) {
            this.state.functions.tick = this._prevTick;
            keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
            this.scene.unmount(this.stage);
            this.changeScene(this.prevScene);
            return;
        }
        keyboard?.disable(KEYBOARD_DISABLE_FRAMES);
        this._prevTick = Object.assign(this.state.functions.tick);
        this.state.functions.tick = pauseTick;
        this.changeScene(new Game.pauseScene(this));
    }

    reset() {
        logger.debug("RESET GAME: Unmounting scene and prevScene");
        this.scene.mounted && this.scene.unmount(this.scene.mounted);
        this.prevScene.mounted && this.prevScene.unmount(this.prevScene.mounted);

        logger.debug("RESET GAME: Stopping all timers");
        this.timers = [];

        logger.debug("RESET GAME: Resetting state object to defaults");
        this.state = getInitialGameState();

        this.scene = new Game.entryScene(this);
        this.prevScene = new Game.loadingScene(this);
        logger.verbose("RESET GAME: Created entryscene; mounting root container");
        logger.verbose("RESET GAME: The prevScene is currently LoadingScene");
        this.scene.mount(this.stage);
    }

    startTimer(f: () => void, ms: number, name?: string) {
        return this.timers.push(new Timer(f, ms, name)) - 1;
    }

    stopTimer(i: number) {
        logger.debug(`Stopping the "${this.timers[i].name}" Timer early`);
        this.timers[i] = new Timer();
    }
}


export function playTick(game: IGame, delta: number, keyboard: IKeyboard) {
    logger.spam(`Delta: ${delta}`);
    delta = Math.min(delta, 2.0);

    // Tick game timers
    let timersActive = false;
    for (let i = 0; i < game.timers.length; i++) {
        if (game.timers[i].called) continue;
        timersActive = true;
        game.timers[i].tick(delta);
    }
    if (!timersActive) {
        game.timers = [];
    }

    // Tick keyboard and scene
    keyboard.tick(delta);
    game.scene.tick(delta, keyboard);
    if (keyboard.p) game.pause(keyboard);
}


export function pauseTick(game: IGame, delta: number, keyboard: IKeyboard) {
    keyboard.tick(delta);
    if (keyboard.p) {
        game.pause(keyboard);
    }
}


export function gameOverTick(game: IGame, delta: number, keyboard: IKeyboard) {
}
