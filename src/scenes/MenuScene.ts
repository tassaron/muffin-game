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


export let ExampleSceneList: MenuSceneList = [
    [BallsScene, "Balls Scene"],
    [PipesScene, "Pipes Scene"],
    [BallsAndPipesScene, "Balls + Pipes Scene"],
];
export type MenuSceneOption = [typeof Scene, string];
export type MenuSceneList = MenuSceneOption[];


export function newBackButton(game: IGame, scene: typeof Scene) {
    const backButton = new Button(game, RectangleActor, 120, 50, "< Back");
    backButton.x = 60;
    backButton.y = 25;
    backButton.interactive = true;
    backButton.pointertap = (_: Event) => game.changeScene(new scene(game));
    return backButton;
}


export function newMenuButtons(scene: MenuScene) {
    /*
     * Creates menu buttons as actors on the given scene object
    */
    scene.timer = null;
    scene.explosions = [
        undefined,
        undefined
    ];
    if (scene.sceneList === undefined) {
        logger.error("Using the example scene list for this menu scene");
        scene.sceneList = ExampleSceneList;
    }
    scene.buttons = scene.sceneList.map(
        (arr: [typeof Scene, string]) =>  new Button(scene.game, RectangleActor, 320, 50, arr[1])
    );

    const mountExplosion = (i: number, offset: number) => {
        if (scene.mounted && scene.explosions[i] === undefined) {
            const explosion = scene.game.sprites.explosion();
            explosion.x = scene.game.width / 2;
            explosion.y = (scene.game.height / 2) + offset;
            scene.mounted.addChild(explosion);
            scene.mounted.removeChild(scene.buttons[i]);
            scene.explosions[i] = scene.addActors([explosion])[0];
        }
    }

    for (let i = scene.buttons.length - 1; i > -1; i--) {
        scene.buttons[i].interactive = true;
        scene.buttons[i].pointertap = (_: Event) => mountExplosion(i, (i * 25) - 25);
    }
    scene.addActors(scene.buttons);
    
    const _scenes = scene.sceneList.map(
        (arr: [typeof Scene, string]) => arr[0]
    );

    const tickExplosions = (delta: number, keyboard: IKeyboard) => {
        if (keyboard.number == 1) {
            // @ts-ignore -_-
            scene.buttons[0].pointertap();
        }
        for (let i = 0; i < scene.explosions.length; i++) {
            if (scene.explosions[i] === undefined) continue;
            const explosion = (scene.actors[<string>scene.explosions[i]] as IAnimatedActor);
            if (explosion.loops > 0) {
                (scene.mounted as PIXI.Container).removeChild(explosion);
                delete scene.actors[<string>scene.explosions[i]]
                scene.mounted = null;
                if (!scene.timer) {
                    scene.timer = scene.game.startTimer(() => scene.game.changeScene(new _scenes[i](scene.game)), 10.0, "leave menu");
                }
            }
        }
    }
    scene.beforeTick.add(tickExplosions);
}


export function placeMenuButtons(scene: MenuScene) {
    console.log(scene.game.width);
    for (let i = scene.buttons.length - 1; i > -1; i--) {
        scene.buttons[i].x = scene.game.width / 2;
        scene.buttons[i].y = (scene.game.height / 3)*2 - (scene.buttons.length * 50) + (i * 50);
    }
}


export default class MenuScene extends Scene {
    timer: null | number = null;
    sceneList: MenuSceneList = ExampleSceneList;
    _scenes!: typeof Scene[];
    buttons!: Button[];
    explosions!: (string | undefined)[];
    mountExplosion!: (i: number, offset: number) => void;

    constructor(game: IGame) {
        super(game);
        newMenuButtons(this);
        this.beforeMount.add(() => placeMenuButtons(this));
        logger.info("Created Menu scene");
    }
}
