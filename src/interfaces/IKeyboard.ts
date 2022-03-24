export default interface Keyboard {
    up: boolean,
    down: boolean,
    left: boolean,
    right: boolean,
    number: number,
    p: boolean,

    tick(delta: number): void,
    disable(numFrames: number): void,
    
    _framesDisabled: number,
};
