import * as PIXI from "pixi.js";
import BaseEntity from "../entities/BaseEntity";
import IKeyboard from "../interfaces/IKeyboard";
import BaseGrid from "./BaseGrid";


export default class EntityGrid extends BaseGrid {
    gridSize: number;
    mounted: PIXI.Container | null = null;

    constructor(cols: number, rows: number, gridSize: number, initial: any = null) {
        super(cols, rows, initial);
        this.gridSize = gridSize;
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