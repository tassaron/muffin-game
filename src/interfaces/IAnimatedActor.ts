import IActor from "./IActor";

export default interface IAnimatedActor extends IActor {
    animatedWidth: number,
    animatedHeight: number,
    numFrames: number,
    currFrame: number,
    delayInFrames: number,
    loops: number,
    animTimer: number,
}