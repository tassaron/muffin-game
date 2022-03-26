import * as PIXI from "pixi.js";
import RectangleActor from "./RectangleActor";


export default class EllipseActor extends RectangleActor {
    drawShape(graphic: PIXI.Graphics, w: number, h: number, outlineThickness: number) {
        graphic.drawEllipse(0, 0, w - outlineThickness, h - outlineThickness);
    }
}
