import { Grid } from "../layouts/Grid";


export default interface IGrid<T> {
    cols: number,
    rows: number,
    _grid: Grid<T>,
}
