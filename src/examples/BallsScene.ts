import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import IGame from "../interfaces/IGame";
import Scene from "../scenes/Scene";
import RectangleActor from "../actors/RectangleActor";
import RectangleCollisionAction from "../actors/actions/RectangleCollisionAction";
import IKeyboard from "../interfaces/IKeyboard";
import MenuScene, { newBackButton } from "../scenes/MenuScene";


export class Ball extends RectangleActor {
    dx = 0.0;
    dy = 0.0;
    collision: RectangleCollisionAction;

    constructor(game: IGame) {
        super(game, 60, 60, 0x666666, null);
        this.collision = new RectangleCollisionAction(this);
    }

    tick(delta: number, keyboard: IKeyboard) {
        super.tick(delta, keyboard);
        if (this.x < 0.0) {
            this.dx = Math.abs(this.dx);
        } else if (this.x + this.width > this.game.width(100)) {
            this.dx = Math.abs(this.dx) * -1;
        }
        this.x += this.dx * delta;

        if (this.y < 0.0) {
            this.dy = Math.abs(this.dy);
        } else if (this.y + this.height > this.game.height(100)) {
            this.dy = Math.abs(this.dy) * -1;
        }
        this.y += this.dy * delta;
    }
}


export default class BallsScene extends Scene {
    balls: Ball[];

    constructor(game: IGame) {
        super(game);

        this.actors.backButton = newBackButton(game, (game) => new MenuScene(game));

        // Create balls to bounce around the screen
        this.balls = [
            new Ball(game),
            new Ball(game),
            new Ball(game),
        ]
        this.addActors(this.balls);
        this.placeBalls();
        
        // A clickable sprite that triggers a game over
        this.actors.fuel = game.sprites.fuel();
        this.actors.fuel.interactive = true;
        this.actors.fuel.onTap((_: Event) => game.gameOver());
        this.actors.fuel.anchor.x = 0.5;
        this.actors.fuel.anchor.y = 0.5;
        
        // Make another clickable fuel as a child of another actor
        // this allows to test how nesting actors work in the engine. 
        const fuel = game.sprites.fuel();
        this.balls[0].addChild(fuel);
        fuel.blendMode = PIXI.BLEND_MODES.ADD;
        fuel.interactive = true;
        fuel.onTap((e: Event) => {fuel.width += 10; logger.error("DDS")});

        this.beforeMount.add((container: PIXI.Container) => {
            this.actors.fuel.x = this.game.width(100) - 100;
            this.actors.fuel.y = this.game.height(100) - 100;
            fuel.x = this.balls[0]._width / 2;
            fuel.y = 0;
        });

        logger.info("Created Balls scene");
    }

    placeBalls() {
        for (let ball of this.balls) {
            ball.x = Math.min(Math.max(60, Math.random() * this.game.width(100)), this.game.width(100) - 60);
            ball.y = Math.min(Math.max(60, Math.random() * this.game.height(100)), this.game.height(100) - 60);
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
                if (this.balls[i].collision.collides(this.balls[j].collision)) {
                    this.balls[i].dx = -this.balls[i].dx;
                    this.balls[i].dy = -this.balls[i].dy;
                }
            }
        }
    }
}
