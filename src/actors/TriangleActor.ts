import * as PIXI from "pixi.js";
import RectangleActor from "./RectangleActor";


export default class TriangleActor extends RectangleActor {
    newGraphic(w: number, h: number, colour: number, outline: number | null) {
        let outlineThickness: number;
        const graphic = new PIXI.Graphics();
        graphic.beginFill(colour, 1);
        
        if (outline === null) {
            outlineThickness = 0;
            graphic.lineStyle(outlineThickness, 0x000000, 1);
        } else {
            outlineThickness = 4;
            graphic.lineStyle(outlineThickness, outline, 1);
        }
        
        graphic.moveTo(w, 0)
            .lineTo(w / 2, h)
            .lineTo(0, 0)
            .lineTo(w, 0)
            .endFill();
        return graphic
    }
}
