//import * as PIXI from "pixi.js";
import BaseEntity from "../entities/BaseEntity";


export default interface IGrid {
    cols: number,
    rows: number,
    _grid: Array<Array<BaseEntity | null>>,
}