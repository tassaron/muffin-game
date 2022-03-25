import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import DrawnEllipse from "../entities/DrawnEllipse";
import DrawnRectangle from "../entities/DrawnRectangle";
import IKeyboard from "../interfaces/IKeyboard";
import EntityGrid from "../layouts/EntityGrid";


export default class PipesScene extends Scene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        // Create a EntityGrid with some random junk
        this.actors.gridContainer = new PIXI.Container();
        this.actors.gridContainer.x = 32;
        this.actors.gridContainer.y = 32;
        this.actors.grid = new EntityGrid(8, 8, 32, game.sprites.explosion);
        this.actors.grid[2][2] = new DrawnEllipse(game, 16, 16, 0x666666);
        this.actors.grid[3][3] = new DrawnRectangle(game, 32, 32, 0x666666);
        this.actors.grid[4][4] = new DrawnRectangle(game, 32, 32, 0x666666);

        // Make a TileSprite that changes tile frame when clicked
        this.actors.pipe = game.sprites.pipe();
        this.actors.pipe.textureGrid.setFrame[0][0]();
        this.actors.pipe.interactive = true;
        this.actors.pipe.click = (_: Event) => {
            this.actors.pipe.textureGrid.setFrame[0][1]?.();
        }

        logger.info("Created World scene");
    }

    mount(container: PIXI.Container) {
        this.game.prevScene.unmount(container);
        container.addChild(this.actors.pipe);
        container.addChild(this.actors.gridContainer);
        this.actors.grid.mount(this.actors.gridContainer);
    }

    unmount(container: PIXI.Container) {
        container.removeChild(this.actors.pipe);
        container.removeChild(this.actors.gridContainer);
        this.actors.grid.unmount(this.actors.gridContainer);
    }

    tick(delta: number, keyboard: IKeyboard) {
        this.actors.grid.tick(delta, keyboard);
    }
}
