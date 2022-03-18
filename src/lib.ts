/*
* Provides a consistent API between Pixi's classes and our own
* and in case Pixi's API changes, this file is the main one that needs major editing
*/
import * as PIXI from "pixi.js";
import AnimatedSprite from './entities/AnimatedSprite';

export const newContainer = (parent: PIXI.Container) => {
    const container = new PIXI.Container();
    parent.addChild(container);
    return container;
};

export const newRectangle = (x: number, y: number, w: number, h: number) => new PIXI.Rectangle(x, y, w, h);

export const newSprite = (texture: PIXI.Texture) => new PIXI.Sprite(texture);

export const newAnimatedSprite = (
        texture: PIXI.Texture, w: number, h: number, numFrames: number, delayInFrames: number
    ) => new AnimatedSprite(texture, w, h, numFrames, delayInFrames);
