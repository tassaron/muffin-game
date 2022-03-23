import * as PIXI from "pixi.js";
import IAnimatedSprite from "../interfaces/IAnimatedSprite";
import { newRectangle } from '../lib';
import { logger } from '../logger';


function setFrame(texture: PIXI.Texture, w: number, h: number, number: number) {
    //logger.debug(`${texture} set frame to: frame: ${number}`);
    texture.frame = newRectangle(number * w, 0, w, h);
}


export default class AnimatedSprite extends PIXI.Sprite implements IAnimatedSprite {
    __width: number;
    __height: number;
    __numFrames: number;
    __currFrame: number;
    __delayInFrames: number;
    __loops: number;
    __animTimer: number;

    constructor(texture: PIXI.Texture, width: number, height: number, numFrames: number, delayInFrames: number) {
        setFrame(texture, width, height, 0);
        super(texture);
        this.__width = width;
        this.__height = height;
        this.__numFrames = numFrames;
        this.__currFrame = 0;
        this.__delayInFrames = delayInFrames;
        this.__animTimer = 0.0;
        this.__loops = 0;
    }

    tick(delta: number) {
        const newFrame = Math.floor(this.__animTimer / this.__delayInFrames);
        if (newFrame != this.__currFrame) {
            this.__currFrame = newFrame;
            logger.debug(`Frame updated to ${this.__currFrame}`);
            setFrame(this.texture, this.__width, this.__height, this.__currFrame);
        }
        this.__animTimer += delta;
        if (this.__animTimer > this.__numFrames * this.__delayInFrames) {this.__animTimer = 0.0; this.__loops++;}
        this.texture.update();
    }
}