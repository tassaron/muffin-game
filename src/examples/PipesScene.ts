import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import IGame from "../interfaces/IGame";
import Scene from "../scenes/Scene";
import RectangleActor from "../actors/RectangleActor";
import GridScene from "../grids/GridScene";
import MenuScene, { newBackButton } from "../scenes/MenuScene";
import TileActor from "../actors/TileActor";


export default class PipesScene extends Scene {
    constructor(game: IGame) {
        super(game);

        this.actors.backButton = newBackButton(game, (game) => new MenuScene(game));
        
        // A pipe factory :P
        const newPipe = () => {
            const pipe = (game.sprites.pipe() as TileActor);
            pipe.interactive = true;
            let y = 0;
            let x = 0;
            pipe.pointertap = (_: Event) => {
                pipe.setFrame[y][x]?.();
                x++;
                if (x == pipe.gridRectangle.cols - 1) {
                    x = 0;
                    y = y == 1 ? 0 : 1;
                }
            }
            return pipe;
        }

        // Create a GridScene with some pipes and junk
        const grid = new GridScene(this.game, 6, 9, 72, { initial: newPipe });
        grid[3][3] = new RectangleActor(game, 72, 72, 0x666666);
        grid[4][4] = new RectangleActor(game, 72, 72, 0x666666);
        grid.subcontainer = new PIXI.Container();
        this.subscenes = [grid];
        this.beforeMount.add((container: PIXI.Container) => {
            grid.subcontainer!.x = (this.game.width(100) - (grid.gridSize * grid.rows)) / 4;
            grid.subcontainer!.y = this.game.height(100) > 500 ? this.game.height(8) : this.game.height(4);
        });

        logger.info("Created Pipes scene");
    }
}
