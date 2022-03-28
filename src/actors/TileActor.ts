import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import Actor from "./Actor";
import GridRectangle from "../grids/GridRectangle";


export default class TileActor extends Actor {
    gridRectangle: GridRectangle;
    setFrame: Array<Array<() => void>>;

    constructor(game: IGame, texture: PIXI.Texture, cols: number, rows: number, gridSize: number) {
        super(game);
        this.gridRectangle = new GridRectangle(cols, rows, gridSize);
        this.texture = texture.clone();

        const frames = Array(this.gridRectangle.rows);
        for (let y = 0; y < this.gridRectangle.rows; y++) {
            frames[y] = [];
            for (let x = 0; x < this.gridRectangle.cols; x++) {
                frames[y][x] = () => this.gridRectangle.setFrame[y][x]?.(this.texture);
            }
        }
        this.setFrame = frames;
        this.setFrame[0][0]?.();
    }
}