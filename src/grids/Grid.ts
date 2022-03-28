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
        this._grid = createGrid<T>(this, initial);
    }
}


export function createGrid<T>(self: IGrid<T>, initial: (() => T | null) | null) {
    const _grid: Array<Array<T | null>> = Array(self.rows);
    for (let y = 0; y < self.rows; y++) {
        _grid[y] = [];
        for (let x = 0; x < self.cols; x++) {
            _grid[y][x] = initial ? initial() : null;
        }
        Object.defineProperty(self, y, {
            value: _grid[y]
        });
    }
    return _grid;
}