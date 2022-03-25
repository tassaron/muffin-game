import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseEntity from "./BaseEntity";
import TextureGrid from "../layouts/TextureGrid";
import { Grid } from "../interfaces/IGrid";


export default class TileSprite extends BaseEntity {
    textureGrid: TextureGrid;
    setFrame: Grid<() => void>;

    constructor(game: IGame, texture: PIXI.Texture, textureGrid: TextureGrid) {
        super(game);
        this.textureGrid = textureGrid;
        this.texture = texture.clone();

        const frames = Array(textureGrid.rows);
        for (let y = 0; y < this.textureGrid.rows; y++) {
            frames[y] = [];
            for (let x = 0; x < textureGrid.cols; x++) {
                frames[y][x] = () => textureGrid.setFrame[y][x]?.(this.texture);
            }
        }
        this.setFrame = frames;
        this.setFrame[0][0]?.();
    }
}