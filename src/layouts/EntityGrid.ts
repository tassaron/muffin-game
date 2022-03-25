import * as PIXI from "pixi.js";
import BaseEntity from "../entities/BaseEntity";
import IGrid, { Grid } from "../interfaces/IGrid";
import IKeyboard from "../interfaces/IKeyboard";


export function createGrid(self: IGrid<any>, initial: any) {
    const _grid = Array(self.rows);
    for (let y = 0; y < self.rows; y++) {
        _grid[y] = [];
        for (let x = 0; x < self.cols; x++) {
            _grid[y][x] = initial?.();
        }
        Object.defineProperty(self, y, {
            value: _grid[y]
        });
    }
    return _grid;
}


export default class EntityGrid implements IGrid<BaseEntity> {
    gridSize: number;
    mounted: PIXI.Container | null = null;
    cols: number;
    rows: number;
    _grid: Grid<BaseEntity>

    constructor(cols: number, rows: number, gridSize: number, initial: any = null) {
        this.cols = cols;
        this.rows = rows;
        this.gridSize = gridSize;
        this._grid = createGrid(this, initial);
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