import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import Entity from "./Entity";
import DrawnRectangle from "./DrawnRectangle";


export default class Button extends Entity {
    constructor(game: IGame, Shape: typeof DrawnRectangle, w: number, h: number, text="", style: null | PIXI.TextStyle = null, colour=0xffffff,  outline: number = 0x000000) {
        super(game);
        const shape = new Shape(game, w, h, colour, outline);
        if (!style) {
            style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 32, fill : outline});
        }
        const pixi_text = new PIXI.Text(text, style)
        shape.anchor.x = 0.5;
        shape.anchor.y = 0.5;
        pixi_text.anchor.x = 0.5;
        pixi_text.anchor.y = 0.5;
        this.addChild(shape);
        shape.addChild(pixi_text);
    }

    //tick(delta: number) {}
}
