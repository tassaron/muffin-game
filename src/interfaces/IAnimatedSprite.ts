export default interface IAnimatedSprite {
    __width: number,
    __height: number,
    __numFrames: number,
    __currFrame: number,
    __delayInFrames: number,
    __loops: number,
    __animTimer: number,
    tick(delta: number): void,
}