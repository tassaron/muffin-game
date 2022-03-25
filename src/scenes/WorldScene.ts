import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseScene from "./BaseScene";
import DrawnEllipse from "../entities/DrawnEllipse";
import DrawnRectangle from "../entities/DrawnRectangle";
import Collider from "../entities/Collider";
import IKeyboard from "../interfaces/IKeyboard";
import GridLayout from "../entities/GridLayout";


class Ball extends Collider {
    dx = 0.0;
    dy = 0.0;

    tick(delta: number, keyboard: IKeyboard) {
        if (this.x < 0.0) {
            this.dx = Math.abs(this.dx);
        } else if (this.x + this.collisionWidth > this.game.width) {
            this.dx = Math.abs(this.dx) * -1;
        }
        this.x += this.dx * delta;

        if (this.y < 0.0) {
            this.dy = Math.abs(this.dy);
        } else if (this.y + this.collisionHeight > this.game.height) {
            this.dy = Math.abs(this.dy) * -1;
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
        this.actors.gridContainer = new PIXI.Container();
        this.actors.gridContainer.x = 32;
        this.actors.gridContainer.y = 32;
        this.actors.grid = new GridLayout(8, 8, 32, game.sprites.explosion);
        this.actors.grid[2][2] = new DrawnRectangle(game, 32, 32, 0x666666);
        this.actors.grid[3][3] = new DrawnRectangle(game, 32, 32, 0x666666);
        this.actors.grid[4][4] = new DrawnRectangle(game, 32, 32, 0x666666);
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
        container.addChild(this.actors.gridContainer);
        this.actors.grid.mount(this.actors.gridContainer);
        for (let ball of this.actors.balls) {
            container.addChild(ball);
        }
    }

    unmount(container: PIXI.Container) {
        for (let ball of this.actors.balls) {
            container.removeChild(ball);
        }
        container.removeChild(this.actors.gridContainer);
        this.actors.grid.unmount(container);
    }

    tick(delta: number, keyboard: IKeyboard) {
        this.actors.grid.tick(delta, keyboard);
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