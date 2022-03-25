import * as PIXI from "pixi.js";
import { createGrid } from "./EntityGrid";
import IGrid, { Grid } from "../interfaces/IGrid";
import { logger } from "../logger";


const setFrame = (self: TextureGrid, x: number, y: number): () => void => {
    return () => {
        if (self._grid[y][x] != null) {
            self.texture.frame = self._grid[y][x] as PIXI.Rectangle;
        };
    };
};


export default class TextureGrid implements IGrid<PIXI.Rectangle> {
    gridSize: number;
    cols: number;
    rows: number;
    _grid: Grid<PIXI.Rectangle>;
    texture: PIXI.Texture;
    setFrame: Grid<() => void>;

    constructor(cols: number, rows: number, gridSize: number, texture: PIXI.Texture) {
        this.cols = cols;
        this.rows = rows;
        this.texture = texture;
        

        let x = -1;
        let y = 0;
        const initial = () => {
            x++;
            if (x == cols) {
                x=0;
                y++;
            }
            logger.verbose(`Creating rectangle for TextureGrid x${x * gridSize}, y${y * gridSize}`);
            return new PIXI.Rectangle(x * gridSize, y * gridSize, gridSize, gridSize);
        }
        /*
       const _grid = Array(rows);
       for (let y = 0; y < this.rows; y++) {
            _grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                _grid[y][x] = new PIXI.Rectangle(x, y, gridSize, gridSize);//initial();
            }
        }*/

        this._grid = createGrid(this, initial);

        const frames = Array(rows);
        for (let y = 0; y < this.rows; y++) {
            frames[y] = [];
            for (let x = 0; x < this.cols; x++) {
                frames[y][x] = setFrame(this, x, y);
            }
            /*Object.defineProperty(this, y, {
                value: frames[y]
            });*/
        }

        this.setFrame = frames;
        this.gridSize = gridSize;
    }
}