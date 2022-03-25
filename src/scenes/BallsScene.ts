import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import DrawnEllipse from "../entities/DrawnEllipse";
import DrawnRectangle from "../entities/DrawnRectangle";
import Collider from "../entities/Collider";
import IKeyboard from "../interfaces/IKeyboard";


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


export default class BallsScene extends Scene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        // Create balls to bounce around the screen
        this.actors.balls = [
            new Ball(game, new DrawnEllipse(game, 30, 30, 0x666666, null), 60, 60),
            new Ball(game, new DrawnRectangle(game, 60, 60, 0x666666, null), 60, 60)
        ];
        this.placeBalls();
        
        // A clickable sprite that triggers a game over
        this.actors.fuel = game.sprites.fuel();
        this.actors.fuel.interactive = true;
        this.actors.fuel.click = (_: Event) => game.gameOver();
        this.actors.fuel.x = this.game.width - 100;
        this.actors.fuel.y = this.game.height - 100;

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
        container.addChild(this.actors.fuel);
        for (let ball of this.actors.balls) {
            container.addChild(ball);
        }
    }

    unmount(container: PIXI.Container) {
        for (let ball of this.actors.balls) {
            container.removeChild(ball);
        }
        container.removeChild(this.actors.fuel);
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
