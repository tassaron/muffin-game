import * as PIXI from "pixi.js";
import { logger } from "../logger";
import IEntity from "../interfaces/IEntity";
import IGame from "../interfaces/IGame";


export default class DrawnEllipse extends PIXI.Sprite implements IEntity {
    game: IGame;

    constructor(game: IGame, w: number, h: number, colour=0xffffff, outline: number | null = 0x000000) {
        super();
        this.game = game;
        let outlineThickness;
        const graphic = new PIXI.Graphics();
        if (outline === null) {
            outlineThickness = 0;
            graphic.lineStyle(outlineThickness, 0x000000)
        } else {
            outlineThickness = 4;
            graphic.lineStyle(outlineThickness, outline)
        }
        graphic.beginFill(colour)
        graphic.drawEllipse(0, 0, w - outlineThickness, h - outlineThickness);
        this.texture = game.renderer.generateTexture(graphic);
        logger.debug(`Created primitive texture (ellipse) with dimensions ${this.texture.width}x${this.texture.height}`);
    }

    //tick(delta: number) {}
}
