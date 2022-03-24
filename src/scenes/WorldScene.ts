import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import DrawnEllipse from "../entities/DrawnEllipse";
import DrawnRectangle from "../entities/DrawnRectangle";
import Collider from "../entities/Collider";
import IKeyboard from "../interfaces/IKeyboard";


class Ball extends Collider {
    dx = 0.0;
    dy = 0.0;

    tick(delta: number, keyboard: IKeyboard) {
        if (this.x + this.collisionWidth > this.game.width || this.x < 0.0) {
            this.dx = -this.dx;
        }
        this.x += this.dx * delta;

        if (this.y + this.collisionHeight > this.game.height || this.y < 0.0) {
            this.dy = -this.dy;
        }
        this.y += this.dy * delta;
    }
}


export default class WorldScene extends BaseScene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);
        this.actors.balls = [
            new Ball(game, new DrawnEllipse(game, 30, 30, 0x666666, null), 60, 60),
            new Ball(game, new DrawnRectangle(game, 60, 60, 0x666666, null), 60, 60)
        ];
        this.placeBalls();
        logger.info("Created World scene");
    }

    placeBalls() {
        for (let ball of this.actors.balls) {
            ball.x = Math.min(Math.max(60, Math.random() * this.game.width), this.game.width - 60);
            ball.y = Math.min(Math.max(60, Math.random() * this.game.height), this.game.height - 60);
            ball.dx = Math.max(Math.random() * 10, 1.0);
            ball.dy = Math.max(Math.random() * 10, 1.0);
        }
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

    tick(delta: number, keyboard: IKeyboard) {
        for (let ball of this.actors.balls) {
            ball.tick(delta, keyboard);
        }
        if (keyboard.number == 1) {
            this.placeBalls();
            keyboard.disable(5.0);
        }
        for (let i = 0; i < this.actors.balls.length; i++) {
            for (let j = 0; j < this.actors.balls.length; j++) {
                if (i == j) continue;
                if (this.actors.balls[i].collides(this.actors.balls[j])) {
                    this.actors.balls[i].dx = -this.actors.balls[i].dx;
                    this.actors.balls[i].dy = -this.actors.balls[i].dy;
                }
            }
        }
    }
}