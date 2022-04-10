import IGame from "./IGame";
import IKeyboard from "./IKeyboard";


export default interface IGameState {
    flags: {
        gameOver: boolean,
        paused: boolean,
        doGameOver: boolean,
        doPause: boolean,
    },
    functions: {
        tick (self: IGame, delta: number, keyboard: IKeyboard): void,
    },
}
