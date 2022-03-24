export default interface IAnimatedSprite {
    __width: number,
    __height: number,
    numFrames: number,
    currFrame: number,
    delayInFrames: number,
    loops: number,
    animTimer: number,
    tick(delta: number): void,
}