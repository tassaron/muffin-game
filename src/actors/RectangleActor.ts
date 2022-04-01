import * as PIXI from "pixi.js";
import { logger } from "../core/logger";
import Actor from "./Actor";
import IGame from "../interfaces/IGame";


export default class RectangleActor extends Actor {
    constructor(game: IGame, w: number, h: number, colour=0xffffff, outline: number | null = 0x000000) {
        super(game);
        let graphic: PIXI.Graphics;
        graphic = this.newGraphic(w, h, colour, outline);
        if (game.renderer === undefined) {
            logger.error("Tried to draw graphic before the Pixi renderer exists. To fix this, delay instantiation of this actor");
        }
        this.texture = game.renderer.generateTexture(graphic);
        logger.debug(`Created primitive texture with dimensions ${this.texture.width}x${this.texture.height}`);
    }

    newGraphic(w: number, h: number, colour: number, outline: number | null) {
        let outlineThickness: number;
        const graphic = new PIXI.Graphics();
        if (outline === null) {
            outlineThickness = 0;
            graphic.lineStyle(outlineThickness, 0x000000)
        } else {
            outlineThickness = 4;
            graphic.lineStyle(outlineThickness, outline)
        }
        graphic.beginFill(colour)
        this.drawShape(graphic, w, h, outlineThickness);
        return graphic;
    }

    drawShape(graphic: PIXI.Graphics, w: number, h: number, outlineThickness: number) {
        graphic.drawRect(0, 0, w - outlineThickness, h - outlineThickness);
    }

    //tick(delta: number) {}
}
