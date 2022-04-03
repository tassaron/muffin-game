import * as PIXI from "pixi.js";
import IActor from "../interfaces/IActor";
import IGame from "../interfaces/IGame";
import IKeyboard from "../interfaces/IKeyboard";
import IScene from "../interfaces/IScene";
import { SceneOptions, sceneConstructor, setInteractive, tick, mount, unmount, Lifecycle } from "../scenes/Scene";
import Grid from "./Grid";


export class GridSceneOptions extends SceneOptions {
    initial?: (() => IActor | null) | null;
}


export default class GridScene extends Grid<IActor> implements IScene {
    game!: IGame;
    actors: {[name: string]: IActor};
    subscenes: IScene[] = [];
    mounted: PIXI.Container | null = null;
    subcontainer: PIXI.Container | null = null;
    beforeMount = new Lifecycle<((container: PIXI.Container) => void)>();
    beforeUnmount = new Lifecycle<((container: PIXI.Container) => void)>();
    beforeTick = new Lifecycle<((delta: number, keyboard: IKeyboard) => void)>();
    _interactive = false;

    constructor(game: IGame, cols: number, rows: number, gridSize: number, options: GridSceneOptions = {}) {
        super(cols, rows, gridSize, options.initial == undefined ? null : options.initial);
        sceneConstructor(this, game, options);
        this.actors = {};
    }

    tick(delta: number, keyboard: IKeyboard) {
        tick(this, delta, keyboard);
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
        setInteractive(this, value);
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
        mount(this, container);
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
    }

    unmount(container: PIXI.Container) {
        unmount(this, container);
        const subcontainer = this.subcontainer == null ? container : this.subcontainer;
        let cell: IActor | null = null;
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                cell = this._grid[x][y];
                if (!cell) continue;
                subcontainer.removeChild(cell);
            }
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
}
