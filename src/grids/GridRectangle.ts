import * as PIXI from "pixi.js";
import { logger } from "../logger";
import Grid from "./Grid";


const setFrame = (self: GridRectangle, x: number, y: number): (texture: PIXI.Texture) => void => {
    return (texture: PIXI.Texture) => {
        if (self._grid[y][x] != null) {
            texture.frame = self._grid[y][x] as PIXI.Rectangle;
        };
    };
};


export default class GridRectangle extends Grid<PIXI.Rectangle> {
    setFrame: Array<Array<(texture: PIXI.Texture) => void>>;

    constructor(cols: number, rows: number, gridSize: number) {
        let x = -1;
        let y = 0;
        const initial = () => {
            x++;
            if (x == cols) {
                x=0;
                y++;
            }
            logger.verbose(`Creating rectangle for GridRectangle x${x * gridSize}, y${y * gridSize}`);
            return new PIXI.Rectangle(x * gridSize, y * gridSize, gridSize, gridSize);
        }

        super(cols, rows, gridSize, initial);
        
        // Create grid of setFrame() funcs parallel to grid of Rectangles
        const frames = Array(rows);
        for (let y = 0; y < this.rows; y++) {
            frames[y] = [];
            for (let x = 0; x < this.cols; x++) {
                frames[y][x] = setFrame(this, x, y);
            }
        }
        this.setFrame = frames;
    }
}