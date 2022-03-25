import * as PIXI from "pixi.js";
import BaseEntity from "../entities/BaseEntity";
import BaseGrid from "./BaseGrid";


export default class TextureMap extends BaseGrid {
    cols: number;
    rows: number;
    _grid: Array<Array<BaseEntity | null>>;

    constructor(cols: number, rows: number, texture: PIXI.Texture) {
        super(cols, rows);
    }
}