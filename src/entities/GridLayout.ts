import * as PIXI from "pixi.js";
import BaseEntity from "./BaseEntity";
import IGridLayout from "../interfaces/IGridLayout";
import IKeyboard from "../interfaces/IKeyboard";


export default class GridLayout implements IGridLayout {
    cols: number;
    rows: number;
    gridSize: number;
    _grid: Array<Array<BaseEntity | null>>;
    mounted: PIXI.Container | null = null;

    constructor(cols: number, rows: number, gridSize: number, initial: any = null) {
        this.cols = cols;
        this.rows = rows;
        this.gridSize = gridSize;
        this._grid = Array(rows);
        for (let y = 0; y < this.rows; y++) {
            this._grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this._grid[y][x] = initial?.();
            }
        }
        for(let y = 0; y < this.rows; y++) {
            Object.defineProperty(this, y, {
              value: this._grid[y]
            });
          }
    }

    tick(delta: number, keyboard: IKeyboard) {
        for (let row of this._grid) {
            for (let cell of row) {
                cell?.tick(delta, keyboard);
            }
        }
    }

    mount(container: PIXI.Container) {
        this.mounted = container;
        let cell: BaseEntity | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                container.addChild(cell);
                cell.x = container.x + (x * this.gridSize);
                cell.y = container.y + (y * this.gridSize);
            }
        }
    }

    unmount(container: PIXI.Container) {
        this.mounted = null;
        let cell: BaseEntity | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                container.removeChild(cell);
            }
        }
    }
}