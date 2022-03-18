import IGame from "./IGame";

export default interface IScene {
    game: IGame,
    actors: any,
    isPausedScene: boolean,
    tick(delta: number, keyboard: any): void,
}