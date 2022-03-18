/*
* Provides a consistent API between Pixi's classes and our own
* and in case Pixi's API changes, this file is the main one that needs major editing
*/
import * as PIXI from "pixi.js";
import AnimatedSprite from './entities/AnimatedSprite.js';

export const newContainer = (parent) => {
    const container = new PIXI.Container();
    parent.addChild(container);
    return container;
};

export const newRectangle = (x, y, w, h) => new PIXI.Rectangle(x, y, w, h);

export const newSprite = (texture) => new PIXI.Sprite(texture);

export const newAnimatedSprite = (texture, w, h, numFrames, delayInFrames) => new AnimatedSprite(texture, w, h, numFrames, delayInFrames);
