import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import BallsScene from "./BallsScene";
import PipesScene from "./PipesScene";
import IKeyboard from "../interfaces/IKeyboard";


export default class BallsAndPipesScene extends Scene {
    pipeContainer: PIXI.Container;
    direction = 1;

    constructor(game: IGame) {
        super(game);
        const pipesScene = new PipesScene(game);
        this.pipeContainer = (pipesScene.subscenes[0].subcontainer as PIXI.Container)
        this.subscenes = [new BallsScene(game), pipesScene];
        const changeDirection = () => {
            this.direction = this.direction == 1 ? -1 : 1;
            this.game.startTimer(changeDirection, 60.0);
        }
        changeDirection();
    }

    tick(delta: number, keyboard: IKeyboard) {
        super.tick(delta, keyboard);
        this.pipeContainer.rotation += (delta / 100) * this.direction;
    }
}