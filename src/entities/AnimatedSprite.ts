import * as PIXI from "pixi.js";
import IAnimatedSprite from "../interfaces/IAnimatedSprite";
import IGame from "../interfaces/IGame";
import BaseEntity from "./BaseEntity";
import { logger } from '../logger';


function setFrame(texture: PIXI.Texture, w: number, h: number, number: number) {
    logger.spam(`AnimatedSprite updated frame to ${number}`);
    texture.frame = new PIXI.Rectangle(number * w, 0, w, h);
}


export default class AnimatedSprite extends BaseEntity implements IAnimatedSprite {
    __width: number;
    __height: number;
    numFrames: number;
    currFrame: number;
    delayInFrames: number;
    animTimer: number;
    loops: number;

    constructor(game: IGame, texture: PIXI.Texture, width: number, height: number, numFrames: number, delayInFrames: number) {
        setFrame(texture, width, height, 0);
        super(game);
        this.texture = texture;
        this.__width = width;
        this.__height = height;
        this.numFrames = numFrames;
        this.currFrame = 0;
        this.delayInFrames = delayInFrames;
        this.animTimer = 0.0;
        this.loops = 0;
    }

    tick(delta: number) {
        const newFrame = Math.floor(this.animTimer / this.delayInFrames);
        if (newFrame != this.currFrame) {
            this.currFrame = newFrame;
            setFrame(this.texture, this.__width, this.__height, this.currFrame);
        }
        this.animTimer += delta;
        if (this.animTimer > this.numFrames * this.delayInFrames) {this.animTimer = 0.0; this.loops++;}
        this.texture.update();
    }
}