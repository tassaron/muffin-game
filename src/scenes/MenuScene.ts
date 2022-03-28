import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import IKeyboard from "../interfaces/IKeyboard";
import IAnimatedActor from "../interfaces/IAnimatedActor";
import Scene from "./Scene";
import BallsScene from "./BallsScene";
import PipesScene from "./PipesScene";
import RectangleActor from "../actors/RectangleActor";
import Button from "../actors/ButtonActor";


export function newBackButton(game: IGame) {
    const backButton = new Button(game, RectangleActor, 120, 50, "< Back");
    backButton.x = 60;
    backButton.y = 25;
    backButton.interactive = true;
    backButton.pointertap = (_: Event) => game.changeScene(new MenuScene(game));
    return backButton;
}


export default class MenuScene extends Scene {
    scenes: typeof Scene[];
    timer: null | number = null;
    buttons: Button[];
    explosions: (string | undefined)[];

    constructor(game: IGame) {
        super(game);
        this.scenes = [
            BallsScene,
            PipesScene
        ];
        this.explosions = [
            undefined,
            undefined
        ];
        this.buttons = [
            new Button(game, RectangleActor, 300, 50, "Balls Example"),
            new Button(game, RectangleActor, 300, 50, "Pipes Example"),
        ];
        this.buttons[0].x = game.width / 2;
        this.buttons[1].x = game.width / 2;
        this.buttons[0].y = (game.height / 2) - 25;
        this.buttons[1].y = (game.height / 2) + 25;
        this.addActors(this.buttons);

        // Hook events to buttons
        for (let i = 0; i < this.buttons.length; i++) {
            this.buttons[i].interactive = true;
            this.buttons[i].pointertap = (_: Event) => this.mountExplosion(i, (i * 25) - 25);
        }
        
        logger.info("Created Menu scene");
    }

    tick(delta: number, keyboard: IKeyboard) {
        if (!this.mounted) return;
        super.tick(delta, keyboard);
        if (keyboard.number == 1) {
            // @ts-ignore -_-
            this.buttons[0].pointertap();
        }
        for (let i = 0; i < this.explosions.length; i++) {
            if (this.explosions[i] === undefined) continue;
            const explosion = (this.actors[<string>this.explosions[i]] as IAnimatedActor);
            if (explosion.loops > 0) {
                (this.mounted as PIXI.Container).removeChild(explosion);
                delete this.actors[<string>this.explosions[i]]
                this.mounted = null;
                if (!this.timer) {
                    this.timer = this.game.startTimer(() => this.game.changeScene(new this.scenes[i](this.game)), 10.0);
                }
            }
        }
    }

    mountExplosion(i: number, offset: number) {
        if (this.mounted && this.explosions[i] === undefined) {
            const explosion = this.game.sprites.explosion();
            explosion.x = this.game.width / 2;
            explosion.y = (this.game.height / 2) + offset;
            this.mounted.addChild(explosion);
            this.mounted.removeChild(this.buttons[i]);
            this.explosions[i] = this.addActors([explosion])[0];
        }
    }
}
