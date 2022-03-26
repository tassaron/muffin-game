import IGrid from "../interfaces/IGrid";


export type Grid<T> = Array<Array<T | null>>;


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