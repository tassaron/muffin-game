import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IEntity from "../interfaces/IEntity";
import IGame from "../interfaces/IGame";


export default class DrawnRectangle extends PIXI.Sprite implements IEntity {
    game: IGame;

    constructor(game: IGame, w: number, h: number, outline=0x000, colour=0xfff) {
        super();
        this.game = game;
        const outlineThickness = 4;
        const graphic = new PIXI.Graphics();
        graphic.beginFill(colour)
            .lineStyle(outlineThickness, outline)
            .drawRect(0, 0, w - outlineThickness, h - outlineThickness);
        this.texture = game.renderer.generateTexture(graphic);
        logger.debug(`Created primitive texture with dimensions ${this.texture.width}x${this.texture.height}`);
    }

    //tick(delta: number) {}
}
