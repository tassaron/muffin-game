import IGrid from "../interfaces/IGrid";


export default class Grid<T> implements IGrid<T> {
    cols: number;
    rows: number;
    gridSize: number;
    _grid: Array<Array<T | null>>;
    [key: number]: Array<T | null>;

    constructor(cols: number, rows: number, gridSize: number, initial: (() => T | null) | null = null) {
        this.cols = cols;
        this.rows = rows;
        this.gridSize = gridSize;
        this._grid = createGrid<T>(cols, rows, initial);
        for (let y = 0; y < rows; y++) {
            Object.defineProperty(this, y, {
                value: this._grid[y]
            });
        }
    }
}


export function createGrid<T>(cols: number, rows: number, initial: (() => T | null) | null = null) {
    const _grid: Array<Array<T | null>> = Array(rows);
    for (let y = 0; y < rows; y++) {
        _grid[y] = [];
        for (let x = 0; x < cols; x++) {
            _grid[y][x] = initial ? initial() : null;
        }
    }
    return _grid;
}