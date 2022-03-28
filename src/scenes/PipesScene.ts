import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import RectangleActor from "../actors/RectangleActor";
import IKeyboard from "../interfaces/IKeyboard";
import ActorGrid from "../grids/ActorGrid";
import { newBackButton } from "./MenuScene";


export default class PipesScene extends Scene {
    gridContainer = new PIXI.Container();
    grid: ActorGrid;

    constructor(game: IGame) {
        super(game);

        this.actors.backButton = newBackButton(game);
        
        // A pipe factory :P
        const newPipe = () => {
            const pipe = game.sprites.pipe();
            pipe.interactive = true;
            let y = 0;
            let x = 0;
            pipe.pointertap = (_: Event) => {
                pipe.setFrame[y][x]?.();
                x++;
                if (x == pipe.textureGrid.cols - 1) {
                    x = 0;
                    y = y == 1 ? 0 : 1;
                }
            }
            return pipe;
        }

        // Create an ActorGrid with some pipes and junk
        this.gridContainer.x = 36;
        this.gridContainer.y = 36;
        this.grid = new ActorGrid(6, 9, 72, newPipe);
        this.grid[3][3] = new RectangleActor(game, 72, 72, 0x666666);
        this.grid[4][4] = new RectangleActor(game, 72, 72, 0x666666);

        logger.info("Created Pipes scene");
    }

    mount(container: PIXI.Container) {
        super.mount(container);
        this.grid.mount(this.gridContainer);
        container.addChild(this.gridContainer);
    }

    unmount(container: PIXI.Container) {
        super.unmount(container);
        container.removeChild(this.gridContainer);
        this.grid.unmount(this.gridContainer);
    }

    tick(delta: number, keyboard: IKeyboard) {
        super.tick(delta, keyboard);
        this.grid.tick(delta, keyboard);
    }
}
