import * as PIXI from "pixi.js";
import IEntity from "../interfaces/IEntity";
import IGame from "../interfaces/IGame";


export default class DrawnRectangle extends PIXI.Sprite implements IEntity {
    game: IGame;

    constructor(game: IGame, x: number, y: number, w: number, h: number, outline=0x000, colour=0xfff) {
        super();
        this.game = game;
        const graphic = new PIXI.Graphics();
        graphic.beginFill(colour)
            .lineStyle(4, outline)
            .drawRect(x, y, w, h);
        this.texture = game.renderer.generateTexture(graphic);
        this.x = x;
        this.y = y;
        this.texture.update();
    }

    //tick(delta: number) {}
}
