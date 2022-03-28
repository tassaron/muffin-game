export default interface IGrid<T> {
    cols: number,
    rows: number,
    _grid: Array<Array<T | null>>,
    [key: number]: Array<T | null>;
}
