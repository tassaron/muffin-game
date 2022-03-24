import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import DrawnEllipse from "../entities/DrawnEllipse";


export default class WorldScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        const ball = () => new DrawnEllipse(game, 30, 30, 0x666666, null);
        this.actors.balls = [
            ball(), ball(), ball(), ball()
        ];
        for (let ball of this.actors.balls) {
            ball.x = Math.random() * this.game.width;
            ball.y = Math.random() * this.game.height;
        }
        logger.info("Created World scene");
    }

    mount(container: PIXI.Container) {
        this.game.prevScene.unmount(container);
        for (let ball of this.actors.balls) {
            container.addChild(ball);
        }
    }

    unmount(container: PIXI.Container) {
        for (let ball of this.actors.balls) {
            container.removeChild(ball);
        }
    }
}