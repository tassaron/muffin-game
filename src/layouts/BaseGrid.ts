import BaseEntity from "../entities/BaseEntity";
import IGrid from "../interfaces/IGrid";

export default class BaseGrid implements IGrid {
    cols: number;
    rows: number;
    _grid: Array<Array<BaseEntity | null>>;

    constructor(cols: number, rows: number, initial?: any) {
        this.cols = cols;
        this.rows = rows;
        this._grid = Array(rows);
        for (let y = 0; y < this.rows; y++) {
            this._grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                this._grid[y][x] = initial?.();
            }
        }
        for (let y = 0; y < this.rows; y++) {
            Object.defineProperty(this, y, {
              value: this._grid[y]
            });
        }
    }
}