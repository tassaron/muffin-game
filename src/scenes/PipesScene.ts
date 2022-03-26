import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Scene from "./Scene";
import RectangleActor from "../actors/RectangleActor";
import IKeyboard from "../interfaces/IKeyboard";
import ActorGrid from "../grids/ActorGrid";
import { newBackButton } from "./MenuScene";


export default class PipesScene extends Scene {
    actors: any = {};

    constructor(game: IGame) {
        super(game);

        this.actors.backButton = newBackButton(game);
        
        // A pipe factory :P
        const newPipe = () => {
            const pipe = game.sprites.pipe();
            pipe.interactive = true;
            let y = 0;
            let x = 0;
            pipe.click = (_: Event) => {
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
        this.actors.gridContainer = new PIXI.Container();
        this.actors.gridContainer.x = 36;
        this.actors.gridContainer.y = 36;
        this.actors.grid = new ActorGrid(6, 9, 72, newPipe);
        this.actors.grid[3][3] = new RectangleActor(game, 72, 72, 0x666666);
        this.actors.grid[4][4] = new RectangleActor(game, 72, 72, 0x666666);

        logger.info("Created Pipes scene");
    }

    mount(container: PIXI.Container) {
        this.game.prevScene.unmount(container);
        container.addChild(this.actors.backButton);
        container.addChild(this.actors.gridContainer);
        this.actors.grid.mount(this.actors.gridContainer);
    }

    unmount(container: PIXI.Container) {
        container.removeChild(this.actors.backButton);
        container.removeChild(this.actors.gridContainer);
        this.actors.grid.unmount(this.actors.gridContainer);
    }

    tick(delta: number, keyboard: IKeyboard) {
        this.actors.grid.tick(delta, keyboard);
    }
}
