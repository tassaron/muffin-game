import * as PIXI from "pixi.js";
import DrawnRectangle from "./DrawnRectangle";


export default class DrawnEllipse extends DrawnRectangle {
    drawShape(graphic: PIXI.Graphics, w: number, h: number, outlineThickness: number) {
        graphic.drawEllipse(0, 0, w - outlineThickness, h - outlineThickness);
    }
}
