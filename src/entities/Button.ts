import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import DrawnRectangle from "./DrawnRectangle";


export default class Button extends DrawnRectangle {
    constructor(game: IGame, x: number, y: number, w: number, h: number, outline=0x000, colour=0xfff, text="", style: null | PIXI.TextStyle = null) {
        super(game, x, y, w, h, outline, colour);
        if (!style) {
            style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 24, fill : outline});
        }
        const pixi_text = new PIXI.Text(text, style)
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        pixi_text.anchor.x = 0.5;
        pixi_text.anchor.y = 0.5;
        this.addChild(pixi_text);
    }

    //tick(delta: number) {}
}
