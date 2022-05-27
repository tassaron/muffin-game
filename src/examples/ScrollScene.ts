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
import IActor from "../interfaces/IActor";


class OuterScrollScene extends Scene {
    subcontainer = new PIXI.Container();
    scrollContainer: PIXI.Container;
    scrollStepSize: number;

    scrollYSpeed = 0;
    scrollYMax: number; // set to game.height(50) in constructor
    scrollYDest = 0;
    prevScrollYDest = 0;

    scrollXSpeed = 0;
    scrollXMax: number; // set to game.width(50) in constructor
    scrollXDest = 0;
    prevScrollXDest = 0;

    constructor(game: IGame, container: PIXI.Container, scrollStepSize: number) {
        super(game);

        const startScrollingX = (amt: number) => this.scrollX((amt ^ 4) - 1);
        const stopScrollingX = () => {
            this.scrollXDest = this.scrollContainer.x;
            this.scrollXSpeed = 0;
        };

        const startScrollingY = (amt: number) => this.scrollY((amt ^ 4) - 1);
        const stopScrollingY = () => {
            this.scrollYDest = this.scrollContainer.y;
            this.scrollYSpeed = 0;
        };

        const buildScrollControl = (actor: IActor, direction: "x" | "y", amt: number) => {
            actor.interactive = true;
            if (direction == "y") {
                actor.onTap(() => startScrollingY(amt), stopScrollingY);
            } else {
                actor.onTap(() => startScrollingX(amt), stopScrollingX);
            }
            return actor;
        }

        // Scrolling with touch-dragging (a buggy WIP)
        (container as any).touchend = () => { stopScrollingY(); stopScrollingX() };
        (container as any).on("touchmove", (e: any) => {
            const touchY = e.data.originalEvent.movementY;
            if (Math.abs(container.y - touchY) > 50) {
                this.scrollYSpeed = touchY > container.y ? 4 : -4;
                this.prevScrollYDest = Number(this.scrollYDest);
                this.scrollYDest = this.scrollYDest + touchY;
            }

            const touchX = e.data.originalEvent.movementX
            if (Math.abs(container.x - touchX) > 50) {
                this.scrollXSpeed = touchX > container.x ? 4 : -4;
                this.prevScrollXDest = Number(this.scrollXDest);
                this.scrollXDest = this.scrollXDest + touchX;
            }
        });
        (container as any).interactive = true;

        this.scrollContainer = container;
        this.scrollStepSize = scrollStepSize;
        this.scrollYMax = game.height(50);
        this.scrollXMax = game.width(50);
        const vertWall = (amt: number) => buildScrollControl(new RectangleActor(game, game.width(5), game.height(100), 0x000000, null), "x", amt);
        const horiWall = (amt: number) => buildScrollControl(new RectangleActor(game, game.width(100), game.height(5), 0x000000, null), "y", amt);
        let leftWall = vertWall(1);
        let rightWall = vertWall(-1);
        let topWall = horiWall(1);
        let bottomWall = horiWall(-1);

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
        const newNavArrow = (direction: "x" | "y", amt: number) =>
            buildScrollControl(newArrow(direction == "y" ? amt > 0 ? 180 : 0 : amt > 0 ? 90 : 270), direction, amt);
        let upArrow = newNavArrow("y", 1);
        let downArrow = newNavArrow("y", -1);
        let leftArrow = newNavArrow("x", 1);
        let rightArrow = newNavArrow("x", -1);

        leftWall.addChild(leftArrow);
        rightWall.addChild(rightArrow);
        topWall.addChild(upArrow);
        bottomWall.addChild(downArrow);
        this.subcontainer.addChild(leftWall, rightWall, topWall, bottomWall);
        this.actors.backButton = newBackButton(game, (game) => new MenuScene(game));

        this.beforeMount.add(() => {
            // Recreate left/right walls if needed
            if (leftWall.height != game.height(100)) {
                this.subcontainer.removeChild(leftWall);
                this.subcontainer.removeChild(rightWall);
                leftWall = vertWall(1);
                rightWall = vertWall(-1);
                this.subcontainer.addChild(leftWall);
                this.subcontainer.addChild(rightWall);
                leftArrow = newNavArrow("x", 1);
                rightArrow = newNavArrow("x", -1);
                leftWall.addChild(leftArrow);
                rightWall.addChild(rightArrow);
            }

            // Recreate top/bottom walls if needed
            if (topWall.width != game.width(100)) {
                this.subcontainer.removeChild(topWall);
                this.subcontainer.removeChild(bottomWall);
                topWall = horiWall(1);
                bottomWall = horiWall(-1);
                this.subcontainer.addChild(topWall);
                this.subcontainer.addChild(bottomWall);
                upArrow = newNavArrow("y", 1);
                downArrow = newNavArrow("y", -1);
                topWall.addChild(upArrow);
                bottomWall.addChild(downArrow);
            }

            leftWall.x = 0;
            leftWall.y = 0;
            leftArrow.x = leftArrow.width / 2;
            leftArrow.y = leftWall.height / 2;
            rightWall.x = game.width(100) - rightWall.width;
            rightWall.y = 0;
            rightArrow.x = rightArrow.width / 2;
            rightArrow.y = rightWall.height / 2;
            topWall.x = 0;
            topWall.y = 0;
            upArrow.x = topWall.width / 2;
            upArrow.y = upArrow.height / 2;
            bottomWall.x = 0;
            bottomWall.y = game.height(100) - bottomWall.height;
            downArrow.x = bottomWall.width / 2;
            downArrow.y = downArrow.height / 2;
        });
    }

