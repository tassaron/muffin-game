import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import IGame from "../interfaces/IGame";
import IKeyboard from "../interfaces/IKeyboard";
import IAnimatedActor from "../interfaces/IAnimatedActor";
import Scene from "./Scene";
import RectangleActor from "../actors/RectangleActor";
import Button from "../actors/ButtonActor";
import BallsScene from "../examples/BallsScene";
import PipesScene from "../examples/PipesScene";
import BallsAndPipesScene from "../examples/BallsAndPipesScene";


export const ExampleSceneList: MenuSceneList = [
    [BallsScene, "Balls Scene"],
    [PipesScene, "Pipes Scene"],
    [BallsAndPipesScene, "Balls + Pipes Scene"],
];
export type MenuSceneOption = [typeof Scene, string];
export type MenuSceneList = MenuSceneOption[];


export function newBackButton(game: IGame, sceneList: MenuSceneList) {
    const backButton = new Button(game, RectangleActor, 120, 50, "< Back");
    backButton.x = 60;
    backButton.y = 25;
    backButton.interactive = true;
    const menuScene = new MenuScene(game);
    if (sceneList) menuScene.sceneList = sceneList;
    backButton.pointertap = (_: Event) => game.changeScene(menuScene);
    return backButton;
}


export default class MenuScene extends Scene {
    _scenes: typeof Scene[];
    timer: null | number = null;
    buttons: Button[];
    explosions: (string | undefined)[];
    sceneList: MenuSceneList = ExampleSceneList;

    constructor(game: IGame) {
        super(game);
        this._scenes = this.sceneList.map(
            (arr: [typeof Scene, string]) => arr[0]
        );
        this.explosions = [
            undefined,
            undefined
        ];
        this.buttons = this.sceneList.map(
            (arr: [typeof Scene, string]) =>  new Button(game, RectangleActor, 320, 50, arr[1])
        );
        for (let i = this.buttons.length - 1; i > -1; i--) {
            this.buttons[i].x = game.width / 2;
            this.buttons[i].y = (game.height / 3)*2 - (this.buttons.length * 50) + (i * 50);
            this.buttons[i].interactive = true;
            this.buttons[i].pointertap = (_: Event) => this.mountExplosion(i, (i * 25) - 25);
        }
        this.addActors(this.buttons);
        
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
                    this.timer = this.game.startTimer(() => this.game.changeScene(new this._scenes[i](this.game)), 10.0);
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
