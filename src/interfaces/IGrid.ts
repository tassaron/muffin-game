export default interface IGrid<T> {
    cols: number,
    rows: number,
    _grid: Grid<T>,
}

export type Grid<T> = Array<Array<T | null>>;