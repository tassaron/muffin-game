import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import EllipseActor from "../actors/EllipseActor";
import RectangleActor from "../actors/RectangleActor";
import CollisionActor from "../actors/CollisionActor";
import IKeyboard from "../interfaces/IKeyboard";
import { newBackButton } from "./MenuScene";


class Ball extends CollisionActor {
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
    balls: Ball[];

    constructor(game: IGame) {
        super(game);

        this.actors.backButton = newBackButton(game);

        // Create balls to bounce around the screen
        this.balls = [
            new Ball(game, new EllipseActor(game, 30, 30, 0x666666, null), 60, 60),
            new Ball(game, new RectangleActor(game, 60, 60, 0x666666, null), 60, 60)
        ]
        this.addActors(this.balls);
        this.placeBalls();
        
        // A clickable sprite that triggers a game over
        this.actors.fuel = game.sprites.fuel();
        this.actors.fuel.interactive = true;
        this.actors.fuel.pointertap = (_: Event) => game.gameOver();
        this.actors.fuel.x = this.game.width - 100;
        this.actors.fuel.y = this.game.height - 100;
        this.actors.fuel.anchor.x = 0.5;
        this.actors.fuel.anchor.y = 0.5;
        // this.actors.fuel.blendMode = PIXI.BLEND_MODES.ADD;

        logger.info("Created Balls scene");
    }

    placeBalls() {
        for (let ball of this.balls) {
            ball.x = Math.min(Math.max(60, Math.random() * this.game.width), this.game.width - 60);
            ball.y = Math.min(Math.max(60, Math.random() * this.game.height), this.game.height - 60);
            ball.dx = Math.max(Math.random() * 10, 1.0);
            ball.dy = Math.max(Math.random() * 10, 1.0);
        }
    }

    tick(delta: number, keyboard: IKeyboard) {
        super.tick(delta, keyboard);
        this.actors.fuel.rotation += 0.01 * delta;
        if (keyboard.number == 1) {
            this.placeBalls();
            keyboard.disable(5.0);
        }
        const collisions = new Set();
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = 0; j < this.balls.length; j++) {
                if (i == j || collisions.has(j)) continue;
                collisions.add([i, j]);
                if (this.balls[i].collides(this.balls[j])) {
                    this.balls[i].dx = -this.balls[i].dx;
                    this.balls[i].dy = -this.balls[i].dy;
                }
            }
        }
    }
}
