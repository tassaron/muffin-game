import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import Button from "../actors/ButtonActor";
import BallsScene from "./BallsScene";
import PipesScene from "./PipesScene";
import RectangleActor from "../actors/RectangleActor";


export function newBackButton(game: IGame) {
    const backButton = new Button(game, RectangleActor, 120, 50, "< Back");
    backButton.x = 60;
    backButton.y = 25;
    (backButton as any).interactive = true;
    (backButton as any).click = (_: Event) => game.changeScene(new MenuScene(game));
    return backButton;
}


export default class MenuScene extends Scene {
    actors: any = {};
    scenes: typeof Scene[];
    timer: null | number = null;

    constructor(game: IGame) {
        super(game);
        this.actors.buttons = [
            new Button(game, RectangleActor, 300, 50, "Balls Example"),
            new Button(game, RectangleActor, 300, 50, "Pipes Example"),
        ];
        this.actors.buttons[0].x = game.width / 2;
        this.actors.buttons[1].x = game.width / 2;
        this.actors.buttons[0].y = (game.height / 2) - 25;
        this.actors.buttons[1].y = (game.height / 2) + 25;
        this.actors.explosions = [undefined, undefined];

        this.scenes = [BallsScene, PipesScene];
        
        // Hook events to buttons
        for (let i = 0; i < this.actors.buttons.length; i++) {
            this.actors.buttons[i].interactive = true;
            this.actors.buttons[i].click = (_: Event) => this.mountExplosion(i, (i * 25) - 25);
        }
        
        logger.info("Created Menu scene");
    }

    mount(container: PIXI.Container) {
        this.game.prevScene.unmount(container);
        this.mounted = container;
        for (let button of this.actors.buttons) {
            container.addChild(button);
        }
    }

    unmount(container: PIXI.Container) {
        this.mounted = null;
        for (let button of this.actors.buttons) {
            container.removeChild(button);
        }
        for (let explosion of this.actors.explosions) {
            container.removeChild(explosion);
        }
    }

    tick(delta: number, keyboard: any) {
        if (!this.mounted) return;
        if (keyboard.number == 1) {
            this.actors.buttons[0].click();
        }
        for (let i = 0; i < this.actors.explosions.length; i++) {
            if (this.actors.explosions[i] === undefined) continue;
            this.actors.explosions[i].tick(delta);
            if (this.actors.explosions[i].loops > 0) {
                (this.mounted as PIXI.Container).removeChild(this.actors.explosions[i]);
                this.mounted = null;
                if (!this.timer) {
                    this.timer = this.game.startTimer(() => this.game.changeScene(new this.scenes[i](this.game)), 10.0);
                }
            }
        }
    }

    mountExplosion(i: number, offset: number) {
        if (this.mounted && this.actors.explosions[i] === undefined) {
            this.actors.explosions[i] = this.game.sprites.explosion();
            this.actors.explosions[i].x = this.game.width / 2;
            this.actors.explosions[i].y = (this.game.height / 2) + offset;
            this.mounted.addChild(this.actors.explosions[i]);
            this.mounted.removeChild(this.actors.buttons[i]);
        }
    }
}
