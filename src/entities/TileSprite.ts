import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IGame from "../interfaces/IGame";
import BaseEntity from "./BaseEntity";
import TextureGrid from "../layouts/TextureGrid";


export default class TileSprite extends BaseEntity {
    textureGrid: TextureGrid;

    constructor(game: IGame, textureGrid: TextureGrid) {
        super(game);
        this.textureGrid = textureGrid;
        this.texture = textureGrid.texture;
        this.textureGrid.setFrame[0][0]?.();
    } 
}