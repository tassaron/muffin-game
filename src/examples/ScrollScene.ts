import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import IGame from "../interfaces/IGame";
import Scene from "../scenes/Scene";
import RectangleActor from "../actors/RectangleActor";
import GridScene from "../grids/GridScene";
import MenuScene, { newBackButton } from "../scenes/MenuScene";
import TileActor from "../actors/TileActor";
import TriangleActor from "../actors/TriangleActor";
import IKeyboard from "../interfaces/IKeyboard";


class OuterScrollScene extends Scene {
    subcontainer = new PIXI.Container();
    scrollContainer: PIXI.Container;
    scrollYMax: number;
    scrollStepSize: number;
    scrollYDest = 0;
    scrollYSpeed = 0;
    prevScrollYDest = 0;

    constructor(game: IGame, container: PIXI.Container, scrollStepSize: number) {
        super(game);
        this.scrollContainer = container;
        this.scrollStepSize = scrollStepSize;
        this.scrollYMax = game.height(50);
        const vertWall = () => new RectangleActor(game, game.width(5), game.height(100), 0x000000, null);
        const horiWall = () => new RectangleActor(game, game.width(100), game.height(5), 0x000000, null);
        const leftWall = vertWall();
        const rightWall = vertWall();
        let topWall = horiWall();
        let bottomWall = horiWall();

        const newTriangle = () => {
            return new TriangleActor(game, game.width(4), game.height(4), 0xffffff, 0x6600ee);
        }
        const newArrow = (angle: number) => {
            const arrow = newTriangle();
            arrow.angle = angle;
            arrow.anchor.x = 0.5;
            arrow.anchor.y = 0.5;
            return arrow
        };
        const newNavArrow = (direction: "x" | "y", amt: number) => {
            const arrow = newArrow(direction == "y" ? amt > 0 ? 180 : 0 : amt > 0 ? 270 : 90);
            arrow.interactive = true;
            if (direction == "y") {
                arrow.onTap((e: Event) => this.scrollY(amt));
            } else {
                // this.scrollX(amt);
            }
            return arrow;
        };
        let upArrow = newNavArrow("y", 1);
        let downArrow = newNavArrow("y", -1);

        topWall.addChild(upArrow);
        bottomWall.addChild(downArrow);
        this.subcontainer.addChild(leftWall, rightWall, topWall, bottomWall);
        this.actors.backButton = newBackButton(game, (game) => new MenuScene(game));

        this.beforeMount.add(() => {
            if (topWall.width != game.width(100)) {
                this.subcontainer.removeChild(topWall);
                this.subcontainer.removeChild(bottomWall);
                topWall = horiWall();
                bottomWall = horiWall();
                this.subcontainer.addChild(topWall);
                this.subcontainer.addChild(bottomWall);
                upArrow = newNavArrow("y", 1);
                downArrow = newNavArrow("y", -1);
                topWall.addChild(upArrow);
                bottomWall.addChild(downArrow);
            }
            topWall.x = 0;
            topWall.y = 0;
            upArrow.x = topWall.width / 2;
            upArrow.y = upArrow.height / 2;
            downArrow.x = bottomWall.width / 2;
            downArrow.y = downArrow.height / 2;
            leftWall.x = 0;
            leftWall.y = 0;
            rightWall.x = game.width(100) - rightWall.width;
            rightWall.y = 0;
            bottomWall.x = 0;
            bottomWall.y = game.height(100) - bottomWall.height;
        });
    }

    scrollY(factor: number) {
        this.scrollYSpeed = Math.max(Math.min(this.scrollYSpeed + factor, 4), -4);
        logger.debug(`Scroll speed: ${this.scrollYSpeed}`);
        if (this.scrollYSpeed == 0) return;
        this.prevScrollYDest = Number(this.scrollYDest);
        this.scrollYDest = Math.min(
            Math.max(
                -this.scrollYMax,
                this.scrollYDest + (this.scrollYSpeed * this.scrollStepSize),
            ), this.scrollYMax,
        );
    }

    tick(delta: number, keyboard: IKeyboard) {
        if (this.scrollContainer.y == this.scrollYDest) {
            this.scrollYSpeed = 0;
        } else if (this.scrollYSpeed != 0) {
            let clamp = Math.min;
            if (this.scrollYDest < this.prevScrollYDest) clamp = Math.max;
            if (Math.abs(this.scrollYDest + this.prevScrollYDest) >= this.scrollStepSize) {
                this.scrollContainer.y = Math.min(
                    Math.max(
                        -this.scrollYMax,
                        this.scrollContainer.y + (delta * this.scrollYSpeed),
                    ),
                    this.scrollYMax,
                );
            }
            if (Math.abs(this.scrollContainer.y) == this.scrollYMax) {
                this.scrollYDest = this.scrollContainer.y;
            }
        }
    }
}


export default class ScrollScene extends Scene {
    constructor(game: IGame) {
        super(game);
        
        // A pipe factory :P
        const newPipe = () => {
            const pipe = (game.sprites.pipe() as TileActor);
            pipe.interactive = true;
            let y = 0;
            let x = 0;
            pipe.onTap((_: Event) => {
                pipe.setFrame[y][x]?.();
                x++;
                if (x == pipe.gridRectangle.cols - 1) {
                    x = 0;
                    y = y == 1 ? 0 : 1;
                }
            });
            return pipe;
        }

        // Create a GridScene with some pipes and junk
        const grid = new GridScene(this.game, 12, 16, 72, { initial: newPipe });
        grid[3][3] = new RectangleActor(game, 72, 72, 0x666666);
        grid[4][4] = new RectangleActor(game, 72, 72, 0x666666);
        grid.subcontainer = new PIXI.Container();
        this.beforeMount.add((container: PIXI.Container) => {
            grid.subcontainer!.x = (this.game.width(100) - (grid.gridSize * grid.rows)) / 4;
            grid.subcontainer!.y = (this.game.height(100)  - (grid.gridSize * grid.cols)) / 4;
        });

        const outerScene = new OuterScrollScene(game, grid.subcontainer, grid.gridSize);
        outerScene.subcontainer.x = 0;
        outerScene.subcontainer.y = 0;
        this.subscenes = [grid, outerScene];

        logger.info("Created Pipes scene");
    }
}
