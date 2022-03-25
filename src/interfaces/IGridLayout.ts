import * as PIXI from "pixi.js";
import BaseEntity from "../entities/BaseEntity";


export default interface IGridLayout {
    cols: number,
    rows: number,
    gridSize: number,
    _grid: Array<Array<BaseEntity | null>>,
    mounted: PIXI.Container | null,
    mount(container: PIXI.Container): void,
    unmount(container: PIXI.Container): void,
}