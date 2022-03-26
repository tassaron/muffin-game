import * as PIXI from "pixi.js";
import Entity from "../entities/Entity";
import IGrid from "../interfaces/IGrid";
import IKeyboard from "../interfaces/IKeyboard";
import { Grid, createGrid } from "./Grid";


export default class EntityGrid implements IGrid<Entity> {
    gridSize: number;
    mounted: PIXI.Container | null = null;
    cols: number;
    rows: number;
    _grid: Grid<Entity>;
    _interactive = false;

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

    get interactive() {
        return this._interactive;
    }

    set interactive(value: boolean) {
        let cell: Entity | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                cell.interactive = value;
            }
        }
        this._interactive = value;
    }

    mount(container: PIXI.Container) {
        this.mounted = container;
        let cell: Entity | null = null;
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
        let cell: Entity | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                container.removeChild(cell);
            }
        }
    }
}