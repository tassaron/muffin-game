import * as PIXI from "pixi.js";
import IActor from "../interfaces/IActor";
import IGame from "../interfaces/IGame";
import IKeyboard from "../interfaces/IKeyboard";
import IScene from "../interfaces/IScene";
import { SceneOptions, constructorOptions, beforeMount } from "../scenes/Scene";
import Grid from "./Grid";


export class GridSceneOptions extends SceneOptions {
    initial?: (() => IActor | null) | null;
}


export default class GridScene extends Grid<IActor> implements IScene {
    game: IGame;
    actors: {[name: string]: IActor};
    subscenes: IScene[] = [];
    mounted: PIXI.Container | null = null;
    subcontainer: PIXI.Container | null = null;
    _beforeMountFuncs: ((container: PIXI.Container) => void)[];
    _interactive = false;

    constructor(game: IGame, cols: number, rows: number, gridSize: number, options: GridSceneOptions = {}) {
        super(cols, rows, gridSize, options.initial == undefined ? null : options.initial);
        this.game = game;
        this.actors = {};
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                if (this._grid[y][x] !== null) this.actors[`${y},${x}`] = (this._grid[y][x] as IActor);
            }
        }
        this._beforeMountFuncs = constructorOptions(this, options);
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
        let cell: IActor | null = null;
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
        for (let func of this._beforeMountFuncs) {
            func(container);
        }
        const subcontainer = this.subcontainer == null ? container : this.subcontainer;
        let cell: IActor | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                subcontainer.addChild(cell);
                cell.x = subcontainer.x + (x * this.gridSize);
                cell.y = subcontainer.y + (y * this.gridSize);
            }
        }
        if (subcontainer !== container) {
            container.addChild(subcontainer);
        }
    }

    unmount(container: PIXI.Container) {
        this.mounted = null;
        const subcontainer = this.subcontainer == null ? container : this.subcontainer;
        let cell: IActor | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                subcontainer.removeChild(cell);
            }
        }
        if (subcontainer !== container) {
            container.removeChild(subcontainer);
        }
    }

    addActors(actors: IActor[]): string[] {
        /* Place actors at random positions on the grid */
        const names: Set<string> = new Set();
        let x: number, y: number, name: string;
        for (let actor of actors) {
            while (true) {
                x = Math.floor(Math.random() * this.cols);
                y = Math.floor(Math.random() * this.rows);
                name = `${y},${x}`;
                if (names.has(name)) continue
                names.add(name);
                this._grid[y][x] = actor;
                break;
            }
        }
        return Array.from(names);
    }

    beforeMount(func: (container: PIXI.Container) => void): (container: PIXI.Container) => void {
        return beforeMount(this, func);
    }
}