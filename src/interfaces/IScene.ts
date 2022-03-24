import IGame from "./IGame";
import IKeyboard from "./IKeyboard";

export default interface IScene {
    game: IGame,
    actors: any,
    tick(delta: number, keyboard: IKeyboard): void,
}