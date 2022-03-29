import * as PIXI from "pixi.js";
import IAnimatedActor from "../interfaces/IAnimatedActor";
import IGame from "../interfaces/IGame";
import Actor from "./Actor";
import { logger } from '../core/logger';


function setFrame(texture: PIXI.Texture, w: number, h: number, number: number) {
    logger.spam(`AnimatedActor updated frame to ${number}`);
    texture.frame = new PIXI.Rectangle(number * w, 0, w, h);
}


export default class AnimatedActor extends Actor implements IAnimatedActor {
    animatedWidth: number;
    animatedHeight: number;
    numFrames: number;
    currFrame: number;
    delayInFrames: number;
    animTimer: number;
    loops: number;

    constructor(game: IGame, texture: PIXI.Texture, width: number, height: number, numFrames: number, delayInFrames: number) {
        setFrame(texture, width, height, 0);
        super(game);
        this.texture = texture;
        this.animatedWidth = width;
        this.animatedHeight = height;
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
            setFrame(this.texture, this.animatedWidth, this.animatedHeight, this.currFrame);
        }
        this.animTimer += delta;
        if (this.animTimer > this.numFrames * this.delayInFrames) {this.animTimer = 0.0; this.loops++;}
        this.texture.update();
    }
}