    scrollY(factor: number) {
        this.scrollYSpeed = Math.max(Math.min(this.scrollYSpeed + factor, 4), -4);
        logger.debug(`Scroll Y speed: ${this.scrollYSpeed}`);
        if (this.scrollYSpeed == 0) return;
        this.prevScrollYDest = Number(this.scrollYDest);
        this.scrollYDest = Math.min(
            Math.max(
                -this.scrollYMax,
                this.scrollYDest + (this.scrollYSpeed * this.scrollStepSize),
            ), this.scrollYMax,
        );
    }

    scrollX(factor: number) {
        this.scrollXSpeed = Math.max(Math.min(this.scrollXSpeed + factor, 4), -4);
        logger.debug(`Scroll X speed: ${this.scrollXSpeed}`);
        if (this.scrollXSpeed == 0) return;
        this.prevScrollXDest = Number(this.scrollXDest);
        this.scrollXDest = Math.min(
            Math.max(
                -this.scrollXMax,
                this.scrollXDest + (this.scrollXSpeed * this.scrollStepSize),
            ), this.scrollXMax,
        );
    }

    tick(delta: number, keyboard: IKeyboard) {
        // Handle x-scroll
        if (this.scrollContainer.x == this.scrollXDest) {
            this.scrollXSpeed = 0;
        } else if (this.scrollXSpeed != 0) {
            let clamp = Math.min;
            if (this.scrollXDest < this.prevScrollXDest) clamp = Math.max;
            if (Math.abs(this.scrollXDest + this.prevScrollXDest) >= this.scrollStepSize) {
                this.scrollContainer.x = Math.min(
                    Math.max(
                        -this.scrollXMax,
                        this.scrollContainer.x + (delta * this.scrollXSpeed),
                    ),
                    this.scrollXMax,
                );
            }
            if (Math.abs(this.scrollContainer.x) == this.scrollXMax) {
                this.scrollXDest = this.scrollContainer.x;
            }
        }

        // Handle y-scroll
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
            grid.subcontainer!.y = (this.game.height(100) - (grid.gridSize * grid.cols)) / 4;
        });

        const outerScene = new OuterScrollScene(game, grid.subcontainer, grid.gridSize);
        outerScene.subcontainer.x = 0;
        outerScene.subcontainer.y = 0;
        this.subscenes = [grid, outerScene];

        logger.info("Created Pipes scene");
    }
}
