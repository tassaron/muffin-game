//import { Sprite } from "./Sprite.js";
import * as PIXI from "pixi.js";
import { newRectangle } from '../lib.js';
import { logger } from '../logger.js';


function setFrame(texture, w, h, number) {
    //logger.debug(`${texture} set frame to: frame: ${number}`);
    texture.frame = newRectangle(number * w, 0, w, h);
}


export default class AnimatedSprite extends PIXI.Sprite {
    constructor(texture, width, height, numFrames, delayInFrames) {
        setFrame(texture, width, height, 0);
        super(texture);
        this.__width = width;
        this.__height = height;
        this.__texture = texture;
        this.__numFrames = numFrames;
        this.__currFrame = 0;
        this.__delayInFrames = delayInFrames;
        this.__animTimer = 0.0;
        this.__loops = 0;
    }

    tick(delta) {
        const newFrame = Math.floor(this.__animTimer / this.__delayInFrames);
        if (newFrame != this.__currFrame) {
            this.__currFrame = newFrame;
            logger.debug(`Frame updated to ${this.__currFrame}`);
            setFrame(this.__texture, this.__width, this.__height, this.__currFrame);
        }
        this.__animTimer += delta;
        if (this.__animTimer > this.__numFrames * this.__delayInFrames) {this.__animTimer = 0.0; this.__loops++;}
        this.__texture.update();
    }
}